import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import { MOCK_MATH_CONCEPTS } from "../../src/mocks/mathImageSolution.mock";

function ConceptPanel({ conceptKey, onClose }) {
  const concept = MOCK_MATH_CONCEPTS[conceptKey];

  if (!concept) {
    return (
      <View style={styles.conceptBox}>
        <Text style={styles.conceptError}>Could not load this concept.</Text>
        <TouchableOpacity onPress={onClose} hitSlop={8}>
          <Text style={styles.conceptClose}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.conceptBox}>
      <View style={styles.conceptHeaderRow}>
        <Text style={styles.conceptSectionTitle}>Concept</Text>
        <TouchableOpacity onPress={onClose} hitSlop={8}>
          <Text style={styles.conceptClose}>Close</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.conceptTitle}>{concept.title}</Text>
      <Text style={styles.conceptExplanation}>{concept.explanation}</Text>
      {concept.example ? (
        <Text style={styles.conceptExample}>Example: {concept.example}</Text>
      ) : null}
    </View>
  );
}

export default function MathImageStepList({ steps = [] }) {
  const [openStepIndex, setOpenStepIndex] = useState(null);

  const toggleConcept = (index, key) => {
    if (!key) return;
    setOpenStepIndex((prev) => (prev === index ? null : index));
  };

  return (
    <View>
      <Text style={styles.stepsHint}>
        Tap a step with 💡 to see the concept right here.
      </Text>
      {steps.map((step, index) => {
        const isOpen = openStepIndex === index;

        return (
          <View key={`${step.step_number}-${index}`} style={styles.stepBlock}>
            <TouchableOpacity
              style={[styles.stepContainer, isOpen && styles.stepContainerActive]}
              onPress={() => toggleConcept(index, step.concept_key)}
              activeOpacity={step.concept_key ? 0.7 : 1}
              disabled={!step.concept_key}
            >
              <View style={styles.stepHeaderRow}>
                <Text style={styles.stepHeader}>Step {step.step_number}</Text>
                {step.concept_key ? (
                  <Text style={styles.viewConceptTag}>
                    {isOpen ? "Hide concept" : "💡 View concept"}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.stepDesc}>{step.description}</Text>
              <View style={styles.expressionBox}>
                <Text style={styles.expressionText}>{step.expression}</Text>
              </View>
            </TouchableOpacity>

            {isOpen && step.concept_key ? (
              <ConceptPanel
                conceptKey={step.concept_key}
                onClose={() => setOpenStepIndex(null)}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
  stepContainerActive: { borderLeftColor: Colors.primary },
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
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  viewConceptTag: { color: Colors.accent, fontSize: 11, fontWeight: "700" },
  conceptBox: {
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
  conceptError: { color: Colors.danger, fontSize: 13 },
});
