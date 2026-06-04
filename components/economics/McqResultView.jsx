import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import SectionCard from "../shared/SectionCard";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import { normalizeWhyOthersWrong } from "../../constants/economicsSampleData";

const DIFFICULTY_STYLE = {
  Easy: { bg: "rgba(79, 209, 197, 0.15)", color: Colors.accent, border: "rgba(79, 209, 197, 0.35)" },
  Medium: { bg: "rgba(251, 191, 36, 0.15)", color: "#FBBF24", border: "rgba(251, 191, 36, 0.35)" },
  Hard: { bg: "rgba(251, 113, 133, 0.15)", color: Colors.danger, border: "rgba(251, 113, 133, 0.35)" },
};

export default function McqResultView({ result }) {
  const wrongList = normalizeWhyOthersWrong(result?.why_others_wrong);
  const diff = DIFFICULTY_STYLE[result?.difficulty] ?? DIFFICULTY_STYLE.Medium;

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Correct answer</Text>
        <View style={styles.optionCircle}>
          <Text style={styles.optionLetter}>{result?.correct_option ?? "—"}</Text>
        </View>
        {result?.concept ? (
          <View style={styles.conceptPill}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={Colors.accent} />
            <Text style={styles.conceptText}>{result.concept}</Text>
          </View>
        ) : null}
        {result?.difficulty ? (
          <View style={[styles.diffPill, { backgroundColor: diff.bg, borderColor: diff.border }]}>
            <Text style={[styles.diffText, { color: diff.color }]}>{result.difficulty}</Text>
          </View>
        ) : null}
      </View>

      <SectionCard label="Explanation" icon="text-box-outline">
        <Text style={styles.body}>{result?.rationale}</Text>
      </SectionCard>

      {wrongList.length > 0 ? (
        <SectionCard label="Why other options are wrong" icon="close-circle-outline" style={styles.gap}>
          {wrongList.map((line, i) => (
            <View key={`wrong-${i}`} style={styles.wrongRow}>
              <View style={styles.wrongDot} />
              <Text style={styles.wrongText}>{line}</Text>
            </View>
          ))}
        </SectionCard>
      ) : null}

      {result?.examiner_tip ? (
        <View style={styles.tipCard}>
          <MaterialCommunityIcons name="school-outline" size={22} color={Colors.accent} />
          <View style={styles.tipTextCol}>
            <Text style={styles.tipTitle}>Examiner tip</Text>
            <Text style={styles.tipBody}>{result.examiner_tip}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  heroLabel: {
    color: Colors.textMuted,
    ...Typography.sectionLabel,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  optionCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79, 209, 197, 0.15)",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  optionLetter: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: "900",
  },
  conceptPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  conceptText: {
    color: Colors.accent,
    fontWeight: "700",
    fontSize: 13,
  },
  diffPill: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  diffText: {
    fontSize: 12,
    fontWeight: "800",
  },
  gap: { marginTop: 14 },
  body: {
    color: Colors.textSecondary,
    ...Typography.bodySmall,
    lineHeight: 22,
  },
  wrongRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  wrongDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.danger,
    marginTop: 8,
    marginRight: 10,
  },
  wrongText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(79, 209, 197, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.28)",
    gap: 12,
  },
  tipTextCol: { flex: 1 },
  tipTitle: {
    color: Colors.accent,
    fontWeight: "800",
    fontSize: 13,
    marginBottom: 6,
  },
  tipBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
});
