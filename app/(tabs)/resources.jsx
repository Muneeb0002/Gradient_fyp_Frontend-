import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import AppDecor from "../../components/shared/AppDecor";

export default function ResourcesScreen() {
  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      style={{ flex: 1 }}
    >
      <AppDecor />
      <SafeAreaView style={styles.safe}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="book-open-outline" size={64} color={Colors.accent} />
        </View>
        <Text style={styles.title}>Library & Resources</Text>
        <Text style={styles.badge}>Coming Soon</Text>
        <Text style={styles.sub}>
          O-Level syllabus, past papers, and study resources — all in one place.
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30, paddingBottom: 80 },
  iconWrap: {
    width: 120, height: 120, borderRadius: 30,
    backgroundColor: "rgba(79,209,197,0.1)",
    borderWidth: 1, borderColor: "rgba(79,209,197,0.25)",
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  title: { color: Colors.white, fontSize: 26, fontWeight: "800", textAlign: "center", marginBottom: 14 },
  badge: {
    color: Colors.accent, fontSize: 13, fontWeight: "800",
    letterSpacing: 1.2, textTransform: "uppercase",
    backgroundColor: "rgba(79,209,197,0.12)",
    borderWidth: 1, borderColor: "rgba(79,209,197,0.3)",
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, marginBottom: 18,
  },
  sub: { color: Colors.textSecondary, fontSize: 15, textAlign: "center", lineHeight: 24 },
});
