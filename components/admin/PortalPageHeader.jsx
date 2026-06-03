import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

export default function PortalPageHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  icon = "shield-crown-outline",
  accent = Colors.primary,
  rightAction,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        {showBack && onBack ? (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.88 }]}
            hitSlop={10}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.white} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        {rightAction ?? <View style={styles.backPlaceholder} />}
      </View>

      <LinearGradient
        colors={[`${accent}33`, "rgba(23, 36, 55, 0.95)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={[styles.iconRing, { borderColor: `${accent}55` }]}>
          <MaterialCommunityIcons name={icon} size={28} color={accent} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  backPlaceholder: {
    width: 42,
    height: 42,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  iconRing: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
  },
  textBlock: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    color: Colors.white,
    ...Typography.screenTitle,
    fontSize: 22,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: 4,
    ...Typography.screenSubtitleCompact,
  },
});
