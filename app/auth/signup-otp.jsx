import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/auth/InputField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import Colors from "../../constants/Colors";
import { clearPendingSignup, getPendingSignup } from "../../lib/pendingSignup";
import { saveProfile } from "../../lib/storage";
import { useSignup } from "../../src/hooks/useSignup.js";

export default function SignupOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const emailParam = typeof params.email === "string" ? params.email : params.email?.[0] || "";

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [serverError, setServerError] = useState("");

  const { mutate, isPending } = useSignup();

  useEffect(() => {
    const pending = getPendingSignup();
    if (!pending?.email || !pending?.password) {
      router.replace("/auth/signup");
    }
  }, [router]);

  const handleVerifyAndCreate = () => {
    setServerError("");
    setOtpError("");

    const pending = getPendingSignup();
    if (!pending?.email || !pending?.password) {
      router.replace("/auth/signup");
      return;
    }

    const otpRegex = /^\d{6}$/;
    if (!otp) {
      setOtpError("OTP is required.");
      return;
    }
    if (!otpRegex.test(otp)) {
      setOtpError("Enter the 6-digit code from your email.");
      return;
    }

    mutate(
      {
        firstName: pending.firstName,
        lastName: pending.lastName,
        email: pending.email,
        password: pending.password,
      },
      {
        onSuccess: async () => {
          const fullName = `${pending.firstName} ${pending.lastName}`.trim();
          await saveProfile({ displayName: fullName, email: pending.email });
          clearPendingSignup();
          router.replace({
            pathname: "/onboarding",
            params: { authMessage: `${pending.firstName} signup successful` },
          });
        },
        onError: (err) => {
          const errorMsg = err.response?.data?.message || "Signup failed. Try again!";
          setServerError(errorMsg);
        },
      },
    );
  };

  const handleResend = () => {
    Alert.alert(
      "Resend code",
      "When your backend sends signup OTP to email, this button will call that API. For now this is UI only.",
    );
  };

  const handleBack = () => {
    clearPendingSignup();
    router.back();
  };

  const displayEmail = emailParam || getPendingSignup()?.email || "";

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
          >
            <Pressable onPress={handleBack} className="mb-4">
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </Pressable>

            <View className="items-center mb-6">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(79, 209, 197, 0.15)" }}
              >
                <Ionicons name="mail-outline" size={32} color={Colors.accent} />
              </View>
              <Text className="text-2xl font-bold text-center" style={{ color: Colors.accent }}>
                Check your email
              </Text>
              <Text
                className="text-base text-center mt-2 px-2 leading-6"
                style={{ color: Colors.textSecondary }}
              >
                We sent a 6-digit code to{" "}
                <Text style={{ color: Colors.white, fontWeight: "700" }}>{displayEmail}</Text>.
                Enter it below to finish creating your account.
              </Text>
            </View>

            <View
              className="p-5 rounded-3xl"
              style={{
                backgroundColor: Colors.surface,
                borderWidth: 1,
                borderColor: Colors.cardBorder,
              }}
            >
              <InputField
                label="Verification code"
                placeholder="000000"
                value={otp}
                onChangeText={(t) => {
                  const digits = t.replace(/\D/g, "").slice(0, 6);
                  setOtp(digits);
                  setOtpError("");
                }}
                keyboardType="number-pad"
                maxLength={6}
                error={otpError}
              />

              {serverError ? (
                <Text style={{ color: Colors.danger, fontWeight: "700", marginBottom: 10 }}>
                  {serverError}
                </Text>
              ) : null}

              <PrimaryButton
                title={isPending ? "Creating account..." : "Verify & create account"}
                handlePress={handleVerifyAndCreate}
                disabled={isPending}
              />

              {isPending ? (
                <ActivityIndicator color={Colors.accent} size="small" className="mt-4" />
              ) : null}

              <Pressable onPress={handleResend} className="mt-6 items-center py-2">
                <Text style={{ color: Colors.primary, fontWeight: "600" }}>Resend code</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
