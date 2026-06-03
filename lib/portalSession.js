import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "@gradiant/portal_profile";

export async function savePortalProfile(profile) {
  if (!profile) return;
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function getPortalProfile() {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearPortalProfile() {
  await AsyncStorage.removeItem(PROFILE_KEY);
}
