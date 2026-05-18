import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";
import { useConcept } from "../../src/hooks/useConceptKey.js";
import { useMathSolver } from "../../src/hooks/useMathSolver";

function StepConceptPanel({ conceptKey, onClose }) {
  const {
    data: concept,
    isLoading: isConceptLoading,
    error: conceptError,
  } = useConcept(conceptKey);

  if (!conceptKey) return null;

  return (
    <View style={styles.conceptInlineBox}>
      <View style={styles.conceptHeaderRow}>
        <Text style={styles.conceptSectionTitle}>Concept</Text>
        <TouchableOpacity onPress={onClose} hitSlop={8}>
          <Text style={styles.conceptClose}>Close</Text>
        </TouchableOpacity>
      </View>

      {isConceptLoading ? (
        <ActivityIndicator
          size="small"
          color={Colors.accent}
          style={{ marginTop: 10 }}
        />
      ) : conceptError ? (
        <Text style={styles.conceptError}>Could not load concept.</Text>
      ) : concept ? (
        <View style={styles.conceptBody}>
          <Text style={styles.conceptTitle}>{concept.title}</Text>
          <Text style={styles.conceptExplanation}>{concept.explanation}</Text>
          {concept.example ? (
            <Text style={styles.conceptExample}>Example: {concept.example}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function SolutionScreen() {
  const router = useRouter();
  const { query, marks } = useLocalSearchParams();
  const [selectedKey, setSelectedKey] = useState(null);

  const { mutate, data, isPending, isError, error: solverError } = useMathSolver();

  useEffect(() => {
    if (query && marks) {
      mutate({ query, marks });
    }
  }, [query, marks]);

  const toggleConcept = (key) => {
    if (!key) return;
    setSelectedKey((prev) => (prev === key ? null : key));
  };

  if (isPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>AI is calculating steps...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Oops! {solverError?.message || "Failed to solve"}
        </Text>
        <PrimaryButton title="Try Again" handlePress={() => router.back()} />
      </View>
    );
  }

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
            subtitle="Worked answer — show these steps in your exam."
            icon="lightbulb-on-outline"
          />

          {data && (
            <View style={styles.card}>
              <SectionCard label="Question" icon="help-circle-outline">
                <Text style={styles.bodyText}>{data.raw_question}</Text>
              </SectionCard>

              <View style={styles.sectionGap} />

              <SectionCard
                label="Step-by-step working"
                icon="format-list-numbered"
              >
                <Text style={styles.stepsHint}>
                  Tap a step with 💡 to see the concept right here.
                </Text>

                {data.steps?.map((step, index) => {
                  const isOpen =
                    step.concept_key && selectedKey === step.concept_key;

                  return (
                    <View key={index} style={styles.stepBlock}>
                      <TouchableOpacity
                        style={[
                          styles.stepContainer,
                          isOpen && styles.stepContainerActive,
                        ]}
                        onPress={() => toggleConcept(step.concept_key)}
                        activeOpacity={step.concept_key ? 0.7 : 1}
                        disabled={!step.concept_key}
                      >
                        <View style={styles.stepHeaderRow}>
                          <Text style={styles.stepHeader}>
                            Step {step.step_number}
                          </Text>
                          {step.concept_key ? (
                            <Text style={styles.viewConceptTag}>
                              {isOpen ? "Hide concept" : "💡 View concept"}
                            </Text>
                          ) : null}
                        </View>
                        <Text style={styles.stepDesc}>{step.description}</Text>
                        <View style={styles.expressionBox}>
                          <Text style={styles.expressionText}>
                            {step.expression}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {isOpen ? (
                        <StepConceptPanel
                          conceptKey={step.concept_key}
                          onClose={() => setSelectedKey(null)}
                        />
                      ) : null}
                    </View>
                  );
                })}
              </SectionCard>

              <View style={styles.sectionGap} />

              <SectionCard label="Teacher's commentary" icon="school-outline">
                <Text style={styles.bodyTextMuted}>{data.mark_commentary}</Text>
              </SectionCard>

              <LinearGradient
                colors={[Colors.primaryDark, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.answerStrip}
              >
                <Text style={styles.answerLabel}>Final answer</Text>
                <Text style={styles.answerValue}>{data.final_answer}</Text>
              </LinearGradient>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 22, paddingBottom: 36, paddingTop: 8 },
  card: { marginTop: 4 },
  sectionGap: { height: 14 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundEnd,
    padding: 20,
  },
  loadingText: { color: Colors.white, marginTop: 15, fontWeight: "600" },
  errorText: {
    color: Colors.danger,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  bodyText: { color: Colors.textPrimary, fontSize: 18, fontWeight: "700" },
  bodyTextMuted: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
  },
  stepsHint: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  stepBlock: { marginBottom: 4 },
  stepContainer: {
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: Colors.accent,
    paddingLeft: 15,
    paddingVertical: 4,
  },
  stepContainerActive: {
    borderLeftColor: Colors.primary,
  },
  stepHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  stepHeader: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  stepDesc: { color: Colors.textSecondary, fontSize: 14, marginBottom: 8 },
  expressionBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 10,
  },
  expressionText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  answerStrip: { marginTop: 20, borderRadius: 18, padding: 18 },
  answerLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  answerValue: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
  },
  conceptInlineBox: {
    marginLeft: 15,
    marginBottom: 16,
    marginTop: 4,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(79, 209, 197, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  conceptHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  conceptSectionTitle: {
    color: Colors.accent,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  conceptClose: { color: Colors.danger, fontWeight: "700", fontSize: 13 },
  conceptBody: { marginTop: 4 },
  conceptTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  conceptExplanation: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  conceptExample: {
    color: Colors.accent,
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 8,
  },
  conceptError: { color: Colors.danger, fontSize: 13, marginTop: 8 },
  viewConceptTag: { color: Colors.accent, fontSize: 11, fontWeight: "700" },
});
