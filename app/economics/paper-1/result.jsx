import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import McqResultView from "../../../components/economics/McqResultView";
import AppDecor from "../../../components/shared/AppDecor";
import ScreenHeader from "../../../components/shared/ScreenHeader";
import SubjectResultActions from "../../../components/shared/SubjectResultActions";
import SectionCard from "../../../components/shared/SectionCard";
import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";
import { SAMPLE_MCQ_RESULT } from "../../../constants/economicsSampleData";
import { getMcqSession } from "../../../lib/economicsMcqSession";
import { backToSubjectHub } from "../../../lib/subjectNavigation";

export default function EconomicsPaperOneResultScreen() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getMcqSession().then(setSession);
    }, []),
  );

  const mode = session?.mode ?? "text";
  const question = session?.question ?? "";
  const imageUri = session?.imageUri ?? "";

  const modeLabel =
    mode === "image" ? "Image" : mode === "both" ? "Text + image" : "Text";

  const showQuestionText =
    !!question.trim() && (mode === "text" || mode === "both");
  const showQuestionImage =
    !!imageUri && (mode === "image" || mode === "both");

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
            <McqResultView result={SAMPLE_MCQ_RESULT} />
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
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 48,
    paddingTop: 8,
  },
  imageWrap: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  questionImage: {
    width: "100%",
    height: 220,
  },
  gap: {
    marginTop: 14,
  },
  questionText: {
    color: Colors.textSecondary,
    ...Typography.bodySmall,
    lineHeight: 22,
  },
  emptyPrompt: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 8,
  },
  emptyPromptText: {
    color: Colors.textMuted,
    marginTop: 8,
    fontSize: 14,
  },
  resultWrap: {
    marginTop: 8,
  },
});
