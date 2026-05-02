import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GeoAnswerCard from "../../components/geography/GeoAnswerCard";
import GeoFeatures from "../../components/geography/GeoFeatures";
import GeoGraph from "../../components/geography/GeoGraph";
import GeoMap from "../../components/geography/GeoMap";
import HistoryAnswerCard from "../../components/history/HistoryAnswerCard";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";

export default function GeographySolution() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { answer, marks, imageCount, mode, queryType } = params;

  const questionRaw = params.question;
  const question =
    typeof questionRaw === "string"
      ? questionRaw
      : Array.isArray(questionRaw)
        ? questionRaw[0]
        : undefined;

  // ✅ Features safely parse karo
  let parsedFeatures = [];
  try {
    if (params.features) {
      const parsed = JSON.parse(params.features);
      parsedFeatures = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.log("Features parse error:", e);
    parsedFeatures = [];
  }

  const modeValue =
    mode === "image" ? "image" : mode === "theory" ? "theory" : null;
  const modeLabel = modeValue === "image" ? "Image-based" : "Theory-based";
  const hasFeatures = parsedFeatures.length > 0;

  // ✅ DEBUG
  console.log("parsedFeatures:", JSON.stringify(parsedFeatures, null, 2));
  console.log("hasFeatures:", hasFeatures);
  console.log("mode:", modeValue);

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
            title="Geography Solution"
            subtitle={
              modeValue
                ? `${modeLabel} · Target: ${marks ?? "?"} marks${
                    imageCount && Number(imageCount) > 0
                      ? ` · ${imageCount} source image${
                          Number(imageCount) > 1 ? "s" : ""
                        }`
                      : ""
                  }`
                : "Expert breakdown based on your input."
            }
            icon="map-marker-radius"  // ✅ Valid icon
          />

          {/* Source Image */}
          {params.image && (
            <SectionCard label="Source Image" icon="image-outline">
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: params.image }}
                  style={styles.sourceImg}
                  resizeMode="contain"
                />
              </View>
            </SectionCard>
          )}

          {/* Question */}
          <SectionCard label="The Question" icon="help-circle-outline">
            <Text style={styles.qText}>
              {question?.trim() ? question : "Geographical Analysis"}
            </Text>
          </SectionCard>

          <View style={{ height: 16 }} />

          {/* ✅ Features + Map — THEORY MODE MEIN BHI DIKHAO */}
          {hasFeatures && (
            <>
              <View style={styles.block}>
                <GeoFeatures data={parsedFeatures} />
              </View>

              <View style={{ height: 12 }} />

              <View style={styles.block}>
                {queryType === "graph" ? (
                  <GeoGraph data={parsedFeatures} />
                ) : (
                  <GeoMap data={parsedFeatures} />
                )}
              </View>

              <View style={{ height: 16 }} />
            </>
          )}

          {/* ✅ Answer Card */}
          {modeValue === "theory" || modeValue === "image" ? (
            <View style={styles.answerWrap}>
              {answer ? (
                <HistoryAnswerCard
                  marks={marks}
                  mode={modeValue}
                  answer={answer}
                />
              ) : (
                <Text style={{ color: "white", padding: 16 }}>
                  No answer found.
                </Text>
              )}
            </View>
          ) : (
            <GeoAnswerCard
              queryType={queryType || "text"}
              answer={answer}
            />
          )}
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
    fontWeight: "500",
  },
  block: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
    }),
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
  imageBox: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginTop: 4,
  },
  sourceImg: {
    width: "100%",
    height: "100%",
  },
});