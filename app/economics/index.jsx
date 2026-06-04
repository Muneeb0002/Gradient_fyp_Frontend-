import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EconomicsModeCard from "../../components/economics/EconomicsModeCard";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import Colors from "../../constants/Colors";

export default function EconomicsHubScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ScreenHeader
            onBack={() => router.back()}
            title="Economics"
            subtitle="Cambridge O Level 2281 — choose your paper type"
            icon="chart-line"
          />

          <View style={styles.syllabusChip}>
            <MaterialCommunityIcons name="certificate-outline" size={18} color={Colors.accent} />
            <Text style={styles.syllabusText}>Syllabus 2281 · Examiner-style guidance</Text>
          </View>

          <View style={styles.grid}>
            <EconomicsModeCard
              onPress={() => router.push("/economics/paper-1")}
              badge="Paper 1"
              title="Multiple choice"
              subtitle="Explain MCQs with mark-scheme clarity"
              hint="Paste question text, upload a photo, or use both for a full examiner breakdown."
              icon="format-list-checks"
            />
            <EconomicsModeCard
              onPress={() => router.push("/economics/paper-2")}
              badge="Paper 2"
              title="Structured questions"
              subtitle="Section A & B with diagrams"
              hint="Upload paper photos for Section A, or type/upload for Section B examiner answers."
              icon="file-document-outline"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 48,
    paddingTop: 8,
  },
  syllabusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 16,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  syllabusText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "column",
    gap: 14,
    width: "100%",
  },
});
