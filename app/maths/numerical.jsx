import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import PrimaryButton from "../../components/auth/PrimaryButton";
import QuestionInput from "../../components/shared/QuestionInput";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";

const MARK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function MathsNumericalScreen() {
  const router = useRouter();
  const [marks, setMarks] = useState(null);
  const [marksError, setMarksError] = useState(false);

  const handleSelectMark = (m) => {
    setMarks(m);
    setMarksError(false);
  };

  const handleSolve = () => {
    if (!marks) {
      setMarksError(true);
      return;
    }
    router.push("/maths/solution");
  };

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
            title="Numerical question"
            subtitle="Type your O Level maths question — numbers, equations, or word problems."
            icon="numeric"
          />

          <View style={styles.card}>
            <SectionCard label="Your question" icon="pencil-outline">
              <QuestionInput hideLabel />
              {marksError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>
                    Please select marks from 1 to 9 before solving.
                  </Text>
                </View>
              ) : null}
            </SectionCard>

            <Text style={styles.marksLabel}>Select Marks (1 to 9)</Text>

            <View style={styles.marksRow}>
              {MARK_OPTIONS.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => handleSelectMark(m)}
                  style={[
                    styles.markChip,
                    marks === m && styles.markChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.markChipText,
                      marks === m && styles.markChipTextActive,
                    ]}
                  >
                    {m} marks
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ height: 10 }} />

            <PrimaryButton title="Solve question" handlePress={handleSolve} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
    paddingTop: 8,
  },
  card: {
    marginTop: 8,
    borderRadius: 24,
    padding: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
      },
      android: { elevation: 8 },
    }),
  },
  errorBox: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: Colors.dangerSoft,
    borderWidth: 1,
    borderColor: "rgba(251, 113, 133, 0.45)",
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  marksLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 10,
  },
  marksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  markChip: {
    width: "30%",
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  markChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  markChipText: {
    color: Colors.textSecondary,
    fontWeight: "800",
    fontSize: 14,
  },
  markChipTextActive: {
    color: Colors.white,
  },
});
