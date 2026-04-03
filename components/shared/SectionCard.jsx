import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View, Platform, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

/**
 * Labelled panel for question / solution / output blocks.
 */
export default function SectionCard({
  label,
  icon = "text-box-outline",
  children,
  style,
}) {
  return (
    <View style={[styles.outer, style]}>
      <View style={styles.labelRow}>
        <MaterialCommunityIcons name={icon} size={18} color={Colors.accent} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
    }),
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    marginLeft: 8,
    color: Colors.accent,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
