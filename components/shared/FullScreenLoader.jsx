import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "./AppDecor";
import AppLoader from "./AppLoader";
import Colors from "../../constants/Colors";

export default function FullScreenLoader({
  title = "Loading",
  subtitle = "Please wait a moment…",
}) {
  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      style={styles.root}
    >
      <AppDecor />
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <AppLoader title={title} subtitle={subtitle} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: "center", paddingHorizontal: 22 },
});
