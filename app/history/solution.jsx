import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import HistoryAnswerCard from "../../components/history/HistoryAnswerCard";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";

export default function HistorySolutionScreen() {
  const router = useRouter();
  const { marks, imageCount } = useLocalSearchParams();

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
            title="Model answer"
            subtitle={`Target: ${marks ?? "?"} marks${
              imageCount && Number(imageCount) > 0
                ? ` · ${imageCount} source image${Number(imageCount) > 1 ? "s" : ""}`
                : ""
            } — structure your paragraphs like this.`}
            icon="file-document-outline"
          />

          <SectionCard label="Question" icon="help-circle-outline">
            <Text style={styles.qText}>
              Describe the effects of the partition of 1947 on the people of
              Pakistan.
            </Text>
          </SectionCard>

          <View style={{ height: 16 }} />

          <View style={styles.answerWrap}>
            <HistoryAnswerCard marks={marks} />
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
