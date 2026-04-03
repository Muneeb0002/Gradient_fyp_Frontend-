import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import OnboardingCarousel from "../components/onboarding/OnboardingCarousel";
import { useLocalSearchParams } from "expo-router";
import Colors from "../constants/Colors";

export default function OnboardingScreen() {
  const params = useLocalSearchParams();
  const authMessage = params?.authMessage;
  const [showBanner, setShowBanner] = useState(Boolean(authMessage));

  useEffect(() => {
    setShowBanner(Boolean(authMessage));
    if (!authMessage) return;
    const timer = setTimeout(() => setShowBanner(false), 2600);
    return () => clearTimeout(timer);
  }, [authMessage]);

  return (
    <View style={{ flex: 1 }}>
      <OnboardingCarousel />
      {showBanner ? (
        <View
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            right: 18,
            padding: 14,
            borderRadius: 20,
            backgroundColor: "rgba(79, 209, 197, 0.12)",
            borderWidth: 1,
            borderColor: "rgba(79, 209, 197, 0.35)",
          }}
        >
          <Text style={{ color: Colors.accent, fontWeight: "800" }}>
            {authMessage}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
