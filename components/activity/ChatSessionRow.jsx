import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { getModeMeta } from "../../lib/chatHistoryUtils";

export default function ChatSessionRow({ session, accentColor, onPress }) {
  const modeMeta = getModeMeta(session.mode);
  const color = accentColor || modeMeta.color;
  const modeIcon = modeMeta.icon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <View style={[styles.badge, { borderColor: color + "55" }]}>
        <MaterialCommunityIcons name={modeIcon} size={20} color={color} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {session.title}
          </Text>
          {session.marks != null ? (
            <View style={[styles.marksPill, { backgroundColor: color + "22" }]}>
              <Text style={[styles.marksText, { color }]}>{session.marks}m</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.preview} numberOfLines={2}>
          {session.preview}
        </Text>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={13}
            color={Colors.textMuted}
          />
          <Text style={styles.date}>{session.date}</Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={Colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  pressed: { opacity: 0.88 },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  body: { flex: 1, marginRight: 8 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  preview: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  date: { color: Colors.textMuted, fontSize: 12, fontWeight: "600" },
  marksPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  marksText: { fontSize: 10, fontWeight: "800" },
});
