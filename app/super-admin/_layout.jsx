import { Stack } from "expo-router";
import { PortalAdminsProvider } from "../../src/context/PortalAdminsContext";

export default function SuperAdminLayout() {
  return (
    <PortalAdminsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PortalAdminsProvider>
  );
}
