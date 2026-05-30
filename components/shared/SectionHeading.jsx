import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

/** Home / dashboard section row — "Your subjects", "Chats", etc. */
export default function SectionHeading({
  title,
  icon,
  onViewAll,
  viewAllLabel = "View all",
  style,
}) {
  return (
    <View style={[styles.row, style]}>
      <MaterialCommunityIcons name={icon} size={20} color={Colors.accent} />
      <Text style={styles.title}>{title}</Text>
      {onViewAll ? (
        <Pressable
          onPress={onViewAll}
          hitSlop={8}
          style={({ pressed }) => pressed && { opacity: 0.85 }}
        >
          <Text style={styles.viewAll}>{viewAllLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    marginLeft: 8,
    flex: 1,
    color: Colors.accent,
    ...Typography.sectionTitle,
  },
  viewAll: {
    color: Colors.textMuted,
    ...Typography.buttonSmall,
  },
});
