import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import McqResultView from "../../../components/economics/McqResultView";
import AppDecor from "../../../components/shared/AppDecor";
import ScreenHeader from "../../../components/shared/ScreenHeader";
import SectionCard from "../../../components/shared/SectionCard";
import SubjectResultActions from "../../../components/shared/SubjectResultActions";
import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";
import { getMcqSession } from "../../../lib/economicsMcqSession";
import { backToSubjectHub } from "../../../lib/subjectNavigation";

export default function EconomicsPaperOneResultScreen() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useFocusEffect(
    useCallback(() => {
      // ✅ Reset before loading so stale data never flashes
      setSession(null);
      getMcqSession().then(setSession);
    }, []),
  );

  // Still loading
  if (session === null) {
    return (
      <View style={styles.centerScreen}>
        <Text style={{ color: Colors.textMuted }}>Loading result…</Text>
      </View>
    );
  }

  const mode      = session?.mode      ?? "text";
  const question  = session?.question  ?? "";
  const imageUri  = session?.imageUri  ?? "";

  // ✅ FIX: No silent fallback to sample data — show error if API result missing
  const result = session?.apiResult ?? null;

  // No result guard
  if (!result) {
    return (
      <View style={styles.centerScreen}>
        <MaterialCommunityIcons name="alert-circle-outline" size={40} color={Colors.textMuted} />
        <Text style={styles.errorText}>
          No result found.{"\n"}Please go back and try again.
        </Text>
      </View>
    );
  }

  const modeLabel =
    mode === "image" ? "Image" : mode === "both" ? "Text + image" : "Text";

  const showQuestionText  = !!question.trim() && (mode === "text"  || mode === "both");
  const showQuestionImage = !!imageUri         && (mode === "image" || mode === "both");

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <ScreenHeader
            onBack={() => backToSubjectHub(router, "economics")}
            title="MCQ explained"
            subtitle={`Paper 1 · ${modeLabel}`}
            icon="check-decagram-outline"
            compact
          />

          {showQuestionImage ? (
            <SectionCard label="Your question image" icon="image-outline">
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.questionImage}
                  resizeMode="contain"
                />
              </View>
            </SectionCard>
          ) : null}

          {showQuestionText ? (
            <SectionCard
              label="Your question"
              icon="comment-question-outline"
              style={showQuestionImage ? styles.gap : undefined}
            >
              <Text style={styles.questionText}>{question}</Text>
            </SectionCard>
          ) : null}

          {!showQuestionText && !showQuestionImage ? (
            <View style={styles.emptyPrompt}>
              <MaterialCommunityIcons
                name="comment-question-outline"
                size={28}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyPromptText}>No question details saved.</Text>
            </View>
          ) : null}

          <View style={styles.resultWrap}>
            <McqResultView result={result} />
          </View>

          <SubjectResultActions
            subject="economics"
            inputHref="/economics/paper-1"
            anotherTitle="Explain Another MCQ"
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundStart,
  },
  errorText: {
    color: Colors.textMuted,
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  scroll: { paddingHorizontal: 22, paddingBottom: 48, paddingTop: 8 },
  imageWrap: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  questionImage: { width: "100%", height: 220 },
  gap: { marginTop: 14 },
  questionText: { color: Colors.textSecondary, ...Typography.bodySmall, lineHeight: 22 },
  emptyPrompt: { alignItems: "center", paddingVertical: 20, marginBottom: 8 },
  emptyPromptText: { color: Colors.textMuted, marginTop: 8, fontSize: 14 },
  resultWrap: { marginTop: 8 },
});