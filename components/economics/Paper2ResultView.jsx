import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import MathSvgPreview from "../math/MathSvgPreview";
import SectionCard from "../shared/SectionCard";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

function PartCard({ item, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <View style={styles.partCard}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [styles.partHeader, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.partHeaderLeft}>
          <View style={styles.partBadge}>
            <Text style={styles.partBadgeText}>{item.part ?? `Part ${index + 1}`}</Text>
          </View>
          {item.marks != null ? (
            <View style={styles.marksBadge}>
              <Text style={styles.marksText}>{item.marks} mark{item.marks === 1 ? "" : "s"}</Text>
            </View>
          ) : null}
        </View>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={22}
          color={Colors.textMuted}
        />
      </Pressable>

      {open ? (
        <View style={styles.partBody}>
          {item.question ? (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Question</Text>
              <Text style={styles.blockText}>{item.question}</Text>
            </View>
          ) : null}
          {item.answer ? (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Mark-scheme answer</Text>
              <Text style={styles.answerText}>{item.answer}</Text>
            </View>
          ) : null}
          {item.diagram_svg ? (
            <MathSvgPreview svg={item.diagram_svg} title="Examiner diagram" />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function Paper2ResultView({ result }) {
  const parts = Array.isArray(result?.detected_parts) ? result.detected_parts : [];
  const links = Array.isArray(result?.syllabus_links) ? result.syllabus_links.filter(Boolean) : [];

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Paper 2 · Section {result?.section ?? "—"}</Text>
        <View style={styles.metaRow}>
          {result?.input_mode ? (
            <View style={styles.metaPill}>
              <MaterialCommunityIcons name="file-document-outline" size={14} color={Colors.accent} />
              <Text style={styles.metaText}>{result.input_mode}</Text>
            </View>
          ) : null}
          {result?.marks_source ? (
            <View style={styles.metaPill}>
              <MaterialCommunityIcons name="counter" size={14} color={Colors.accent} />
              <Text style={styles.metaText}>{result.marks_source}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.partsCount}>
          {parts.length} part{parts.length === 1 ? "" : "s"} answered
        </Text>
      </View>

      {parts.length > 0 ? (
        <SectionCard label="Detected parts" icon="format-list-numbered" style={styles.gap}>
          {parts.map((item, i) => (
            <PartCard key={`part-${item.part ?? i}`} item={item} index={i} />
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

      {links.length > 0 ? (
        <SectionCard label="Syllabus links" icon="link-variant" style={styles.gap}>
          <View style={styles.linkRow}>
            {links.map((link) => (
              <View key={link} style={styles.linkChip}>
                <Text style={styles.linkText}>{link}</Text>
              </View>
            ))}
          </View>
        </SectionCard>
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
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
    }),
  },
  heroLabel: {
    color: Colors.textMuted,
    ...Typography.sectionLabel,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  metaText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  partsCount: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  gap: { marginTop: 14 },
  partCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  partHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  partHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    flexWrap: "wrap",
  },
  partBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(79, 209, 197, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
  },
  partBadgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  marksBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  marksText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  partBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  block: {
    marginTop: 12,
  },
  blockLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  blockText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
  answerText: {
    color: Colors.textSecondary,
    ...Typography.bodySmall,
    lineHeight: 22,
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
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  linkChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
});
