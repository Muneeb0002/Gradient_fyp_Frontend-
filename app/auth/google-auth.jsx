import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import GoogleButton from "../../components/auth/GoogleButton";
import PrimaryButton from "../../components/auth/PrimaryButton";
import Colors from "../../constants/Colors";

const perks = [
  {
    icon: "shield-check-outline",
    title: "Secure sign-in",
    subtitle:
      "Google OAuth — we never store your password on our servers (demo flow).",
  },
  {
    icon: "lightning-bolt-outline",
    title: "One-tap access",
    subtitle:
      "Create your session fast and jump straight into the dashboard.",
  },
  {
    icon: "book-open-variant",
    title: "O Level ready",
    subtitle:
      "Maths, History, Geography & Economics — one streamlined study flow.",
  },
];

export default function GoogleAuthScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => router.back()} className="mb-4 mt-2">
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.white}
            />
          </Pressable>

          <View className="items-center mb-6">
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-28 h-28"
              resizeMode="contain"
            />
            <Text
              className="text-2xl font-bold mt-4 text-center"
              style={{ color: Colors.accent }}
            >
              Sign in with Google
            </Text>
            <Text
              className="text-center mt-2 text-base px-2"
              style={{ color: Colors.textSecondary }}
            >
              Professional sign-in for your Cambridge O Level study sessions.
            </Text>
          </View>

          <View
            className="rounded-3xl p-5 mb-6"
            style={{
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
            }}
          >
            {perks.map((p, i) => (
              <View
                key={p.title}
                className="flex-row gap-4"
                style={{ marginBottom: i < perks.length - 1 ? 20 : 0 }}
              >
                <View
                  className="w-11 h-11 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: Colors.surfaceAlt }}
                >
                  <MaterialCommunityIcons
                    name={p.icon}
                    size={24}
                    color={Colors.accent}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-bold text-base"
                    style={{ color: Colors.white }}
                  >
                    {p.title}
                  </Text>
                  <Text
                    className="text-sm mt-1 leading-5"
                    style={{ color: Colors.textSecondary }}
                  >
                    {p.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mb-3">
            <GoogleButton
              handlePress={() => router.replace("/dashboard")}
            />
          </View>

          <PrimaryButton
            title="Use email instead"
            handlePress={() => router.push("/auth/login")}
          />

          <Text
            className="text-center text-xs mt-4 px-2 leading-5"
            style={{ color: Colors.textMuted }}
          >
            By continuing you agree to our terms for demo / FYP use. Google is a
            trademark of Google LLC.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
