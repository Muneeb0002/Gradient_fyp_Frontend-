export function getApiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;
  const msg =
    data?.message ??
    data?.error ??
    (typeof data === "string" ? data : null) ??
    err?.message;

  if (typeof msg === "string" && msg.trim()) {
    return msg.trim();
  }
  return fallback;
}
