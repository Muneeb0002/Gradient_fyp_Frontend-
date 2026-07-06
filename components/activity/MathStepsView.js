import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { sanitizeDisplayText } from "../../lib/displayText";

export default function MathStepsView({ response }) {
  const steps = response?.steps ?? [];
  const finalAnswer = response?.final_answer;
  const markCommentary = response?.mark_commentary;

  return (
    <View style={styles.wrap}>
      {steps.map((step, idx) => (
        <View key={`step-${idx}`} style={styles.stepRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{step.step_number ?? idx + 1}</Text>
          </View>
          <View style={styles.stepBody}>
            {step.description ? (
              <Text style={styles.stepDesc}>
                {sanitizeDisplayText(step.description)}
              </Text>
            ) : null}
            {step.expression ? (
              <View style={styles.exprBox}>
                <Text style={styles.exprText}>{step.expression}</Text>
              </View>
            ) : null}
          </View>
        </View>
      ))}

      {finalAnswer ? (
        <View style={styles.finalBox}>
          <Text style={styles.finalLabel}>FINAL ANSWER</Text>
          <Text style={styles.finalText}>{finalAnswer}</Text>
        </View>
      ) : null}

      {markCommentary ? (
        <View style={styles.markBox}>
          <Text style={styles.markLabel}>EXAMINER MARKING</Text>
          <Text style={styles.markText}>
            {sanitizeDisplayText(markCommentary)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
    gap: 10,
  },
  stepRow: {
    flexDirection: "row",
    gap: 10,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(79, 209, 197, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepBadgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  stepBody: {
    flex: 1,
    gap: 6,
  },
  stepDesc: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  exprBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  exprText: {
    color: Colors.accent,
    fontSize: 14,
    fontFamily: "monospace",
  },
  finalBox: {
    marginTop: 2,
    backgroundColor: "rgba(79, 209, 197, 0.08)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
  },
  finalLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  finalText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
  markBox: {
    paddingHorizontal: 2,
  },
  markLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  markText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});