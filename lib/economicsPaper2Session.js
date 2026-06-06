import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY_A = "@gradiant/economics_paper2_A";
const SESSION_KEY_B = "@gradiant/economics_paper2_B";

export async function savePaper2Session({
  section,
  inputMode,
  query,
  imageUris,
  apiResult,
}) {
  const key = section === "A" ? SESSION_KEY_A : SESSION_KEY_B;

  await AsyncStorage.setItem(
    key,
    JSON.stringify({
      section,
      inputMode,
      query: query ?? "",
      imageUris: Array.isArray(imageUris) ? imageUris : [],
      apiResult: apiResult ?? null,
    })
  );
}

export async function getPaper2Session(section = "A") {
  const key = section === "A" ? SESSION_KEY_A : SESSION_KEY_B;

  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearPaper2Session(section) {
  // If section specified, clear only that one. Otherwise clear both.
  if (section === "A") {
    await AsyncStorage.removeItem(SESSION_KEY_A);
  } else if (section === "B") {
    await AsyncStorage.removeItem(SESSION_KEY_B);
  } else {
    await AsyncStorage.multiRemove([SESSION_KEY_A, SESSION_KEY_B]);
  }
}