
import { ScrollView, Text, View, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default function GeoAnswerCard({ queryType, answer }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 Examiner Style Answer</Text>

      <View style={{ height: 8 }} />

      {answer ? (
        answer.split("\n").map((line, index) => {
          // Detect headers starting with # (e.g., ## or ###)
          const headingMatch = line.trim().match(/^(#+)\s*(.*)$/);
          
          if (headingMatch) {
            // Clean the heading text by removing bold markers and trimming whitespace
            const cleanHeading = headingMatch[2].replace(/\*\*/g, "").trim();
            if (cleanHeading) {
              return (
                <Text key={index} style={styles.themedHeading}>
                  {cleanHeading}
                </Text>
              );
            }
          }

          if (line.trim() === "") return <View key={index} style={{ height: 8 }} />;
          
          // Render plain text while stripping bold markers (**) for a cleaner theme look
          const cleanText = line.replace(/\*\*/g, "").trim();
          if (!cleanText) return null;

          return (
            <Text key={index} style={styles.answerText}>
              {cleanText}
            </Text>
          );
        })
      ) : (
        <Text style={styles.empty}>No answer available.</Text>
      )}

      <Text style={styles.footer}>
        Answer generated using AI analysis approach.
      </Text>
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
    marginBottom: 8,
  },
  heading: {
    color: Colors.accent,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 12,
  },
  answerText: {
    color: Colors.white,
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 6,
  },
  themedHeading: {
    color: Colors.accent,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
  },
  empty: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  footer: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 14,
    fontStyle: "italic",
  },
});