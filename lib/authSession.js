import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearPortalProfile } from "./portalSession";

export const AUTH_KEYS = {
  ROLE: "@gradiant/auth_role",
  TOKEN: "token",
};

export async function saveAuthSession({ role, token }) {
  if (role) await AsyncStorage.setItem(AUTH_KEYS.ROLE, role);
  if (token) await AsyncStorage.setItem(AUTH_KEYS.TOKEN, token);
}

export async function getAuthRole() {
  return AsyncStorage.getItem(AUTH_KEYS.ROLE);
}

export async function clearAuthSession() {
  await AsyncStorage.multiRemove([AUTH_KEYS.ROLE, AUTH_KEYS.TOKEN]);
  await clearPortalProfile();
}
