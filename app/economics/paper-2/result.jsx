import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Paper2ResultView from "../../../components/economics/Paper2ResultView";
import AppDecor from "../../../components/shared/AppDecor";
import ScreenHeader from "../../../components/shared/ScreenHeader";
import SubjectResultActions from "../../../components/shared/SubjectResultActions";
import SectionCard from "../../../components/shared/SectionCard";
import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";
import { getPaper2ResultForSection } from "../../../constants/economicsSampleData";
import { getPaper2Session } from "../../../lib/economicsPaper2Session";
import { backToSubjectHub } from "../../../lib/subjectNavigation";

export default function EconomicsPaperTwoResultScreen() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getPaper2Session().then(setSession);
    }, []),
  );

  const section = session?.section ?? "A";
  const inputMode = session?.inputMode ?? "image";
  const query = session?.query ?? "";
  const imageUris = Array.isArray(session?.imageUris) ? session.imageUris : [];

  const result = getPaper2ResultForSection(section);

  const modeLabel =
    inputMode === "image"
      ? imageUris.length > 1
        ? `${imageUris.length} images`
        : "Image"
      : "Text";

  const showQuery = !!query.trim() && section === "B" && inputMode === "text";
  const showImages = imageUris.length > 0;
  const inputHref =
    section === "B" ? "/economics/paper-2/section-b" : "/economics/paper-2/section-a";

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
            title="Paper 2 explained"
            subtitle={`Section ${section} · ${modeLabel}`}
            icon="check-decagram-outline"
            compact
          />

          {showImages ? (
            <SectionCard
              label={imageUris.length > 1 ? "Your question images" : "Your question image"}
              icon="image-outline"
            >
              <View style={styles.imageStack}>
                {imageUris.map((uri, index) => (
                  <View key={`${uri}-${index}`} style={styles.imageWrap}>
                    {imageUris.length > 1 ? (
                      <View style={styles.imageIndex}>
                        <Text style={styles.imageIndexText}>{index + 1}</Text>
                      </View>
                    ) : null}
                    <Image
                      source={{ uri }}
                      style={styles.questionImage}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </View>
            </SectionCard>
          ) : null}

          {showQuery ? (
            <SectionCard
              label="Your question"
              icon="comment-question-outline"
              style={showImages ? styles.gap : undefined}
            >
              <Text style={styles.questionText}>{query}</Text>
            </SectionCard>
          ) : null}

          {!showQuery && !showImages ? (
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
            <Paper2ResultView result={result} />
          </View>

          <SubjectResultActions
            subject="economics"
            inputHref={inputHref}
            anotherTitle="Answer Another Question"
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
  imageStack: {
    gap: 12,
  },
  imageWrap: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    position: "relative",
  },
  imageIndex: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  imageIndexText: {
    color: Colors.backgroundStart,
    fontSize: 12,
    fontWeight: "900",
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
