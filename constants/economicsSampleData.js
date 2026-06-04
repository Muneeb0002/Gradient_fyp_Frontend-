export const SAMPLE_MCQ_QUESTION =
  "Which term describes the loss of potential benefit to a consumer when making a choice between alternatives?\n\nA) Opportunity cost\nB) Scarcity\nC) Shortage\nD) The economic problem";

export const SAMPLE_MCQ_RESULT = {
  correct_option: "A",
  rationale:
    "The term that describes the loss of potential benefit to a consumer when making a choice between alternatives is opportunity cost. It refers to the value of the next best alternative that is given up as a result of making a decision.",
  why_others_wrong: [
    "B is wrong because scarcity refers to unlimited wants versus limited resources.",
    "C is wrong because shortage means quantity demanded exceeds quantity supplied at a given price.",
    "D is wrong because the economic problem is the broad issue of allocating scarce resources, not the specific cost of one choice.",
  ],
  concept: "Opportunity Cost",
  examiner_tip:
    "Be precise with definitions. Opportunity cost is the value of the next best alternative foregone when a decision is made.",
  difficulty: "Easy",
};

export function normalizeWhyOthersWrong(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}
