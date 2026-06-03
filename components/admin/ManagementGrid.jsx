import { useWindowDimensions, View, StyleSheet } from "react-native";
import ManagementTile from "./ManagementTile";

const H_PAD = 22;
const GAP = 12;
const ROW_GAP = 12;

export default function ManagementGrid({ items }) {
  const { width } = useWindowDimensions();
  const tileWidth = Math.floor((width - H_PAD * 2 - GAP) / 2);

  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((pair, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[styles.row, { gap: GAP }]}>
          {pair.map((item) => (
            <View key={item.key} style={{ width: tileWidth }}>
              <ManagementTile
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                count={item.count}
                colors={item.colors}
                onPress={item.onPress}
              />
            </View>
          ))}
          {pair.length === 1 ? <View style={{ width: tileWidth }} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: ROW_GAP,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
});
