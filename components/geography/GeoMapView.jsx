import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";

export default function GeoMapView({ rivers }) {
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
      {rivers.map((item, index) => {
<<<<<<< HEAD

        // ✅ POLYLINE + label marker at midpoint
        if (item.renderType === "polyline") {
          const mid = item.coords[Math.floor(item.coords.length / 2)];
          return (
            <React.Fragment key={`polyline-${index}`}>
              <Polyline
                coordinates={item.coords}
                strokeColor={item.color}
                strokeWidth={3}
              />
              {mid && (
                <Marker coordinate={mid} tappable={false} anchor={{ x: 0.5, y: 0.5 }}>
                  <View style={[styles.labelContainer, { borderColor: item.color }]}>
                    <Text style={[styles.labelText, { color: item.color }]}>
                      {item.label}
                    </Text>
                  </View>
                </Marker>
              )}
            </React.Fragment>
          );
        }

=======
        // ✅ POLYLINE + label marker at midpoint
        if (item.renderType === "polyline") {
          const mid = item.coords[Math.floor(item.coords.length / 2)];
          return (
            <React.Fragment key={`polyline-${index}`}>
              <Polyline
                coordinates={item.coords}
                strokeColor={item.color}
                strokeWidth={3}
              />
              {mid && (
                <Marker
                  coordinate={mid}
                  tappable={false}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View
                    style={[styles.labelContainer, { borderColor: item.color }]}
                  >
                    <Text style={[styles.labelText, { color: item.color }]}>
                      {item.label}
                    </Text>
                  </View>
                </Marker>
              )}
            </React.Fragment>
          );
        }

>>>>>>> f105c7e61b4fb93346fb8a84b133e734f2be790e
        // ✅ POLYGON + label marker at center
        if (item.renderType === "polygon") {
          const lats = item.coords.map((c) => c.latitude);
          const lngs = item.coords.map((c) => c.longitude);
          const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
          const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

          return (
            <React.Fragment key={`polygon-${index}`}>
              <Polygon
                coordinates={item.coords}
                strokeColor={item.color}
                fillColor={item.color + "55"}
                strokeWidth={2}
              />
              <Marker
                coordinate={{ latitude: centerLat, longitude: centerLng }}
                tappable={false}
                anchor={{ x: 0.5, y: 0.5 }}
              >
<<<<<<< HEAD
                <View style={[styles.labelContainer, { borderColor: item.color }]}>
=======
                <View
                  style={[styles.labelContainer, { borderColor: item.color }]}
                >
>>>>>>> f105c7e61b4fb93346fb8a84b133e734f2be790e
                  <Text style={[styles.labelText, { color: item.color }]}>
                    {item.label}
                  </Text>
                </View>
              </Marker>
            </React.Fragment>
          );
        }

        // ✅ MARKER (Airports, Ports, Dams)
        if (item.renderType === "marker") {
          return (
            <Marker
              key={`marker-${index}`}
              coordinate={item.coords[0]}
              tappable={false}
              anchor={{ x: 0.5, y: 0.5 }}
            >
<<<<<<< HEAD
              <View style={[styles.markerContainer, { borderColor: item.color }]}>
=======
              <View
                style={[styles.markerContainer, { borderColor: item.color }]}
              >
>>>>>>> f105c7e61b4fb93346fb8a84b133e734f2be790e
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={[styles.labelText, { color: item.color }]}>
                  {item.label}
                </Text>
              </View>
            </Marker>
          );
        }

        return null;
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
      android: { elevation: 3 },
    }),
  },
  markerContainer: {
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    ...Platform.select({
<<<<<<< HEAD
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
=======
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
>>>>>>> f105c7e61b4fb93346fb8a84b133e734f2be790e
      android: { elevation: 3 },
    }),
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  labelText: {
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
  },
});
<<<<<<< HEAD

=======
>>>>>>> f105c7e61b4fb93346fb8a84b133e734f2be790e
