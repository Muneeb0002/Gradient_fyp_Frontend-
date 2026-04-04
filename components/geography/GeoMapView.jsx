import { Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

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
      {rivers.map((river, index) => (
        <View key={`river-group-${index}`}>
          {/* 1. Ye line draw karega */}
          <Polyline
            coordinates={river.coords}
            strokeColor={river.color}
            strokeWidth={3}
          />

          {/* 2. Ye river ka naam likhega (Start point par) */}
          {river.coords.length > 0 && (
            <Marker
              coordinate={river.coords[0]} // Pehle coordinate par label dikhayega
              tappable={false}
            >
              {/* Custom Label Styling */}
              <View style={styles.labelContainer}>
                <Text style={[styles.labelText, { color: river.color }]}>
                  {river.label}
                </Text>
              </View>
            </Marker>
          )}
        </View>
      ))}
    </MapView>
  );
}

// const styles = StyleSheet.create({
//   labelContainer: {
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     // paddingHorizontal: 0.3,
//     paddingVertical: 3,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   labelText: {
//     fontSize: 6,
//     fontWeight: "bold",
//   },
// });


const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Thora zyada solid taake map ke upar saaf dikhe
    // paddingHorizontal: 6, // Text ke side par thori jagah
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)", // Light border
    
    // Sabse important lines:
    alignSelf: 'flex-start', // Ye container ko sirf text jitni width dega
    minWidth: 60,           // Kam se kam itni width ho
    alignItems: 'center',
    justifyContent: 'center',
    
    // Shadow (Optional: Taake label utha hua dikhe)
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
  labelText: {
    fontSize: 8,            // 6 bohot chota tha, 8 readable haii
    fontWeight: "800",      // Extra bold for O Level GIS look
    textAlign: 'center',
    includeFontPadding: false, // Android par extra space khatam karne ke liye
  },
});