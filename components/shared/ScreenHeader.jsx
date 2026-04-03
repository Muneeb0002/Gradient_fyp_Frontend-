import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View, Platform, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

/**
 * Consistent hero for subject / tool screens: back pill, icon, title, subtitle, accent bar.
 */
export default function ScreenHeader({ onBack, title, subtitle, icon }) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [styles.backPill, pressed && { opacity: 0.88 }]}
        hitSlop={8}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={22}
          color={Colors.white}
        />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.titleRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={Colors.accent}
          />
        </View>
        <View style={styles.titleTextCol}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.accentBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 18,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  backText: {
    marginLeft: 4,
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  titleTextCol: {
    flex: 1,
    paddingTop: 2,
    marginLeft: 14,
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  accentBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 14,
    marginLeft: 66,
  },
});
