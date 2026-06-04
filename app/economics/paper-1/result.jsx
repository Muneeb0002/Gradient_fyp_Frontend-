import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../../components/auth/PrimaryButton";
import McqResultView from "../../../components/economics/McqResultView";
import AppDecor from "../../../components/shared/AppDecor";
import ScreenHeader from "../../../components/shared/ScreenHeader";
import SectionCard from "../../../components/shared/SectionCard";
import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";
import { SAMPLE_MCQ_RESULT } from "../../../constants/economicsSampleData";

export default function EconomicsPaperOneResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const question = params?.question ?? "";
  const mode = params?.mode ?? "text";

  const modeLabel =
    mode === "image" ? "Image" : mode === "both" ? "Text + image" : "Text";

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
            onBack={() => router.back()}
            title="MCQ explained"
            subtitle={`Paper 1 · ${modeLabel}`}
            icon="check-decagram-outline"
            compact
          />

          {question ? (
            <SectionCard label="Your question" icon="comment-question-outline">
              <Text style={styles.questionText}>{question}</Text>
            </SectionCard>
          ) : null}

          <McqResultView result={SAMPLE_MCQ_RESULT} />

          <View style={styles.actions}>
            <PrimaryButton
              title="Explain another MCQ"
              handlePress={() => router.replace("/economics/paper-1")}
            />
            <PrimaryButton
              title="Back to Economics"
              handlePress={() => router.replace("/economics")}
            />
          </View>
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
  questionText: {
    color: Colors.textSecondary,
    ...Typography.bodySmall,
    lineHeight: 22,
  },
  actions: {
    marginTop: 20,
    gap: 4,
  },
});
