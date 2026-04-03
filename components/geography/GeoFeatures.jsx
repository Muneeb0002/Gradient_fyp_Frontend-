import { Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function GeoFeatures() {
  return (
    <View
      className="p-4 rounded-2xl"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <Text style={{ color: Colors.accent }} className="font-bold mb-2">
        AI Analysis
      </Text>

      <Text style={{ color: "white" }}>
        🔹 Keywords: river, delta, sediment, deposition{"\n"}
        🔹 Locations Detected: Nile River, Egypt{"\n"}
        🔹 OCR Text: &quot;Delta region fertile land&quot;
      </Text>
    </View>
  );
}
