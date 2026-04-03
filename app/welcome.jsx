import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../components/shared/AppDecor";
import GoogleButton from "../components/auth/GoogleButton";
import PrimaryButton from "../components/auth/PrimaryButton";
import SecondaryButton from "../components/auth/SecondaryButton";
import Colors from "../constants/Colors";

export default function WelcomeScreen() {
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
      <SafeAreaView className="flex-1 justify-between px-6 py-10">
        <View className="items-center mt-4">
          <Image
            source={require("../assets/images/logo.png")}
            className="w-48 h-48"
            resizeMode="contain"
          />

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            className="text-2xl font-bold text-center mt-2 w-full"
            style={{ color: Colors.accent }}
          >
            Smarter Answers, Better Grades
          </Text>

          <Text
            className="text-base text-center mt-3 px-6"
            style={{ color: Colors.textSecondary }}
          >
            AI-Powered Exam Intelligence
          </Text>

          <View className="flex-row justify-center gap-3 mt-8 flex-wrap px-2">
            {[
              { icon: "school-outline", label: "O Level" },
              { icon: "trophy-outline", label: "Exam-style" },
              { icon: "lightning-bolt-outline", label: "Fast help" },
            ].map((item) => (
              <View
                key={item.label}
                className="flex-row items-center gap-2 px-3 py-2 rounded-full"
                style={{
                  backgroundColor: Colors.surfaceAlt,
                  borderWidth: 1,
                  borderColor: Colors.cardBorder,
                }}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={18}
                  color={Colors.accent}
                />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: Colors.textSecondary }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          className="mb-4 p-5 rounded-3xl"
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
          }}
        >
          <PrimaryButton
            title="Login"
            handlePress={() => router.push("/auth/login")}
          />

          <SecondaryButton
            title="Sign Up"
            handlePress={() => router.push("/auth/signup")}
          />

          <Text
            className="text-center my-4 text-sm"
            style={{ color: Colors.textMuted }}
          >
            or
          </Text>

          <GoogleButton handlePress={() => router.push("/auth/google-auth")} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
