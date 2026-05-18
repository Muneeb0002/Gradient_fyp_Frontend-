/**
 * Safe text for React Native <Text> — avoids raw < > breaking layout / looking broken.
 */
export function sanitizeDisplayText(text) {
  if (text == null) return "";
  return String(text)
    .replace(/&lt;/gi, "⟨")
    .replace(/&gt;/gi, "⟩")
    .replace(/</g, "⟨")
    .replace(/>/g, "⟩");
}
