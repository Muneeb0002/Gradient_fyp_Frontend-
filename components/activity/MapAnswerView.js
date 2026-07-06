import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";
import Colors from "../../constants/Colors";
import { sanitizeDisplayText } from "../../lib/displayText";

const toLatLng = ([lat, lng]) => ({ latitude: lat, longitude: lng });

function isCoordPair(val) {
  return (
    Array.isArray(val) &&
    val.length === 2 &&
    typeof val[0] === "number" &&
    typeof val[1] === "number"
  );
}

// Turns a 2-point bounding box [[lat1,lng1],[lat2,lng2]] into a 4-corner rectangle
function bboxToRect(coords) {
  const [[lat1, lng1], [lat2, lng2]] = coords;
  return [
    [lat1, lng1],
    [lat1, lng2],
    [lat2, lng2],
    [lat2, lng1],
  ];
}

/**
 * Normalizes any of the backend's geo response shapes into a flat list of
 * drawable shapes: { kind: 'marker'|'polyline'|'polygon', coords, label, description, color }
 *
 * Supports:
 * 1. Flat style — item.data is an array of [lat,lng] pairs directly
 *    (old points/paths/regions format)
 * 2. Single-point style — item.data IS the [lat,lng] pair itself
 *    (common for single "points", since a point doesn't need a list)
 * 3. Nested style — item.data is an array of sub-features:
 *    { name, coordinates: [[lat,lng], ...], description }
 *    (features / newer regions format). coordinates with 2 points are
 *    treated as a bounding box and expanded into a rectangle.
 */
function normalizeGroup(group, groupName) {
  const shapes = [];

  (group || []).forEach((item) => {
    let data = item?.data;
    if (!Array.isArray(data) || data.length === 0) return;

    // NEW: handle the case where `data` itself is a single [lat, lng] pair
    // (e.g. a single point sent as [lat, lng] instead of [[lat, lng]]).
    if (isCoordPair(data)) {
      data = [data];
    }

    const parentColor = item.color;
    const parentFacts = item.facts || item.description || item.desc;
    const parentLabel = item.label || item.name || item.title;

    // Flat style: data itself is a coordinate list
    if (isCoordPair(data[0])) {
      let kind = "polyline";
      if (groupName === "points") kind = "marker";
      else if (groupName === "regions" || item.type === "region") kind = "polygon";

      shapes.push({
        kind,
        coords: data,
        label: parentLabel,
        description: parentFacts,
        color: parentColor,
      });
      return;
    }

    // Nested style: data is a list of named sub-features
    data.forEach((sub) => {
      let coords = sub?.coordinates;

      // NEW: same single-pair guard for nested sub-features
      if (isCoordPair(coords)) {
        coords = [coords];
      }
      if (!Array.isArray(coords) || coords.length === 0) return;

      let kind = "polygon";
      let polyCoords = coords;

      if (coords.length === 1) {
        kind = "marker";
      } else if (coords.length === 2) {
        polyCoords = bboxToRect(coords);
      }

      shapes.push({
        kind,
        coords: polyCoords,
        label: sub.name || sub.title || sub.label || parentLabel,
        description: sub.description || sub.facts || parentFacts,
        color: parentColor,
      });
    });
  });

  return shapes;
}

// Computes a coordinate to anchor a floating label at:
// - marker: the point itself
// - polyline/polygon: the centroid (average) of all its coordinates
function getLabelAnchor(shape) {
  if (shape.kind === "marker") return shape.coords[0];
  const lat = shape.coords.reduce((sum, c) => sum + c[0], 0) / shape.coords.length;
  const lng = shape.coords.reduce((sum, c) => sum + c[1], 0) / shape.coords.length;
  return [lat, lng];
}

function normalizeGeoData(response) {
  if (!response) return [];
  return [
    ...normalizeGroup(response.points, "points"),
    ...normalizeGroup(response.paths, "paths"),
    ...normalizeGroup(response.regions, "regions"),
    ...normalizeGroup(response.features, "features"),
  ];
}

