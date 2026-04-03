import { Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function HistoryAnswerCard({ marks, mode = "theory" }) {
  const marksValue = Number(marks);
  const isImageMode = mode === "image";

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
        {isImageMode ? "Image-based answer" : "Theory-based answer"} ({marks} Marks)
      </Text>

      {marksValue === 3 && (
        <Text style={{ color: Colors.white }}>
          Partition of 1947 caused migration and violence. Sources show people moved
          toward Pakistan and faced loss of homes, safety, and basic resources.
        </Text>
      )}

      {marksValue === 4 && (
        <Text style={{ color: Colors.white }}>
          Partition of 1947 caused migration and violence. Many Muslims moved to
          Pakistan and faced problems like loss of homes and resources.
        </Text>
      )}

      {marksValue === 7 && (
        <Text style={{ color: Colors.white }}>
          {isImageMode
            ? "From the uploaded sources, the key impact points are mass migration, violence, and economic disruption. Millions moved to Pakistan and faced refugee crises, loss of property, and instability."
            : "The partition led to mass migration, violence, and economic problems. Millions migrated to Pakistan and faced refugee crises, loss of property, and instability."}
        </Text>
      )}

      {marksValue === 14 && (
        <>
          <Text style={{ color: Colors.accent }} className="font-bold mt-2">
            Introduction
          </Text>
          <Text style={{ color: Colors.white }}>
            The partition of 1947 resulted in the creation of Pakistan and caused
            major social and economic changes.
          </Text>

          <Text style={{ color: Colors.accent }} className="font-bold mt-4">
            Key Effects
          </Text>
          <Text style={{ color: Colors.white }}>
            • Mass migration of Muslims{"\n"}• Loss of homes and property{"\n"}•
            Communal violence and deaths{"\n"}• Refugee crisis{"\n"}• Economic
            instability
          </Text>

          <Text style={{ color: Colors.accent }} className="font-bold mt-4">
            Cause-Effect Explanation
          </Text>
          <Text style={{ color: Colors.white }}>
            The sudden division of India caused chaos and violence. As a result,
            millions migrated and Pakistan faced economic and social challenges.
          </Text>

          <Text style={{ color: Colors.accent }} className="font-bold mt-4">
            Conclusion
          </Text>
          <Text style={{ color: Colors.white }}>
            Overall, partition had a deep impact on Pakistan&apos;s society and early
            development.
          </Text>
        </>
      )}
    </View>
  );
}
