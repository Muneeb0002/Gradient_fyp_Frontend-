import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react"; // 1. useState add kiya
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"; // TouchableOpacity add kiya
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";
import { useConcept } from "../../src/hooks/useConceptKey.js";
import { useMathSolver } from "../../src/hooks/useMathSolver";

export default function SolutionScreen() {
  const router = useRouter();
  const { query, marks } = useLocalSearchParams();
  
  // State jo track karegi ke user ne kis step ke concept par click kiya hai
  const [selectedKey, setSelectedKey] = useState(null);

  // Math Solver API Hook
  const { mutate, data, isPending, isError, error: solverError } = useMathSolver();
  
  // Concept API Hook (Yeh tabhi chalega jab selectedKey mein value aayegi)
  // Naming conflict se bachne ke liye error ko 'conceptError' ka naam de diya
  const { data: concept, isLoading: isConceptLoading, error: conceptError } = useConcept(selectedKey);

  useEffect(() => {
    if (query && marks) {
      mutate({ query, marks });
    }
  }, [query, marks]);

  // Loading View
  if (isPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>AI is calculating steps...</Text>
      </View>
    );
  }

  // Error View
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Oops! {solverError?.message || "Failed to solve"}</Text>
        <PrimaryButton title="Try Again" handlePress={() => router.back()} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <ScreenHeader
            onBack={() => router.back()}
            title="Solution"
            subtitle="Worked answer — show these steps in your exam working."
            icon="lightbulb-on-outline"
          />

          {data && (
            <View style={styles.card}>
              <SectionCard label="Question" icon="help-circle-outline">
                <Text style={styles.bodyText}>{data.raw_question}</Text>
              </SectionCard>

              <View style={styles.sectionGap} />

              {/* CONCEPT POPUP / DETAILS (Agar koi key selected ho to yahan dikhao) */}
              {selectedKey && (
                <View style={styles.conceptModalBox}>
                  <View style={styles.conceptHeaderRow}>
                    <Text style={styles.conceptSectionTitle}>Concept Explanation</Text>
                    <TouchableOpacity onPress={() => setSelectedKey(null)}>
                      <Text style={{ color: Colors.danger, fontWeight: 'bold' }}>Close X</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {isConceptLoading ? (
                    <ActivityIndicator size="small" color={Colors.accent} />
                  ) : conceptError ? (
                    <Text style={{ color: Colors.danger }}>Error loading concept details.</Text>
                  ) : concept ? (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.conceptTitle}>{concept.title}</Text>
                      <Text style={styles.conceptExplanation}>{concept.explanation}</Text>
                      {concept.example && (
                        <Text style={styles.conceptExample}>Example: {concept.example}</Text>
                      )}
                    </View>
                  ) : null}
                </View>
              )}

              {selectedKey && <View style={styles.sectionGap} />}

              <SectionCard label="Step-by-Step Working (Click any step to learn concept)" icon="format-list-numbered">
                {data.steps?.map((step, index) => (
                  // Har step ko TouchableOpacity bana diya taake click ho sake
                  <TouchableOpacity 
                    key={index} 
                    style={styles.stepContainer}
                    onPress={() => {
                      if (step.concept_key) {
                        setSelectedKey(step.concept_key); // State update hogi, concept_key pass ho gayi!
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexRow: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.stepHeader}>Step {step.step_number}</Text>
                      {step.concept_key && (
                        <Text style={styles.viewConceptTag}>💡 View Concept</Text>
                      )}
                    </View>
                    <Text style={styles.stepDesc}>{step.description}</Text>
                    <View style={styles.expressionBox}>
                      <Text style={styles.expressionText}>{step.expression}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </SectionCard>

              <View style={styles.sectionGap} />

              <SectionCard label="Teacher's Commentary" icon="school-outline">
                <Text style={styles.bodyTextMuted}>{data.mark_commentary}</Text>
              </SectionCard>

              <LinearGradient
                colors={[Colors.primaryDark, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.answerStrip}
              >
                <Text style={styles.answerLabel}>Final Answer</Text>
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.backgroundEnd, padding: 20 },
  loadingText: { color: Colors.white, marginTop: 15, fontWeight: '600' },
  errorText: { color: Colors.danger, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  bodyText: { color: Colors.textPrimary, fontSize: 18, fontWeight: "700" },
  bodyTextMuted: { color: Colors.textSecondary, fontSize: 15, lineHeight: 24, fontWeight: "600" },
  stepContainer: { marginBottom: 20, borderLeftWidth: 2, borderLeftColor: Colors.accent, paddingLeft: 15 },
  stepHeader: { color: Colors.accent, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
  stepDesc: { color: Colors.textSecondary, fontSize: 14, marginBottom: 8 },
  expressionBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 10 },
  expressionText: { color: Colors.white, fontSize: 17, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  answerStrip: { marginTop: 20, borderRadius: 18, padding: 18 },
  answerLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  answerValue: { color: Colors.white, fontSize: 20, fontWeight: "800", marginTop: 8 },
  
  // Naye Styles Concept Box Ke Liye
  conceptModalBox: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 16, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  conceptHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 6 },
  conceptSectionTitle: { color: Colors.accent, fontWeight: '800', fontSize: 14, textTransform: 'uppercase' },
  conceptTitle: { color: Colors.white, fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  conceptExplanation: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
  conceptExample: { color: Colors.accent, fontSize: 13, fontStyle: 'italic', marginTop: 8 },
  viewConceptTag: { color: Colors.accent, fontSize: 11, fontWeight: 'bold' }
});