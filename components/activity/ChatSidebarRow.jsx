import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

/** ChatGPT-style flat history row */
export default function ChatSidebarRow({ item, onPress, isLast }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.border,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 12,
  },
  pressed: {
    backgroundColor: "rgba(255,255,255,0.04)",
    marginHorizontal: -8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  textBlock: { flex: 1, minWidth: 0 },
  title: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  preview: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  time: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    minWidth: 52,
    textAlign: "right",
  },
});
