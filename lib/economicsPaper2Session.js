import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "@gradiant/economics_paper2_session";

export async function savePaper2Session({ section, inputMode, query, imageUris }) {
  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      section: section ?? "A",
      inputMode: inputMode ?? "image",
      query: query ?? "",
      imageUris: Array.isArray(imageUris) ? imageUris : [],
    }),
  );
}

export async function getPaper2Session() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearPaper2Session() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
