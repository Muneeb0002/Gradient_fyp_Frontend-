import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import InputField from "../../components/auth/InputField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import Colors from "../../constants/Colors";
import { useResetPassword } from "../../src/hooks/useResetPassword";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [formData, setFormData] = useState({
    email: params.email || "",
    otp: "",
    newPassword: "",
  });

  const { mutate, isPending } = useResetPassword();
  const [errors, setErrors] = useState({ email: "", otp: "", newPassword: "" });
  const [serverError, setServerError] = useState("");

  const handleResetAction = () => {
    const { email, otp, newPassword } = formData;

    setServerError("");

    const nextErrors = { email: "", otp: "", newPassword: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const otpRegex = /^\d{6}$/;
    const specialCharRegex = /[ #@$!%*?&]/;

    if (!email) nextErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email address.";

    if (!otp) nextErrors.otp = "OTP is required.";
    else if (!otpRegex.test(otp)) nextErrors.otp = "OTP must be 6 digits.";

    if (!newPassword) nextErrors.newPassword = "New password is required.";
    else if (newPassword.length < 8) nextErrors.newPassword = "Minimum 8 characters required.";
    else if (!specialCharRegex.test(newPassword))
      nextErrors.newPassword = "Add a special character (@$!%*?&).";

    if (nextErrors.email || nextErrors.otp || nextErrors.newPassword) {
      setErrors(nextErrors);
      return;
    }

    setErrors({ email: "", otp: "", newPassword: "" });

    mutate(formData, {
      onSuccess: (data) => {
        router.replace({
          pathname: "/auth/login",
          params: {
            authMessage: data?.message || "OTP verification successful",
          },
        });
      },
      onError: (err) => {
        const errorMsg = err.response?.data?.message || "Password reset failed.";
        setServerError(errorMsg);
      }
    });
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
          >

            <Pressable onPress={() => router.back()} className="mb-4">
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </Pressable>

            <Text className="text-2xl font-bold mb-2" style={{ color: Colors.accent }}>
              Reset Password
            </Text>

            <Text className="text-base mb-6" style={{ color: Colors.textSecondary }}>
              Enter your registered email, received OTP and set a new password.
            </Text>

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
                placeholder="youremail@example.com"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  setErrors((e) => ({ ...e, email: "" }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <InputField
                label="OTP Code"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChangeText={(text) => {
                  setFormData({ ...formData, otp: text });
                  setErrors((e) => ({ ...e, otp: "" }));
                }}
                keyboardType="number-pad"
                error={errors.otp}
              />

              <InputField
                label="New Password"
                placeholder="Enter new password"
                secureTextEntry
                value={formData.newPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, newPassword: text });
                  setErrors((e) => ({ ...e, newPassword: "" }));
                }}
                error={errors.newPassword}
              />

              {serverError ? (
                <Text style={{ color: Colors.danger, fontWeight: "700", marginTop: 8, marginBottom: 8 }}>
                  {serverError}
                </Text>
              ) : null}

              <View className="mt-6">
                <PrimaryButton
                  title={isPending ? "Updating..." : "Update Password"}
                  handlePress={handleResetAction}
                  disabled={isPending}
                />
              </View>

              {isPending && (
                <ActivityIndicator color={Colors.accent} size="small" className="mt-4" />
              )}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}