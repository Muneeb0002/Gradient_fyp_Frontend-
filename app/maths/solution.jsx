import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, Text, View, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";

/** Static sample solution for UI only — replace with API output later. */
const SAMPLE = {
  question: "2x² + 4x + 10 = 0",
  methodTitle: "Method",
  methodBody:
    "Treat as a quadratic in standard form ax² + bx + c = 0, then use the discriminant Δ = b² − 4ac to decide the type of roots before solving.",
  workingTitle: "Working",
  workingBody:
    "Here a = 2, b = 4, c = 10.\n\n"
    + "Δ = b² − 4ac = 4² − 4(2)(10) = 16 − 80 = −64.\n\n"
    + "Since Δ < 0, there are no real roots. The solutions exist only in the complex numbers.",
  examTitle: "How to write this in an exam",
  examBody:
    "State the discriminant, show its value is negative, then conclude “no real solutions” (or give complex roots if the question asks for them).",
  finalLabel: "Final answer",
  finalValue: "No real values of x satisfy the equation.",
};

export default function SolutionScreen() {
  const router = useRouter();

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
            title="Solution"
            subtitle="Worked answer — show these steps in your exam working."
            icon="lightbulb-on-outline"
          />

          <View style={styles.card}>
            <SectionCard label="Question" icon="help-circle-outline">
              <Text style={styles.bodyText}>{SAMPLE.question}</Text>
            </SectionCard>

            <View style={styles.sectionGap} />

            <SectionCard label={SAMPLE.methodTitle} icon="chart-bell-curve">
              <Text style={styles.bodyTextMuted}>{SAMPLE.methodBody}</Text>
            </SectionCard>

            <View style={styles.sectionGap} />

            <SectionCard label={SAMPLE.workingTitle} icon="format-list-numbered">
              <Text style={styles.bodyText}>{SAMPLE.workingBody}</Text>
            </SectionCard>

            <View style={styles.sectionGap} />

            <SectionCard label={SAMPLE.examTitle} icon="school-outline">
              <Text style={styles.bodyTextMuted}>{SAMPLE.examBody}</Text>
            </SectionCard>

            <LinearGradient
              colors={[Colors.primaryDark, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.answerStrip}
            >
              <Text style={styles.answerLabel}>{SAMPLE.finalLabel}</Text>
              <Text style={styles.answerValue}>{SAMPLE.finalValue}</Text>
            </LinearGradient>
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
  card: {
    marginTop: 4,
  },
  sectionGap: {
    height: 14,
  },
  bodyText: {
    color: Colors.textPrimary,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "600",
  },
  bodyTextMuted: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
  },
  answerStrip: {
    marginTop: 20,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  answerLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  answerValue: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    lineHeight: 26,
  },
});
