import { sanitizeDisplayText } from "./displayText";

/** Parse AI / API explanation into [1]–[4] syllabus blocks */
export function parseGeoSyllabusSections(explanationText) {
  if (!explanationText) return [];

  const text = sanitizeDisplayText(explanationText);

  if (text.includes("###")) {
    return text
      .split("###")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part, index) => {
        const headingMatch = part.match(
          /^\s*(\[\d+\]\s+[^:\n]+)(?::|\n|$)/,
        );
        if (headingMatch) {
          const heading = headingMatch[1].trim();
          const body = part.replace(headingMatch[0], "").trim();
          return {
            number: heading.match(/\d+/)?.[0] || String(index + 1),
            heading: heading.replace(/^\[\d+\]\s*/, ""),
            body,
          };
        }
        return {
          number: String(index + 1),
          heading: "Overview",
          body: part,
        };
      });
  }

  const sections = [];
  const parts = text.split(/\[(\d+)\]/);
  for (let i = 0; i < parts.length; i++) {
    if (!/^\d+$/.test(parts[i])) continue;
    const number = parts[i];
    const content = (parts[i + 1] || "").trim();
    if (!content) continue;
    const lines = content.split("\n");
    const firstLine = lines[0]?.trim() || "";
    const hasHeading = firstLine.endsWith(":") || firstLine.length < 60;
    const heading = hasHeading
      ? firstLine.replace(/:$/, "")
      : `Section ${number}`;
    const body = hasHeading ? lines.slice(1).join("\n").trim() : content;
    sections.push({ number, heading, body });
  }

  return sections;
}
