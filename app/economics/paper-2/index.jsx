import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EconomicsModeCard from "../../../components/economics/EconomicsModeCard";
import AppDecor from "../../../components/shared/AppDecor";
import ScreenHeader from "../../../components/shared/ScreenHeader";
import Colors from "../../../constants/Colors";

const SECTIONS = [
  {
    id: "A",
    title: "Section A",
    subtitle: "Data response from source material",
    hint: "Upload 1–3 photos of the question paper. Marks are read from the images.",
    icon: "image-multiple-outline",
    route: "/economics/paper-2/section-a",
  },
  {
    id: "B",
    title: "Section B",
    subtitle: "Structured essay-style questions",
    hint: "Type your question or upload one image. Marks follow command words.",
    icon: "text-box-outline",
    route: "/economics/paper-2/section-b",
  },
];

export default function EconomicsPaperTwoScreen() {
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
            title="Paper 2"
            subtitle="Structured questions · Sections A & B"
            icon="file-document-outline"
          />

          <View style={styles.syllabusChip}>
            <MaterialCommunityIcons name="information-outline" size={18} color={Colors.accent} />
            <Text style={styles.syllabusText}>
              Choose the section that matches your exam paper.
            </Text>
          </View>

          <View style={styles.grid}>
            {SECTIONS.map((item) => (
              <EconomicsModeCard
                key={item.id}
                onPress={() => router.push(item.route)}
                badge={`Section ${item.id}`}
                title={item.title}
                subtitle={item.subtitle}
                hint={item.hint}
                icon={item.icon}
                minHeight={200}
              />
            ))}
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
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
  grid: {
    flexDirection: "column",
    gap: 14,
    width: "100%",
  },
});
