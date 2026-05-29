/** Makes OCR / LaTeX-style question text readable in React Native Text. */
export function formatRawQuestion(text) {
  if (!text) return "";

  return text
    .replace(/\$/g, "")
    .replace(/\\sin/g, "sin")
    .replace(/\\cos/g, "cos")
    .replace(/\\tan/g, "tan")
    .replace(/\\sqrt\{([^}]+)\}/g, "√$1")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1/$2")
    .replace(/\^\\circ/g, "°")
    .replace(/\\circ/g, "°")
    .replace(/\\,/g, " ")
    .replace(/\\left|\\right/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
