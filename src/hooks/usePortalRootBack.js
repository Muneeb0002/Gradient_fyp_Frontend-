import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BackHandler } from "react-native";

/**
 * On portal home screens: block hardware back from leaving to welcome/login.
 * User must use Sign out.
 */
export default function usePortalRootBack(blockExit = true) {
  useFocusEffect(
    useCallback(() => {
      if (!blockExit) return undefined;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
      return () => sub.remove();
    }, [blockExit]),
  );
}
