import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Paper2ResultView from "../../../components/economics/Paper2ResultView";
import AppDecor from "../../../components/shared/AppDecor";
import ScreenHeader from "../../../components/shared/ScreenHeader";
import SectionCard from "../../../components/shared/SectionCard";
import SubjectResultActions from "../../../components/shared/SubjectResultActions";

import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";
import { getPaper2Session } from "../../../lib/economicsPaper2Session";
import { backToSubjectHub } from "../../../lib/subjectNavigation";

export default function EconomicsPaperTwoResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [session, setSession] = useState(null);

  // ✅ KEY FIX: paramsRef se latest params hamesha milenge
  // chahe useFocusEffect ka callback stale closure mein ho
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        // ✅ Ref se read karo — har focus pe fresh value milegi
        const currentSection = paramsRef.current?.section ?? null;

        if (currentSection === "A" || currentSection === "B") {
          const data = await getPaper2Session(currentSection);
          setSession(data);
          return;
        }

        // Fallback agar koi param na ho
        const a = await getPaper2Session("A");
        const b = await getPaper2Session("B");
        setSession(a || b);
      };

      // ✅ Pehle reset karo taake purana data flash na kare
      setSession(null);
      load();
    }, []) // ✅ Empty deps — ref se fresh params milti hain
  );

  const section   = session?.section   ?? "A";
  const inputMode = session?.inputMode ?? "image";
  const query     = session?.query     ?? "";
  const imageUris = Array.isArray(session?.imageUris) ? session.imageUris : [];
  const apiResult = session?.apiResult;

  // Sirf is section ka result lo
  let result = null;

  if (Array.isArray(apiResult)) {
    const filtered = apiResult.filter((r) => r?.section === section);
    result =
      filtered.find((item) => item?.detected_parts?.length > 0) ||
      filtered[0] ||
      null;
  } else if (apiResult && typeof apiResult === "object") {
    if (!apiResult.section || apiResult.section === section) {
      result = apiResult;
    }
  }

  // Still loading
  if (session === null) {
    return (
      <View style={styles.centerScreen}>
        <Text style={{ color: Colors.textMuted }}>Loading result…</Text>
      </View>
    );
  }

  // No result found
  if (!result) {
    return (
      <View style={styles.centerScreen}>
        <MaterialCommunityIcons name="alert-circle-outline" size={40} color={Colors.textMuted} />
        <Text style={styles.errorText}>
          No result found for Section {section}.{"\n"}Please go back and try again.
        </Text>
      </View>
    );
  }

  const modeLabel =
    inputMode === "image"
      ? imageUris.length > 1
        ? `${imageUris.length} images`
        : "Image"
      : "Text";

  const showQuery  = !!query.trim() && inputMode === "text";
  const showImages = imageUris.length > 0;

  const inputHref =
    section === "B"
      ? "/economics/paper-2/section-b"
      : "/economics/paper-2/section-a";

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

          {showImages && (
            <SectionCard
              label={imageUris.length > 1 ? "Your question images" : "Your question image"}
              icon="image-outline"
            >
              <View style={styles.imageStack}>
                {imageUris.map((uri, index) => (
                  <View key={`${uri}-${index}`} style={styles.imageWrap}>
                    {imageUris.length > 1 && (
                      <View style={styles.imageIndex}>
                        <Text style={styles.imageIndexText}>{index + 1}</Text>
                      </View>
                    )}
                    <Image
                      source={{ uri }}
                      style={styles.questionImage}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </View>
            </SectionCard>
          )}

          {showQuery && (
            <SectionCard
              label="Your question"
              icon="comment-question-outline"
              style={showImages ? styles.gap : undefined}
            >
              <Text style={styles.questionText}>{query}</Text>
            </SectionCard>
          )}

          {!showQuery && !showImages && (
            <View style={styles.emptyPrompt}>
              <MaterialCommunityIcons
                name="comment-question-outline"
                size={28}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyPromptText}>No question details saved.</Text>
            </View>
          )}

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
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 48,
    paddingTop: 8,
  },
  imageStack: { gap: 12 },
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
  questionImage: { width: "100%", height: 220 },
  gap: { marginTop: 14 },
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
  resultWrap: { marginTop: 8 },
});