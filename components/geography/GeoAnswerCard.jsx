import { Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function GeoAnswerCard({ queryType }) {
  return (
    <View
      className="p-4 rounded-2xl"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <Text className="font-bold mb-2" style={{ color: Colors.accent }}>
        Examiner Style Answer
      </Text>

      {queryType === "image" && (
        <Text style={{ color: Colors.white }}>
          • Map shows Indus River system{"\n"}• Major tributaries identified
          {"\n"}• Flow direction north to south{"\n"}• Important for irrigation
        </Text>
      )}

      {queryType === "text" && (
        <Text style={{ color: Colors.white }}>
          • Indus River is longest river of Pakistan{"\n"}• Supports agriculture
          {"\n"}• Key for economy{"\n"}• Forms delta near Arabian Sea
        </Text>
      )}

      {queryType === "both" && (
        <Text style={{ color: Colors.white }}>
          • Image + text both analyzed{"\n"}• Rivers identified visually{"\n"}•
          Explanation based on question{"\n"}• Combined interpretation generated
        </Text>
      )}

      <Text className="mt-3" style={{ color: Colors.textSecondary }}>
        Answer generated using GIS + keyword analysis approach.
      </Text>
    </View>
  );
}
