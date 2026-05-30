export function extractAiAnswer(response) {
  if (!response) return null;
  if (typeof response === "string") return response;
  return (
    response.answer ??
    response.explanation ??
    response.response ??
    response.data?.answer ??
    response.data?.explanation ??
    null
  );
}