export function hasGeoData(response) {
  if (!response) return false;
  const { points = [], paths = [], regions = [], features = [] } = response;
  return (
    points.length > 0 ||
    paths.length > 0 ||
    regions.length > 0 ||
    features.length > 0
  );
}

export default function MapAnswerView({ response }) {
  const mapRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const shapes = normalizeGeoData(response);
  if (shapes.length === 0) return null;

  const allCoords = shapes.flatMap((s) => s.coords.map(toLatLng));
  if (allCoords.length === 0) return null;

  const initialRegion = {
    latitude: allCoords[0].latitude,
    longitude: allCoords[0].longitude,
    latitudeDelta: 6,
    longitudeDelta: 6,
  };

  const onMapReady = () => {
    if (allCoords.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(allCoords, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    }
  };

  return (
    <View style={styles.wrap}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={onMapReady}
      >
        {shapes.map((shape, idx) => {
          const color = shape.color || Colors.accent;

          if (shape.kind === "marker") {
            return (
              <Marker
                key={`shape-${idx}`}
                coordinate={toLatLng(shape.coords[0])}
                anchor={{ x: 0.5, y: 1 }}
                tracksViewChanges={true}
                zIndex={10}
                onPress={() => setSelected(shape)}
              >
                <View style={styles.pinLabelWrap}>
                  <View style={[styles.labelBubble, { borderColor: color }]}>
                    <Text style={styles.labelText} numberOfLines={1}>
                      {shape.label || "Untitled"}
                    </Text>
                  </View>
                  <View style={[styles.pinDot, { backgroundColor: color }]} />
                </View>
              </Marker>
            );
          }

          if (shape.kind === "polyline") {
            return (
              <Polyline
                key={`shape-${idx}`}
                coordinates={shape.coords.map(toLatLng)}
                strokeColor={color}
                strokeWidth={3}
                tappable
                onPress={() => setSelected(shape)}
              />
            );
          }

          return (
            <Polygon
              key={`shape-${idx}`}
              coordinates={shape.coords.map(toLatLng)}
              strokeColor={color}
              fillColor={`${color}33`}
              strokeWidth={2}
              tappable
              onPress={() => setSelected(shape)}
            />
          );
        })}

        {/* Always-visible name labels for lines and regions (markers already
            carry their own label above), placed at each shape's centroid */}
        {shapes
          .filter((shape) => shape.kind !== "marker" && shape.label)
          .map((shape, idx) => {
            const color = shape.color || Colors.accent;
            return (
              <Marker
                key={`label-${idx}`}
                coordinate={toLatLng(getLabelAnchor(shape))}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={true}
                zIndex={10}
                onPress={() => setSelected(shape)}
              >
                <View style={[styles.labelBubble, { borderColor: color }]}>
                  <Text style={styles.labelText} numberOfLines={1}>
                    {shape.label}
                  </Text>
                </View>
              </Marker>
            );
          })}
      </MapView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.legendRow}
      >
        {shapes.map((shape, idx) => (
          <TouchableOpacity
            key={`legend-${idx}`}
            style={[
              styles.legendChip,
              selected === shape && styles.legendChipActive,
            ]}
            onPress={() => setSelected(shape)}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: shape.color || Colors.accent },
              ]}
            />
            <Text style={styles.legendText}>{shape.label || "Untitled"}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected ? (
        <View style={styles.factBox}>
          <Text style={styles.factTitle}>{selected.label}</Text>
          {selected.description ? (
            <Text style={styles.factText}>
              {sanitizeDisplayText(selected.description)}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 10 },
  map: { width: "100%", height: 260, borderRadius: 14, overflow: "hidden" },
  legendRow: { marginTop: 10 },
  legendChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  legendChipActive: { borderColor: Colors.accent },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  factBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  factTitle: { color: Colors.accent, fontWeight: "800", marginBottom: 4 },
  factText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },
  pinLabelWrap: { alignItems: "center" },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  labelBubble: {
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
    maxWidth: 190,
  },
  labelText: {
    color: "black",
    fontSize: 4,
    fontWeight: "700",
  },
});