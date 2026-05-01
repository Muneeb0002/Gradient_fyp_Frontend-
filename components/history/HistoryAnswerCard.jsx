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

      <View style={{ height: 4 }} />

      {answer ? (
        answer.split("\n").map((line, index) => {
          // Detect headers starting with # (e.g., ## or ###)
          const headingMatch = line.trim().match(/^(#+)\s*(.*)$/);
          
          if (headingMatch) {
            // Clean the heading text by removing bold markers and trimming whitespace
            const cleanHeading = headingMatch[2].replace(/\*\*/g, "").trim();
            if (cleanHeading) {
              return (
                <Text 
                  key={index} 
                  style={{ 
                    color: Colors.accent, 
                    fontSize: 17, 
                    fontWeight: "800", 
                    marginTop: 14, 
                    marginBottom: 8 
                  }}
                >
                  {cleanHeading}
                </Text>
              );
            }
          }

          if (line.trim() === "") return <View key={index} style={{ height: 8 }} />;
          
          // Render plain text while stripping bold markers (**) for a cleaner theme look
          const cleanLine = line.replace(/\*\*/g, "").trim();
          if (!cleanLine) return null;

          return (
            <Text 
              key={index} 
              style={{ color: Colors.white, lineHeight: 24, fontSize: 14, marginBottom: 4 }}
            >
              {cleanLine}
            </Text>
          );
        })
      ) : (
        <Text style={{ color: Colors.textMuted, fontStyle: "italic" }}>
          No answer available.
        </Text>
      )}
    </View>
  );
}