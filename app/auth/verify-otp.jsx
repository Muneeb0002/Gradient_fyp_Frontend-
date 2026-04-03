import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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

  const handleResetAction = () => {
    const { email, otp, newPassword } = formData;

    if (!email || !otp || !newPassword) {
      Alert.alert("Missing Fields", "All Fields are mandatory!");
      return;
    }

    if (otp.length < 4) {
      Alert.alert("Invalid OTP", "OTP must be 6 digits.");
      return;
    }

    const specialCharRegex = /[ #@$!%*?&]/;

    if (newPassword.length < 8) {
      Alert.alert("Short Password", "Min. 8 chars pasword are required.");
      return;
    }

    if (!specialCharRegex.test(newPassword)) {
      Alert.alert("Weak Password", " special character (@$!%*?&) is mandatory in the password.");
      return;
    }


    mutate(formData, {
      onSuccess: (data) => {
        Alert.alert(
          "Success",
          data?.message || "Password reset ho gaya! Ab login karein.",
          [{ text: "OK", onPress: () => router.replace("/auth/login") }]
        );
      },
      onError: (err) => {
        const errorMsg = err.response?.data?.message || "Password reset failed.";
        Alert.alert("Error", errorMsg);
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
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                label="OTP Code"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChangeText={(text) => setFormData({ ...formData, otp: text })}
                keyboardType="number-pad"
              />

              <InputField
                label="New Password"
                placeholder="Enter new password"
                secureTextEntry
                value={formData.newPassword}
                onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
              />

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