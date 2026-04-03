import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, Text, View, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";

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

          <SectionCard label="Question" icon="help-circle-outline">
            <Text style={styles.bodyText}>Solve: x² - 5x + 6 = 0</Text>
          </SectionCard>

          <View style={{ height: 14 }} />

          <SectionCard label="Step-by-step" icon="format-list-numbered">
            <Text style={styles.bodyText}>
              Step 1: Identify the equation{"\n"}
              x² - 5x + 6 = 0{"\n\n"}
              Step 2: Factorize{"\n"}
              (x - 2)(x - 3) = 0{"\n\n"}
              Step 3: Zero product{"\n"}x - 2 = 0 OR x - 3 = 0{"\n\n"}
              Step 4: Solve{"\n"}x = 2 OR x = 3
            </Text>
          </SectionCard>

          <LinearGradient
            colors={[Colors.primaryDark, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.answerStrip}
          >
            <Text style={styles.answerLabel}>Final answer</Text>
            <Text style={styles.answerValue}>x = 2, 3</Text>
          </LinearGradient>
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
  bodyText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 26,
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
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },
});
