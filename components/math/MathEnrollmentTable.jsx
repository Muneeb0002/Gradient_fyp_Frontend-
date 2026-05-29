import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function MathEnrollmentTable({ rows }) {
  if (!rows?.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Data from graph</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.cellSchool, styles.headerText]}>
            School
          </Text>
          <Text style={[styles.cell, styles.headerText]}>Year 1</Text>
          <Text style={[styles.cell, styles.headerText]}>Year 2</Text>
        </View>
        {rows.map((row) => (
          <View key={row.school} style={styles.row}>
            <Text style={[styles.cell, styles.cellSchool]}>{row.school}</Text>
            <Text style={styles.cell}>{row.year1}</Text>
            <Text style={styles.cell}>{row.year2}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 4 },
  label: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  table: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  row: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerRow: {
    backgroundColor: "rgba(79, 209, 197, 0.12)",
  },
  cell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  cellSchool: {
    flex: 1.2,
    textAlign: "left",
  },
  headerText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
