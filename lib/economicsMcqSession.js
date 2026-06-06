import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "@gradiant/economics_mcq_session";

export async function saveMcqSession({ question, mode, imageUri, apiResult }) {
  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      question: question ?? "",
      mode: mode ?? "text",
      imageUri: imageUri ?? "",
      apiResult: apiResult ?? null, // Storing dynamic API response securely
    }),
  );
}

export async function getMcqSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearMcqSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}