import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MathImageStepList from "../../components/math/MathImageStepList";
import MathSvgPreview from "../../components/math/MathSvgPreview";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";
import { formatRawQuestion } from "../../lib/mathQuestionText";

function decodeUriParam(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !raw.length) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export default function MathsImageSolutionScreen() {
  const router = useRouter();
  const { sourceImageUri, apiData } = useLocalSearchParams();

  // ✅ Fallback validation agar galti se data na aaye to screen crash na ho
  let data = null;
  try {
    if (apiData) {
      data = JSON.parse(Array.isArray(apiData) ? apiData[0] : apiData);
    }
  } catch (e) {
    console.error("Error parsing API data:", e);
  }

  const inputImageUri = decodeUriParam(sourceImageUri);

  if (!data) {
    return (
      <LinearGradient
        colors={[Colors.backgroundStart, Colors.backgroundEnd]}
        style={styles.flex1}
      >
        <SafeAreaView style={[styles.flex1, { justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700" }}>
            No solution data available.
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const displayMarks = data.marks ?? 0;
  const questionText = formatRawQuestion(data.raw_question ?? "");

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      style={styles.flex1}
    >
      <AppDecor />
      <SafeAreaView style={styles.flex1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <ScreenHeader
            onBack={() => router.back()}
            title="Solution"
            subtitle="Worked answer — show these steps in your exam."
            icon="lightbulb-on-outline"
          />

          <View style={styles.metaStrip}>
            <Text style={styles.metaText}>
              Question {data.question_number ?? 1} · {displayMarks} mark
              {Number(displayMarks) !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.metaSub}>
              {data.steps?.length ?? 0} step
              {(data.steps?.length ?? 0) !== 1 ? "s" : ""}
            </Text>
          </View>

          {inputImageUri ? (
            <>
              <SectionCard label="Your question image" icon="image-outline">
                <Image
                  source={{ uri: inputImageUri }}
                  style={styles.sourceImage}
                  contentFit="contain"
                />
              </SectionCard>
              <View style={styles.sectionGap} />
            </>
          ) : null}

          <SectionCard label="Question" icon="help-circle-outline">
            <Text style={styles.bodyText}>{questionText}</Text>
          </SectionCard>

          <View style={styles.sectionGap} />

          <SectionCard
            label="Step-by-step working"
            icon="format-list-numbered"
          >
            <MathImageStepList steps={data.steps ?? []} />
          </SectionCard>

          {data.visual_data ? (
            <>
              <View style={styles.sectionGap} />
              <SectionCard label="Diagram" icon="chart-line">
                <MathSvgPreview svg={data.visual_data} />
              </SectionCard>
            </>
          ) : null}

          <View style={styles.sectionGap} />

          <SectionCard label="Teacher's commentary" icon="school-outline">
            <Text style={styles.bodyTextMuted}>
              {data.mark_commentary || "No commentary provided."}
            </Text>
          </SectionCard>

          <LinearGradient
            colors={[Colors.primaryDark, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.answerStrip}
          >
            <Text style={styles.answerLabel}>Final answer</Text>
            <Text style={styles.answerValue}>
              {data.final_answer || "N/A"}
            </Text>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scroll: { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 8 },
  sectionGap: { height: 14 },
  metaStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  metaText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: "800",
  },
  metaSub: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  sourceImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
  },
  bodyText: {
    color: Colors.textPrimary,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
  },
  bodyTextMuted: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
  },
  answerStrip: { marginTop: 20, borderRadius: 18, padding: 18 },
  answerLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  answerValue: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});