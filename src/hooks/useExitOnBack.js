import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { BackHandler } from "react-native";

/** Home / dashboard: hardware back → exit confirm (does not logout). */
export default function useExitOnBack(enabled = true) {
  const [exitVisible, setExitVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return undefined;

      const onBack = () => {
        setExitVisible(true);
        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [enabled]),
  );

  const confirmExit = () => {
    setExitVisible(false);
    BackHandler.exitApp();
  };

  return {
    exitVisible,
    setExitVisible,
    confirmExit,
  };
}
