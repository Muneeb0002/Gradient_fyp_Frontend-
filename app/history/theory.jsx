import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import AppLoader from "../../components/shared/AppLoader";
import ThemedMessageModal from "../../components/shared/ThemedMessageModal";
import QuestionInput from "../../components/shared/QuestionInput";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";
import { openSubjectResult } from "../../lib/subjectNavigation";
import { useAskAI } from "../../src/hooks/useAskAI.js";

export default function HistoryTheoryScreen() {
  const router = useRouter();
  const [marks, setMarks] = useState(null);
  const [question, setQuestion] = useState("");
  const [dialog, setDialog] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(true);

  // ✅ useMutation se sahi cheezein lo
  const { mutateAsync, isPending } = useAskAI();

  const handleGenerate = async () => {
    if (!question.trim()) {
      setDialog({
        title: "Missing question",
        message: "Please enter a question first.",
      });
      return;
    }

    if (marks == null) {
      setDialog({
        title: "Select marks",
        message: "Please select marks.",
      });
      return;
    }

    try {
      const prompt = `Question: ${question}\n\nProvide an answer suitable for ${marks} marks.`;

      // ✅ mutateAsync call karo
      const result = await mutateAsync({ query: prompt, marks: marks });

      // ✅ Answer ke sath solution page pe jao
      openSubjectResult(router, {
        pathname: "/history/solution",
        params: {
          question: question,
          marks: String(marks),
          mode: "theory",
          answer: result?.answer || result?.response || JSON.stringify(result),
          inputPath: "/history/theory",
        },
      });
    } catch (error) {
      setDialog({
        title: "Something went wrong",
        message: "Failed to generate answer. Please try again.",
      });
      console.error(error);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView style={styles.safe}>
        <ThemedMessageModal
          visible={!!dialog}
          title={dialog?.title}
          message={dialog?.message ?? ""}
          onClose={() => setDialog(null)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            <ScreenHeader
              onBack={() => router.back()}
              title="History - Theory"
              subtitle="Text-based structure with marks: 4 / 7 / 14"
              icon="book-open-page-variant"
            />

            <View style={styles.guidelinesCard}>
              <Pressable
                onPress={() => setShowGuidelines(!showGuidelines)}
                style={styles.guidelinesHeader}
              >
                <View style={styles.guidelinesHeaderLeft}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color={Colors.accent}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.guidelinesTitle}>Syllabus & Guidance</Text>
                </View>
                <MaterialCommunityIcons
                  name={showGuidelines ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.textMuted}
                />
              </Pressable>

              {showGuidelines && (
                <View style={styles.guidelinesContent}>
                  <Text style={styles.guidelinesIntro}>
                    To get the best examiner analysis, please follow these guidelines:
                  </Text>
                  
                  <View style={styles.guidelineRow}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={Colors.primary} style={styles.guidelineIcon} />
                    <Text style={styles.guidelineText}>
                      <Text style={{ fontWeight: "700", color: Colors.white }}>Scope: </Text>
                      Strictly O-Level Pakistan Studies History (2059/01, 1500 to present Subcontinent/Pakistan).
                    </Text>
                  </View>

                  <View style={styles.guidelineRow}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={Colors.primary} style={styles.guidelineIcon} />
                    <Text style={styles.guidelineText}>
                      <Text style={{ fontWeight: "700", color: Colors.white }}>Topics: </Text>
                      Mughal Empire decline, British rule, reform movements (Shah Waliullah), Pakistan Movement, and post-1947 events.
                    </Text>
                  </View>

                  <View style={styles.guidelineRow}>
                    <MaterialCommunityIcons name="close-circle" size={16} color={Colors.danger} style={styles.guidelineIcon} />
                    <Text style={styles.guidelineText}>
                      <Text style={{ fontWeight: "700", color: Colors.white }}>Avoid: </Text>
                      General knowledge, geography, math, science, or unrelated global history.
                    </Text>
                  </View>

                  <View style={styles.guidelineRow}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={16} color={Colors.accent} style={styles.guidelineIcon} />
                    <Text style={styles.guidelineNote}>
                      <Text style={{ fontWeight: "700" }}>AI Policy: </Text>
                      Queries outside Pakistan Studies History (2059/01) will be rejected by the examiner.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.card}>
              <SectionCard label="Your question" icon="pencil-outline">
                <QuestionInput
                  hideLabel
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Ask anything about history..."
                />
              </SectionCard>

              <Text style={styles.marksLabel}>Marks (answer length)</Text>

              <View style={styles.marksRow}>
                {[4, 7, 14].map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setMarks(m)}
                    style={[
                      styles.markChip,
                      marks === m && styles.markChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.markChipText,
                        marks === m && styles.markChipTextActive,
                      ]}
                    >
                      {m} marks
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* ✅ Loading indicator */}
              {isPending ? (
                <AppLoader
                  compact
                  title="Generating answer"
                  subtitle="AI is preparing your model answer…"
                />
              ) : null}

              <PrimaryButton
                title={isPending ? "Generating..." : "Generate answer"}
                handlePress={handleGenerate}
                disabled={isPending}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 48,
    paddingTop: 8,
    flexGrow: 1,
  },
  card: {
    marginTop: 8,
    borderRadius: 24,
    padding: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
      },
      android: { elevation: 8 },
    }),
  },
  marksLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 10,
  },
  marksRow: { flexDirection: "row", marginBottom: 8 },
  markChip: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  markChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  markChipText: {
    color: Colors.textSecondary,
    fontWeight: "800",
    fontSize: 14,
  },
  markChipTextActive: {
    color: Colors.white,
  },
  guidelinesCard: {
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  guidelinesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  guidelinesHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  guidelinesTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  guidelinesContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  guidelinesIntro: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  guidelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  guidelineIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  guidelineText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  guidelineNote: {
    flex: 1,
    color: Colors.accent,
    fontSize: 11,
    lineHeight: 15,
  },
});
