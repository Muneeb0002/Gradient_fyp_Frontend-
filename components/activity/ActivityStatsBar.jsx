import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function ActivityStatsBar({ count, topics }) {
  return (
    <LinearGradient
      colors={["rgba(63,183,168,0.22)", "rgba(79,209,197,0.06)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrap}
    >
      <View style={styles.inner}>
        <View style={styles.stat}>
          <MaterialCommunityIcons
            name="message-text-clock-outline"
            size={22}
            color={Colors.accent}
          />
          <View style={styles.statText}>
            <Text style={styles.statNum}>{count}</Text>
            <Text style={styles.statLabel}>Total chats</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <MaterialCommunityIcons
            name="folder-multiple-outline"
            size={22}
            color={Colors.accent}
          />
          <View style={styles.statText}>
            <Text style={styles.statNum}>{topics}</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 20, padding: 2, marginBottom: 18 },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  stat: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  statText: { flex: 1 },
  statNum: { color: Colors.white, fontSize: 22, fontWeight: "800" },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 12,
  },
});
