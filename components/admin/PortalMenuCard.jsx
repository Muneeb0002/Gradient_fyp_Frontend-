import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

export default function PortalMenuCard({
  title,
  subtitle,
  icon,
  onPress,
  badge,
  showChevron = true,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={24} color={Colors.accent} />
      </View>
      <View style={styles.textCol}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {showChevron ? (
        <View style={styles.chevronBox}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={Colors.textMuted}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  textCol: {
    flex: 1,
    marginLeft: 14,
    marginRight: 6,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    color: Colors.white,
    ...Typography.sectionTitle,
    fontSize: 15,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(79, 209, 197, 0.15)",
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
  },
  chevronBox: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
