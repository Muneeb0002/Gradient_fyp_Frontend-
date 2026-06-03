import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ADMIN_PROFILE } from "../../constants/adminPortalData";
import { getPortalProfile } from "../../lib/portalSession";

export default function usePortalProfile(fallback = ADMIN_PROFILE) {
  const [profile, setProfile] = useState(fallback);

  useFocusEffect(
    useCallback(() => {
      getPortalProfile().then((stored) => {
        if (stored) setProfile({ ...fallback, ...stored });
      });
    }, [fallback]),
  );

  return profile;
}
