import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";


const CARD_HEIGHT = 108;

export default function StatGrid({ items, columns = 2 }) {
  const isFour = columns === 4;

  return (
    <View style={[styles.grid, isFour && styles.gridFour]}>
      {items.map((item) => (
        <View
          key={item.id}
          style={[
            styles.card,
            isFour ? styles.cardFour : styles.cardTwo,
          ]}
        >
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons
              name={item.icon}
              size={22}
              color={Colors.accent}
            />
          </View>
          <Text style={styles.value} numberOfLines={1}>
            {item.value}
          </Text>
          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  gridFour: {
    rowGap: 10,
  },
  card: {
    borderRadius: 18,
    padding: 14,
    height: CARD_HEIGHT,
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardTwo: {
    width: "48%",
  },
  cardFour: {
    width: "48%",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79, 209, 197, 0.12)",
  },
  value: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "800",
  },
  label: {
    color: Colors.textMuted,
    ...Typography.caption,
    fontWeight: "600",
    textTransform: "none",
    letterSpacing: 0,
    fontSize: 11,
    lineHeight: 14,
  },
});
