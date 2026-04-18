import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const TYPE_COLORS = {
  point: "#f43f5e",
  region: "#3b82f6",
  river: "#06b6d4",
  route: "#a855f7",
  default: Colors.accent,
};

export default function GeoFeatures({ data }) {
  const features = Array.isArray(data) ? data : [];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>AI Analysis</Text>

      {features.length === 0 ? (
        <Text style={{ color: Colors.textMuted }}>No features found</Text>
      ) : (
        features.map((item, index) => {
          const typeColor = TYPE_COLORS[item.type] || TYPE_COLORS.default;
          const dataCount = Array.isArray(item.data) ? item.data.length : 0;

          return (
            <View key={index} style={styles.card}>
              {/* Header row */}
              <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: item.color || typeColor }]} />
                <Text style={styles.label}>{item.label}</Text>
                <View style={[styles.badge, { backgroundColor: typeColor + "30", borderColor: typeColor }]}>
                  <Text style={[styles.badgeText, { color: typeColor }]}>{item.type}</Text>
                </View>
              </View>

              {/* Facts */}
              {item.facts ? (
                <Text style={styles.facts}>{item.facts}</Text>
              ) : null}

              {/* Data points count */}
              {dataCount > 0 && (
                <Text style={styles.dataCount}>
                  📊 {dataCount} data point{dataCount > 1 ? "s" : ""}
                </Text>
              )}
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  heading: {
    color: Colors.accent,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 12,
  },
  card: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder + "60",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  facts: {
    color: "#d1d5db",
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 18,
  },
  dataCount: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 6,
    marginLeft: 18,
  },
});