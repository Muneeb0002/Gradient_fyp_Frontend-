import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function ChatGptHeader({
  onBack,
  title,
  subtitle,
  accentTitle = false,
}) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
      >
        <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.white} />
      </Pressable>
      <View style={styles.center}>
        <Text
          style={[styles.title, accentTitle && styles.titleAccent]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.backBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 14,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  center: { flex: 1, alignItems: "center", paddingHorizontal: 8 },
  title: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  titleAccent: {
    color: Colors.accent,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
});
