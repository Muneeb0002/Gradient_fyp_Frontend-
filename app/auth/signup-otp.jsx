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
import { useVerifyOtp } from "../../src/hooks/useVerifyOtp.js";

export default function SignupOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const emailParam = typeof params.email === "string" ? params.email : params.email?.[0] || "";

  // SIRF verify hook use karein, signup hook ki yahan zaroorat nahi
  const { mutate: verifyMutate, isPending } = useVerifyOtp();
  
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const pending = getPendingSignup();
    if (!pending?.email) {
      router.replace("/auth/signup");
    }
  }, [router]);

  const handleVerifyAndCreate = () => {
    setServerError("");
    setOtpError("");

    const pending = getPendingSignup();
    if (!pending?.email) {
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

    // Ab mutate function call karein verification ke liye
    verifyMutate(
      {
        email: pending.email, // Backend expects email and otp
        otp: otp,
      },
      {
        onSuccess: async (data) => {
          // data.user humein backend se mil raha hai (Success Body check karein)
          const fullName = `${data.user.firstName} ${data.user.lastName}`.trim();
          
          await saveProfile({ displayName: fullName, email: data.user.email });
          clearPendingSignup();
          
          // Redirect to onboarding
          router.replace({
            pathname: "/onboarding",
            params: { authMessage: `Welcome ${data.user.firstName}!` },
          });
        },
        onError: (err) => {
          const errorMsg = err.response?.data?.message || "Invalid OTP. Please try again.";
          setServerError(errorMsg);
        },
      }
    );
  };

  const handleResend = () => {
    Alert.alert("Resend code", "OTP resent to your email.");
    // Yahan aap resend API call kar sakte hain future mein
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
                editable={!isPending}
              />

              {serverError ? (
                <Text style={{ color: Colors.danger, fontWeight: "700", marginBottom: 10, textAlign: 'center' }}>
                  {serverError}
                </Text>
              ) : null}

              <PrimaryButton
                title={isPending ? "Verifying..." : "Verify & create account"}
                handlePress={handleVerifyAndCreate}
                disabled={isPending}
              />

              {isPending && <ActivityIndicator color={Colors.accent} size="small" className="mt-4" />}

              <Pressable onPress={handleResend} className="mt-6 items-center py-2" disabled={isPending}>
                <Text style={{ color: Colors.primary, fontWeight: "600" }}>Resend code</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}