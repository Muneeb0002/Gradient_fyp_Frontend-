import { Text, View } from "react-native";
import Colors from "../../constants/Colors";
import GeoMapView from "./GeoMapView";

// ✅ Safe coordinate converter
const toLatLng = (coord) => {
  if (!coord) return null;

  // Array format: [lat, lng]
  if (Array.isArray(coord)) {
    const lat = parseFloat(coord[0]);
    const lng = parseFloat(coord[1]);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { latitude: lat, longitude: lng };
  }

  // Object format: { latitude, longitude } ya { lat, lng }
  if (typeof coord === "object") {
    const lat = parseFloat(coord.latitude ?? coord.lat);
    const lng = parseFloat(coord.longitude ?? coord.lng);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { latitude: lat, longitude: lng };
  }

  return null;
};

export default function GeoMap({ data }) {
  const features = Array.isArray(data) ? data : [];

  const mapObjects = features.map((feat) => {
    // ✅ FIX: feat.data ke andar har item ka .coordinates extract karo
    const coords = (feat.data || [])
      .flatMap((pt) => {
        // pt ek object hai: { name, coordinates: [[lat,lng], ...], description }
        if (pt?.coordinates && Array.isArray(pt.coordinates)) {
          return pt.coordinates.map(toLatLng).filter(Boolean);
        }
        // Fallback: pt khud [lat, lng] ho
        const direct = toLatLng(pt);
        return direct ? [direct] : [];
      });

    return {
      label: feat.label || "Unknown",
      color: feat.color || Colors.accent,
      coords,
      facts: feat.facts || "",
    };
  });

  // ✅ Valid mapObjects — sirf wo dikhao jinka coords.length >= 2
  const validMapObjects = mapObjects.filter((obj) => obj.coords.length >= 1);

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <Text style={{ color: Colors.accent, fontWeight: "700", marginBottom: 8 }}>
        Map Analysis
      </Text>

      {validMapObjects.length > 0 ? (
        <View style={{ borderRadius: 10, overflow: "hidden" }}>
          <GeoMapView
            rivers={validMapObjects}
            onFeaturePress={() => {}}
            selectedFeatureId={null}
          />
        </View>
      ) : (
        <Text style={{ color: "white", marginTop: 10 }}>
          No map data available.
        </Text>
      )}

      {validMapObjects.map((obj, i) => (
        <View key={i} style={{ marginTop: 12 }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            📍 {obj.label}
          </Text>
          {obj.facts ? (
            <Text style={{ color: Colors.textSecondary, marginTop: 4 }}>
              {obj.facts}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}