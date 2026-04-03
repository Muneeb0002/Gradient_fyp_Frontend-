import { StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";

/** Soft blobs — same vibe as tour / onboarding (non-interactive). */
export default function AppDecor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  blobTop: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.primary,
    opacity: 0.08,
  },
  blobBottom: {
    position: "absolute",
    bottom: 100,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.accent,
    opacity: 0.06,
  },
});
