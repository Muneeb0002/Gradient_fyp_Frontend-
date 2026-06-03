import { CommonActions } from "@react-navigation/native";
import { saveAuthSession } from "./authSession";
import { savePortalProfile } from "./portalSession";
import { getProfile, saveProfile } from "./storage";

export async function persistPortalLogin(data, formEmail) {
  const role = data?.role ?? "user";
  await saveAuthSession({ role, token: data?.token });

  const user = data?.user;
  if (role === "admin" && user) {
    await savePortalProfile({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      joinedAt: user.joinedAt ?? "1 Jun 2025",
      role: "admin",
    });
  }
  if (role === "super-admin" && user) {
    await savePortalProfile({
      displayName: user.displayName ?? "Super Administrator",
      email: user.email ?? formEmail,
      role: "super-admin",
    });
  }

  const apiFirstName = user?.firstName || user?.displayName?.split?.(" ")?.[0] || "";
  const apiEmail = user?.email || formEmail || "";
  const profile = await getProfile();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.displayName ||
    profile?.displayName ||
    apiFirstName ||
    "User";

  await saveProfile({
    displayName: displayName.trim() || "User",
    email: apiEmail || profile?.email || "",
    photoUri: profile?.photoUri || "",
  });

  return role;
}

export function navigateAfterLogin(navigation, role, firstNameToShow) {
  if (role === "super-admin") {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "super-admin" }] }),
    );
    return;
  }
  if (role === "admin") {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "admin" }] }),
    );
    return;
  }
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: "(tabs)",
          params: { authMessage: `${firstNameToShow} login successful` },
        },
      ],
    }),
  );
}
