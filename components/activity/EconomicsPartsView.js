import { StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Colors from "../../constants/Colors";
import { sanitizeDisplayText } from "../../lib/displayText";

export default function EconomicsPartsView({ response }) {
  const parts = response?.detected_parts ?? [];

  return (
    <View style={styles.wrap}>
      {response?.section ? (
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>
            SECTION {response.section}
          </Text>
        </View>
      ) : null}

      {parts.map((part, idx) => (
        <View key={`part-${idx}`} style={styles.partBox}>
          <View style={styles.partHeader}>
            <Text style={styles.partLabel}>{part.part}</Text>
            {part.marks != null ? (
              <Text style={styles.partMarks}>{part.marks} marks</Text>
            ) : null}
          </View>
          {part.question ? (
            <Text style={styles.partQuestion}>
              {sanitizeDisplayText(part.question)}
            </Text>
          ) : null}
          {part.answer ? (
            <Text style={styles.partAnswer}>
              {sanitizeDisplayText(part.answer)}
            </Text>
          ) : null}
          {part.diagram_svg ? (
            <View style={styles.diagramBox}>
              <SvgXml xml={part.diagram_svg} width="100%" height={200} />
            </View>
          ) : null}
        </View>
      ))}

      {response?.examiner_tip ? (
        <View style={styles.tipBox}>
          <Text style={styles.tipLabel}>EXAMINER TIP</Text>
          <Text style={styles.tipText}>
            {sanitizeDisplayText(response.examiner_tip)}
          </Text>
        </View>
      ) : null}

      {Array.isArray(response?.syllabus_links) && response.syllabus_links.length > 0 ? (
        <View style={styles.linksRow}>
          {response.syllabus_links.map((link, idx) => (
            <View key={`link-${idx}`} style={styles.linkChip}>
              <Text style={styles.linkChipText}>{link}</Text>
            </View>
          ))}
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
  sectionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(79, 209, 197, 0.12)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.3)",
  },
  sectionBadgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  partBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },
  partHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  partLabel: {
    color: Colors.accent,
    fontWeight: "800",
    fontSize: 13,
  },
  partMarks: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  partQuestion: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontStyle: "italic",
    opacity: 0.9,
    lineHeight: 19,
  },
  partAnswer: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  diagramBox: {
    marginTop: 4,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
  },
  tipBox: {
    paddingHorizontal: 2,
  },
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
  linksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 2,
  },
  linkChip: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  linkChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
});