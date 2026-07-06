import { StyleSheet, Text } from "react-native";
import Colors from "../../constants/Colors";
import { splitAnswerParagraphs } from "../../lib/chatHistoryUtils";
import { sanitizeDisplayText } from "../../lib/displayText";

import MapAnswerView, { hasGeoData } from "./MapAnswerView.js";

import EconomicsPartsView from "./EconomicsPartsView.js";
import EconomicsMCQView from "./Economicsmcqview.js";
import MathStepsView from "./MathStepsView.js";


function hasSteps(response) {
  return Array.isArray(response?.steps) && response.steps.length > 0;
}

function hasParts(response) {
  return (
    Array.isArray(response?.detected_parts) &&
    response.detected_parts.length > 0
  );
}

function hasMCQ(response) {
  return response?.correct_option != null;
}

export default function AnswerRenderer({ chat }) {
  const response = chat.response;

  // Map data can appear on geography OR history mode responses - always check first
  if (hasGeoData(response)) {
    return <MapAnswerView response={response} />;
  }

  if (hasMCQ(response)) {
    return <EconomicsMCQView response={response} />;
  }

  if (hasParts(response)) {
    return <EconomicsPartsView response={response} />;
  }

  if (hasSteps(response)) {
    return <MathStepsView response={response} />;
  }

  // Fallback: plain answer text (no structured response)
  const paragraphs = splitAnswerParagraphs(chat.answer);
  return paragraphs.map((para, i) => (
    <Text key={`p-${i}`} style={styles.assistantText}>
      {sanitizeDisplayText(para)}
    </Text>
  ));
}

const styles = StyleSheet.create({
  assistantText: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 10,
  },
});