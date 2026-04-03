import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: "@gradiant/onboarding_complete",
  PROFILE: "@gradiant/profile",
};

const defaultProfile = () => ({
  displayName: "Abdullah Rana",
  email: "",
  password: "",
  /** Local file URI from expo-image-picker, or empty to use app logo. */
  photoUri: "",
});

export async function getProfile() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!raw) return defaultProfile();
  try {
    const parsed = JSON.parse(raw);
    return { ...defaultProfile(), ...parsed };
  } catch {
    return defaultProfile();
  }
}

export async function saveProfile(updates) {
  const current = await getProfile();
  await AsyncStorage.setItem(
    STORAGE_KEYS.PROFILE,
    JSON.stringify({ ...current, ...updates })
  );
}

export async function setOnboardingComplete() {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, "true");
}

export async function getOnboardingComplete() {
  const v = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return v === "true";
}
