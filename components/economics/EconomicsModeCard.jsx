import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

const CARD_GRADIENT = ["rgba(63,183,168,0.24)", "rgba(63,183,168,0.06)"];

/**
 * Large paper / section picker card — matches Economics hub (Paper 1 / Paper 2).
 */
export default function EconomicsModeCard({
  onPress,
  badge,
  title,
  subtitle,
  hint,
  icon = "chart-line",
  minHeight = 220,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.modeCard, pressed && { opacity: 0.92 }]}
    >
      <LinearGradient colors={CARD_GRADIENT} style={[styles.modeCardInner, { minHeight }]}>
        <View style={styles.modeIconWrap}>
          <MaterialCommunityIcons name={icon} size={32} color={Colors.accent} />
        </View>
        {badge ? (
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{badge}</Text>
          </View>
        ) : null}
        <Text style={styles.modeTitle}>{title}</Text>
        {subtitle ? <Text style={styles.modeSubtitle}>{subtitle}</Text> : null}
        {hint ? <Text style={styles.modeHint}>{hint}</Text> : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modeCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  modeCardInner: {
    padding: 18,
    justifyContent: "space-between",
  },
  modeIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modeBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(79, 209, 197, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
    marginBottom: 8,
  },
  modeBadgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
  },
  modeTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  modeSubtitle: {
    marginTop: 6,
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  modeHint: {
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    minHeight: 36,
  },
});
