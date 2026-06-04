import { Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";
import Colors from "../../constants/Colors";

function FeatureLabel({ feature, isSelected }) {
  return (
    <View style={[styles.labelContainer, isSelected && styles.selectedLabelContainer]}>
      <Text
        style={[
          styles.labelText,
          { color: isSelected ? Colors.primary : feature.color || Colors.accent },
          isSelected && { fontSize: 10, fontWeight: "900" },
        ]}
      >
        {feature.label}
      </Text>
    </View>
  );
}

export default function GeoMapView({ rivers, onFeaturePress, selectedFeatureId }) {
  const handlePress = (feature) => {
    if (onFeaturePress) onFeaturePress(feature);
  };

  return (
    <MapView
      style={{ width: "100%", height: 250, borderRadius: 10 }}
      initialRegion={{
        latitude: 30,
        longitude: 70,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }}
    >
      {rivers.map((feature, index) => {
        const isSelected = selectedFeatureId === feature.label;
        const key = `feature-${feature.label}-${index}`;

        if (feature.renderType === "polygon" && feature.coords?.length >= 3) {
          const fill = (feature.color || Colors.accent) + "55";
          return (
            <View key={key}>
              <Polygon
                coordinates={feature.coords}
                strokeColor={isSelected ? Colors.accent : feature.color || Colors.accent}
                fillColor={fill}
                strokeWidth={isSelected ? 3 : 2}
                tappable
                onPress={() => handlePress(feature)}
              />
              {feature.centerCoord ? (
                <Marker
                  coordinate={feature.centerCoord}
                  tappable
                  onPress={() => handlePress(feature)}
                >
                  <FeatureLabel feature={feature} isSelected={isSelected} />
                </Marker>
              ) : null}
            </View>
          );
        }

        if (feature.renderType === "marker" && feature.coords?.length > 0) {
          return (
            <Marker
              key={key}
              coordinate={feature.coords[0]}
              tappable
              onPress={() => handlePress(feature)}
            >
              <FeatureLabel feature={feature} isSelected={isSelected} />
            </Marker>
          );
        }

        if (!feature.coords?.length) return null;

        return (
          <View key={key}>
            <Polyline
              coordinates={feature.coords}
              strokeColor={isSelected ? Colors.accent : feature.color}
              strokeWidth={isSelected ? 6 : 3}
              tappable
              onPress={() => handlePress(feature)}
            />
            <Marker
              coordinate={feature.coords[0]}
              tappable
              onPress={() => handlePress(feature)}
            >
              <FeatureLabel feature={feature} isSelected={isSelected} />
            </Marker>
          </View>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    alignSelf: "flex-start",
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: { elevation: 3 },
    }),
  },
  selectedLabelContainer: {
    borderColor: Colors.accent,
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    transform: [{ scale: 1.1 }],
  },
  labelText: {
    fontSize: 8,
    fontWeight: "800",
    textAlign: "center",
    includeFontPadding: false,
  },
});
