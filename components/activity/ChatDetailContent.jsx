import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import HistoryAnswerCard from "../history/HistoryAnswerCard";
import SectionCard from "../shared/SectionCard";
import Colors from "../../constants/Colors";
import {
  formatChatDate,
  getModeMeta,
} from "../../lib/chatHistoryUtils";

export default function ChatDetailContent({ chat }) {
  const modeMeta = getModeMeta(chat.mode);

  return (
    <>
      <LinearGradient
        colors={[`${modeMeta.color}22`, "rgba(255,255,255,0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <View
            style={[styles.modeBadge, { borderColor: modeMeta.color + "55" }]}
          >
            <MaterialCommunityIcons
              name={modeMeta.icon}
              size={16}
              color={modeMeta.color}
            />
            <Text style={[styles.modeLabel, { color: modeMeta.color }]}>
              {modeMeta.label}
            </Text>
          </View>
          <View style={styles.marksBadge}>
            <Text style={styles.marksLabel}>{chat.marks ?? "—"} marks</Text>
          </View>
        </View>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={15}
            color={Colors.textMuted}
          />
          <Text style={styles.dateText}>{formatChatDate(chat.createdAt)}</Text>
        </View>
      </LinearGradient>

      <View style={styles.bubbleSection}>
        <Text style={styles.bubbleLabel}>Your question</Text>
        <View style={styles.questionBubble}>
          <Text style={styles.questionText}>{chat.query}</Text>
        </View>
      </View>

      <View style={{ height: 20 }} />

      <SectionCard label="AI response" icon="robot-outline">
        <View style={styles.answerWrap}>
          <HistoryAnswerCard
            marks={String(chat.marks ?? "")}
            mode={chat.mode === "image" ? "image" : "theory"}
            answer={chat.answer}
          />
        </View>
      </SectionCard>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  modeLabel: { fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  marksBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  marksLabel: { color: Colors.white, fontSize: 12, fontWeight: "800" },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  dateText: { color: Colors.textMuted, fontSize: 13, fontWeight: "600" },
  bubbleSection: { marginBottom: 4 },
  bubbleLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  questionBubble: {
    alignSelf: "flex-end",
    maxWidth: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  questionText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  answerWrap: { marginTop: -4 },
});
