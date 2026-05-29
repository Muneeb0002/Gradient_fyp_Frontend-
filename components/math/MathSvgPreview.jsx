import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Colors from "../../constants/Colors";

export default function MathSvgPreview({ svg, title = "Diagram from solution" }) {
  const [failed, setFailed] = useState(false);

  if (!svg?.trim()) return null;

  const xml = svg.replace(/\sbackground="none"/gi, "");

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.canvas}>
        {!failed ? (
          <SvgXml
            xml={xml}
            width="100%"
            height={220}
            onError={() => setFailed(true)}
          />
        ) : (
          <Text style={styles.fallback}>
            Could not render diagram on this device.
          </Text>
        )}
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
    marginBottom: 6,
  },
  canvas: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 8,
    minHeight: 200,
    justifyContent: "center",
  },
  fallback: {
    color: Colors.textSecondary,
    textAlign: "center",
    padding: 16,
    fontSize: 13,
  },
});
