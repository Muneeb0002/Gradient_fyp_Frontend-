import { Text, View } from "react-native";
import Colors from "../../constants/Colors";
import GeoMapView from "./GeoMapView";

export default function GeoMap({ data }) {
  // Parse features
  let features = [];
  try {
    if (data?.data?.features) {
       features = data.data.features;
    }
  } catch (e) {
  }

  // Format into what GeoMapView expects (rivers)
  const mapObjects = features.map(feat => {
    // feat.data is like [[24.81, 67.35], ...]
    const coords = (feat.data || []).map(pt => ({
      latitude: pt[0],
      longitude: pt[1],
    }));

    return {
      label: feat.label || "Unknown",
      color: feat.color || Colors.accent,
      coords: coords,
      facts: feat.facts || "",
      icon: feat.icon || "map-pin",
    };
  });

  return (
    <View
      className="p-4 rounded-2xl"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <Text style={{ color: Colors.accent }} className="font-bold mb-2">
        Map Analysis
      </Text>

      {mapObjects.length > 0 ? (
        <View style={{ borderRadius: 10, overflow: "hidden" }}>
          <GeoMapView rivers={mapObjects} onFeaturePress={(f) => {}} selectedFeatureId={null} />
        </View>
      ) : (
        <Text style={{ color: "white", marginTop: 10 }}>
          No map data available.
        </Text>
      )}

      {mapObjects.length > 0 && mapObjects.map((obj, i) => (
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
