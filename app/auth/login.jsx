import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleButton from "../../components/auth/GoogleButton";
import InputField from "../../components/auth/InputField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import Colors from "../../constants/Colors";
import { getProfile } from "../../lib/storage";
import { useLogin } from "../../src/hooks/useLogin.js";

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const authMessage = params?.authMessage;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutate, isPending } = useLogin();
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");

  const handleLogin = () => {
    const { email, password } = formData;

    setServerError("");

    const nextErrors = { email: "", password: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[ #@$!%*?&]/;

    if (!email) nextErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email address.";

    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 6) nextErrors.password = "Minimum 6 characters required.";
    else if (!specialCharRegex.test(password))
      nextErrors.password = "Add a special character (@$!%*?&).";

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setErrors({ email: "", password: "" });

    mutate(formData, {
      onSuccess: async (data) => {
        const apiFirstName =
          data?.user?.firstName ||
          data?.firstName ||
          data?.user?.name?.split?.(" ")?.[0] ||
          "";
        const profile = await getProfile();
        const fallbackFirstName = profile?.displayName?.split(" ")?.[0] || "User";
        const firstNameToShow = apiFirstName || fallbackFirstName;
        router.replace({
          pathname: "/dashboard",
          params: { authMessage: `${firstNameToShow} login successful` },
        });
      },
      onError: (err) => {
        const errorMsg = err.response?.data?.message || "Login failed. Try again!";
        setServerError(errorMsg);
      },
    });
  };

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
      <SafeAreaView className="flex-1 px-6 py-8">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>

        <View className="items-center mb-5">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />

          <Text
            className="text-xl font-bold text-center mt-2"
            style={{ color: Colors.accent }}
          >
            Welcome Back
          </Text>

          <Text
            className="text-base text-center mt-1"
            style={{ color: Colors.textSecondary }}
          >
            Login to continue your learning
          </Text>
        </View>

        {authMessage ? (
          <View
            className="p-4 rounded-3xl mb-4"
            style={{
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

        <View
          className="p-5 rounded-3xl"
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
          }}
        >
          <InputField
            label="Email Address"
            placeholder="your.email@example.com"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              setErrors((e) => ({ ...e, email: "" }));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            passwordToggle
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              setErrors((e) => ({ ...e, password: "" }));
            }}
            error={errors.password}
          />

          <Pressable
            className="items-end mb-6"
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text style={{ color: Colors.primary }}>Forgot password?</Text>
          </Pressable>

          {serverError ? (
            <Text style={{ color: Colors.danger, fontWeight: "700", marginBottom: 10 }}>
              {serverError}
            </Text>
          ) : null}

          <PrimaryButton
            title={isPending ? "Logging in..." : "Login"}
            handlePress={handleLogin}
            disabled={isPending}
          />

          {isPending && (
            <ActivityIndicator
              color={Colors.accent}
              className="mt-4"
              size="small"
            />
          )}

          <Text
            className="text-center my-4 text-sm"
            style={{ color: Colors.textMuted }}
          >
            or
          </Text>

          <GoogleButton handlePress={() => console.log("Google Login Triggered")} />

          <View className="flex-row justify-center mt-6">
            <Text style={{ color: Colors.textSecondary }}>
              Don&apos;t have an account?{" "}
            </Text>

            <Pressable onPress={() => router.push("/auth/signup")}>
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}