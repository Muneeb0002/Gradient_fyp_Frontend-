import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

export default function AppLoader({
  title = "Loading",
  subtitle,
  compact = false,
  inline = false,
}) {
  if (inline) {
    return (
      <View style={styles.inlineWrap}>
        <ActivityIndicator size="small" color={Colors.accent} />
        <Text style={styles.inlineTitle}>{title}</Text>
        {subtitle ? <Text style={styles.inlineSub}>{subtitle}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.card}>
        <View style={styles.iconRing}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineWrap: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  inlineTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  inlineSub: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
  },
  wrap: {
    marginTop: 28,
    paddingVertical: 20,
    alignItems: "center",
  },
  wrapCompact: { marginTop: 16, paddingVertical: 12 },
  card: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(79, 209, 197, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 20,
    color: Colors.white,
    textAlign: "center",
    ...Typography.body,
    fontWeight: "700",
    fontSize: 16,
  },
  subtitle: {
    marginTop: 8,
    color: Colors.textMuted,
    textAlign: "center",
    ...Typography.caption,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 18,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    opacity: 0.35,
  },
  dot1: { opacity: 1 },
  dot2: { opacity: 0.65 },
  dot3: { opacity: 0.35 },
});
