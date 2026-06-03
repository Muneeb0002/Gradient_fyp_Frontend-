import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

/** Same logout row as Settings → student app theme */
export default function AppLogoutButton({ onPress, label = "Logout" }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.logoutInner}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    marginTop: 28,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(251,113,133,0.35)",
    backgroundColor: "rgba(251,113,133,0.08)",
    overflow: "hidden",
  },
  logoutInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 10,
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: "800",
  },
});
