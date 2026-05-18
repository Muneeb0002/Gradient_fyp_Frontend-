import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { getModeMeta } from "../../lib/chatHistoryUtils";

export default function ActivityListRow({ item, onPress, showChevron = true }) {
  const modeMeta = getModeMeta(item.mode);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[`${item.color || modeMeta.color}18`, "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <View style={[styles.accent, { backgroundColor: item.color || modeMeta.color }]} />
        <View
          style={[
            styles.iconWrap,
            { borderColor: (item.color || modeMeta.color) + "44" },
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon || modeMeta.icon}
            size={22}
            color={item.color || modeMeta.color}
          />
        </View>
        <View style={styles.body}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.modePill,
                { backgroundColor: (item.color || modeMeta.color) + "22" },
              ]}
            >
              <Text
                style={[styles.modeText, { color: item.color || modeMeta.color }]}
              >
                {modeMeta.label}
              </Text>
            </View>
            {item.marks != null ? (
              <Text style={styles.marks}>{item.marks} marks</Text>
            ) : null}
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {item.preview ? (
            <Text style={styles.preview} numberOfLines={2}>
              {item.preview}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            {item.lastActive ? (
              <Text style={styles.meta}>{item.lastActive}</Text>
            ) : null}
            {item.chatCount != null ? (
              <Text style={styles.meta}>
                {item.lastActive ? "  ·  " : ""}
                {item.chatCount} session{item.chatCount === 1 ? "" : "s"}
              </Text>
            ) : null}
          </View>
        </View>
        {showChevron ? (
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={Colors.textMuted}
          />
        ) : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 0,
  },
  accent: {
    width: 4,
    alignSelf: "stretch",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    marginRight: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 12,
  },
  body: { flex: 1, marginRight: 6 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  modePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  modeText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  marks: { color: Colors.textMuted, fontSize: 11, fontWeight: "700" },
  title: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },
  preview: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  metaRow: { flexDirection: "row", marginTop: 8, flexWrap: "wrap" },
  meta: { color: Colors.textMuted, fontSize: 12, fontWeight: "600" },
});
