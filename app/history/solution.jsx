import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HistoryAnswerCard from "../../components/history/HistoryAnswerCard";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";

export default function HistorySolutionScreen() {
  const router = useRouter();

  const { marks, imageCount, mode, answer, question, sourceImageUri } =
    useLocalSearchParams();

  const modeValue = mode === "image" ? "image" : "theory";
  const modeLabel = modeValue === "image" ? "Image-based" : "Theory-based";
  const isImageMode = modeValue === "image";

  const sourceUriParam = Array.isArray(sourceImageUri)
    ? sourceImageUri[0]
    : sourceImageUri;
  let inputImageUri = "";
  if (typeof sourceUriParam === "string" && sourceUriParam.length > 0) {
    try {
      inputImageUri = decodeURIComponent(sourceUriParam);
    } catch {
      inputImageUri = sourceUriParam;
    }
  }

  // 🔥 SAFE ANSWER FIX
  const cleanAnswer =
    typeof answer === "string"
      ? answer
      : answer
      ? JSON.stringify(answer, null, 2)
      : "No answer generated";

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      style={{ flex: 1 }}
    >
      <AppDecor />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <ScreenHeader
            onBack={() => router.back()}
            title="Model answer"
            subtitle={`${modeLabel} · Target: ${marks ?? "?"} marks${
              imageCount && Number(imageCount) > 0
                ? ` · ${imageCount} source image${
                    Number(imageCount) > 1 ? "s" : ""
                  }`
                : ""
            }`}
            icon="file-document-outline"
          />

          {!isImageMode ? (
            <>
              <SectionCard label="Question" icon="help-circle-outline">
                <Text style={styles.qText}>
                  {question || "No question provided."}
                </Text>
              </SectionCard>

              <View style={{ height: 16 }} />
            </>
          ) : null}

          {isImageMode && inputImageUri ? (
            <>
              <SectionCard label="Your source image" icon="image-outline">
                <Image
                  source={{ uri: inputImageUri }}
                  style={styles.sourceImage}
                  resizeMode="contain"
                  accessibilityRole="image"
                  accessibilityLabel="Uploaded source image for this answer"
                />
              </SectionCard>

              <View style={{ height: 16 }} />
            </>
          ) : null}

          {/* ANSWER */}
          <View style={styles.answerWrap}>
            <HistoryAnswerCard
              marks={marks}
              mode={modeValue}
              answer={cleanAnswer}   // ✅ FIXED HERE
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
    paddingBottom: 36,
    paddingTop: 8,
  },

  qText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 26,
  },

  sourceImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
  },

  answerWrap: {
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
});