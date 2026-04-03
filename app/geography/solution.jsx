import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router"; // Params receive karne ke liye
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GeoAnswerCard from "../../components/geography/GeoAnswerCard";
import GeoFeatures from "../../components/geography/GeoFeatures";
import GeoMap from "../../components/geography/GeoMap";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";

export default function GeographySolution() {
  const router = useRouter();
  
  // 1. Pichli screen (GeographyScreen) se data receive karna
  const params = useLocalSearchParams();
  const { question, answer, paths, queryType } = params;

  // JSON string ko wapas array mein convert karna (Map ke liye)
  const parsedPaths = paths ? JSON.parse(paths) : null;

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
            title="Geography solution"
            subtitle="AI breakdown — keywords, map, and examiner-style points."
            icon="map-marker-radius"
          />

          {/* 2. Dynamic Question Section */}
          <SectionCard label="Question Analyzed" icon="help-circle-outline">
            <Text style={styles.qText}>
              {question || "Explain the formation of river deltas with reference to the Nile Delta."}
            </Text>
          </SectionCard>

          <View style={{ height: 16 }} />

          {/* 3. AI Features / Keywords Breakdown */}
          <View style={styles.block}>
            <GeoFeatures />
          </View>

          <View style={{ height: 12 }} />

          {/* 4. Dynamic Map Section */}
          <View style={styles.block}>
            {/* Agar paths maujood hain tu GeoMap ko pass karein, 
               warna ye default (Nile Delta) dikhayega 
            */}
            <GeoMap data={parsedPaths} />
          </View>

          <View style={{ height: 12 }} />

          {/* 5. Dynamic Answer Card */}
          <GeoAnswerCard 
            queryType={queryType || "text"} 
            answer={answer || "Generating detailed examiner-style breakdown..."} 
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
    fontWeight: '500',
  },
  block: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Halki si transparency
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
});