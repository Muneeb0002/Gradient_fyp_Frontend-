import { Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function HistoryAnswerCard({ marks, mode = "theory", answer }) {
  const isImageMode = mode === "image";

  return (
    <View
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        borderRadius: 16,
        padding: 16,
      }}
    >
      <Text style={{ color: Colors.accent, fontWeight: "bold", marginBottom: 10, fontSize: 14 }}>
        {isImageMode ? "Image-based answer" : "Theory-based answer"} ({marks} Marks)
      </Text>

      {/* ✅ API ka real answer show karo */}
      {answer ? (
        <Text style={{ color: Colors.white, lineHeight: 24, fontSize: 14 }}>
          {answer}
        </Text>
      ) : (
        <Text style={{ color: Colors.textMuted, fontStyle: "italic" }}>
          No answer available.
        </Text>
      )}
    </View>
  );
}