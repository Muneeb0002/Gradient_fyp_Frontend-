
import { ScrollView, Text, View, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default function GeoAnswerCard({ queryType, answer }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 Examiner Style Answer</Text>

      {answer ? (
        <Text style={styles.answerText}>{answer}</Text>
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