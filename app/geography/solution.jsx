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
  const { answer, marks, imageCount, mode, paths, queryType } = params;
  const questionRaw = params.question;
  const question =
    typeof questionRaw === "string"
      ? questionRaw
      : Array.isArray(questionRaw)
        ? questionRaw[0]
        : undefined;

  const modeValue = mode === "image" ? "image" : mode === "theory" ? "theory" : null;
  const isExamMode = modeValue === "theory"; // "image" hata diya
  const modeLabel = modeValue === "image" ? "Image-based" : "Theory-based";

  // const parsedPaths = paths ? JSON.parse(paths) : null;
   const  parsedFeatures = params.features ? JSON.parse(params.features) : [];

  console.log("FEATURES FINAL:", parsedFeatures);

  console.log("GEOFEATURES PROP CHECK:", parsedFeatures.length);

  console.log("Current Mode:", modeValue);
  console.log("Received Answer:", answer);
  const displayAnswer = typeof answer === 'string' ? answer : JSON.stringify(answer);

  if (isExamMode) {
    return (
      <LinearGradient
        colors={[
          Colors.backgroundStart,
          Colors.backgroundMiddle,
          Colors.backgroundEnd,
        ]}
        className="flex-1"
      >
        <AppDecor />
        <SafeAreaView className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            <ScreenHeader
              onBack={() => router.back()}
              title="Geography — model answer"
              subtitle={`${modeLabel} · Target: ${marks ?? "?"} marks${imageCount && Number(imageCount) > 0
                ? ` · ${imageCount} source image${Number(imageCount) > 1 ? "s" : ""}`
                : ""
                } — structure your paragraphs like this.`}
              icon="file-document-outline"
            />

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

            <SectionCard label="The Question" icon="pencil-outline">
              <Text style={styles.qText}>
                {question?.trim() ? question : "Geography Analysis"}
              </Text>
            </SectionCard>

            <View style={{ height: 16 }} />

            <View style={styles.answerWrap}>
              {answer ? (
                <HistoryAnswerCard marks={marks} mode={modeValue} answer={answer} />
              ) : (
                <Text style={{ color: 'white' }}>No answer found in params</Text>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
            subtitle="Expert breakdown based on your input."
            icon="map-marker-radius"
          />

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

          <SectionCard label="The Question" icon="help-circle-outline">
            <Text style={styles.qText}>
              {question || "Geographical Analysis"}
            </Text>
          </SectionCard>

          <View style={{ height: 16 }} />

          {parsedFeatures.length > 0 && (
            <>
              <View style={{ height: 16 }} />
              <View style={styles.block}>
                <GeoFeatures data={parsedFeatures} />
              </View>

              <View style={{ height: 12 }} />

              <View style={styles.block}>
                {queryType === "graph"
                  ? <GeoGraph data={parsedFeatures} />
                  : <GeoMap data={parsedFeatures} />
                }
              </View>
              <View style={{ height: 12 }} />
            </>
          )}

          <GeoAnswerCard
            queryType={queryType || "text"}
            answer={answer}
          />
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
