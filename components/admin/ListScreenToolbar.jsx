import { StyleSheet, Text, View } from "react-native";
import SearchField from "./SearchField";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

export default function ListScreenToolbar({
  total,
  label = "records",
  query,
  onChangeQuery,
  placeholder,
  children,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.countRow}>
        <Text style={styles.countLabel}>Showing</Text>
        <Text style={styles.countValue}>
          {total} {label}
        </Text>
      </View>
      <SearchField value={query} onChangeText={onChangeQuery} placeholder={placeholder} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 4,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 10,
  },
  countLabel: {
    color: Colors.textMuted,
    ...Typography.caption,
    textTransform: "none",
    letterSpacing: 0,
  },
  countValue: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "800",
  },
});
