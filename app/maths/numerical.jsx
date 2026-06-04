import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import QuestionInput from "../../components/shared/QuestionInput";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import ThemedMessageModal from "../../components/shared/ThemedMessageModal";
import Colors from "../../constants/Colors";
import { openSubjectResult } from "../../lib/subjectNavigation";

const MARK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function MathsNumericalScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [marks, setMarks] = useState(null);
  const [marksError, setMarksError] = useState(false);
  const [dialog, setDialog] = useState(null);

  const handleSelectMark = (m) => {
    setMarks(m);
    setMarksError(false);
  };

  const handleSolve = () => {
    if (!query.trim()) {
      setMarksError(true);
      setDialog({
        title: "Question required",
        message: "Please enter your maths question before solving.",
      });
      return;
    }

    if (!marks) {
      setMarksError(true);
      setDialog({
        title: "Select marks",
        message: "Please select marks from 1 to 9 for your answer.",
      });
      return;
    }

    setMarksError(false);
    setDialog(null);

    openSubjectResult(router, {
      pathname: "/maths/solution",
      params: {
        query: query.trim(),
        marks: marks.toString(),
        inputPath: "/maths/numerical",
      },
    });
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <ThemedMessageModal
        visible={!!dialog}
        title={dialog?.title ?? ""}
        message={dialog?.message ?? ""}
        onClose={() => setDialog(null)}
      />
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <ScreenHeader
            compact
            onBack={() => router.back()}
            title="Numerical question"
            subtitle="Enter numbers, equations, or a word problem."
            icon="numeric"
          />

          <View style={styles.card}>
            <SectionCard label="Your question" icon="pencil-outline">
              <QuestionInput
                hideLabel
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  if (text.trim()) setMarksError(false);
                }}
                placeholder="e.g. 2x² + 4x + 10 = 0"
                helperText="Write the full question in one line if you can."
              />
              {marksError && !query.trim() ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>
                    Please enter your question.
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

            {marksError && query.trim() && !marks ? (
              <View style={[styles.errorBox, { marginTop: 10 }]}>
                <Text style={styles.errorText}>Please select marks (1 to 9).</Text>
              </View>
            ) : null}

            <View style={{ height: 10 }} />

            <PrimaryButton title="Solve question" handlePress={handleSolve} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 22, paddingBottom: 32, paddingTop: 8 },
  card: {
    marginTop: 8,
    borderRadius: 24,
    padding: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.22, shadowRadius: 14 },
      android: { elevation: 8 },
    }),
  },
  errorBox: { marginTop: 10, padding: 10, borderRadius: 14, backgroundColor: 'rgba(255,0,0,0.1)', borderWidth: 1, borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 13, fontWeight: "700" },
  marksLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  marksRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 8 },
  markChip: { width: "30%", marginBottom: 10, paddingVertical: 12, borderRadius: 14, alignItems: "center", backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.cardBorder },
  markChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primaryDark },
  markChipText: { color: Colors.textSecondary, fontWeight: "800", fontSize: 14 },
  markChipTextActive: { color: Colors.white },
});