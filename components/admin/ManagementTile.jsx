import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export const MANAGEMENT_TILE_HEIGHT = 136;

export default function ManagementTile({
  title,
  subtitle,
  icon,
  count,
  colors = [Colors.surfaceAlt, Colors.surface],
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <LinearGradient colors={colors} style={styles.card}>
        <View style={styles.top}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name={icon} size={22} color={Colors.accent} />
          </View>
          {count != null ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    height: MANAGEMENT_TILE_HEIGHT,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  card: {
    flex: 1,
    height: MANAGEMENT_TILE_HEIGHT,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79, 209, 197, 0.12)",
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    backgroundColor: Colors.primary,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "800",
  },
  title: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    lineHeight: 14,
    fontWeight: "500",
    flex: 1,
  },
});
