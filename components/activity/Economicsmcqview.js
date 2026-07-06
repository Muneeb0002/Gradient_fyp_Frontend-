import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { sanitizeDisplayText } from "../../lib/displayText";

export default function EconomicsMCQView({ response }) {
  const wrongReasons = response?.why_others_wrong ?? [];

  return (
    <View style={styles.wrap}>
      <View style={styles.answerBox}>
        <Text style={styles.answerLabel}>CORRECT OPTION</Text>
        <Text style={styles.answerValue}>{response?.correct_option}</Text>
      </View>

      {response?.rationale ? (
        <Text style={styles.rationale}>
          {sanitizeDisplayText(response.rationale)}
        </Text>
      ) : null}

      {wrongReasons.length > 0 ? (
        <View style={styles.wrongBox}>
          <Text style={styles.wrongLabel}>WHY OTHER OPTIONS ARE WRONG</Text>
          {wrongReasons.map((reason, idx) => (
            <View key={`wrong-${idx}`} style={styles.wrongRow}>
              <Text style={styles.bullet}>{"\u2022"}</Text>
              <Text style={styles.wrongText}>
                {sanitizeDisplayText(reason)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {(response?.concept || response?.difficulty) ? (
        <View style={styles.metaRow}>
          {response?.concept ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{response.concept}</Text>
            </View>
          ) : null}
          {response?.difficulty ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{response.difficulty}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {response?.examiner_tip ? (
        <View style={styles.tipBox}>
          <Text style={styles.tipLabel}>EXAMINER TIP</Text>
          <Text style={styles.tipText}>
            {sanitizeDisplayText(response.examiner_tip)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 10, gap: 10 },
  answerBox: {
    backgroundColor: "rgba(79, 209, 197, 0.08)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
    alignItems: "flex-start",
  },
  answerLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  answerValue: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "800",
  },
  rationale: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  wrongBox: { gap: 6 },
  wrongLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  wrongRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  bullet: { color: Colors.accent, fontSize: 14, lineHeight: 20 },
  wrongText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  chipText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  tipBox: { paddingHorizontal: 2 },
  tipLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  tipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});