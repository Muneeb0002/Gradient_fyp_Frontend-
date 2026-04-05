import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react"; 
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import InputField from "../../components/auth/InputField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import Colors from "../../constants/Colors";
import { saveProfile } from "../../lib/storage";
import { useSignup } from "../../src/hooks/useSignup.js";

export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const authMessage = params?.authMessage;

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { mutate, isPending } = useSignup();
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");

  const handleSignup = () => {
  const { firstName, lastName, email, password } = formData;

    setServerError("");

    const nextErrors = { firstName: "", lastName: "", email: "", password: "" };
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[ #@$!%*?&]/;

    if (!firstName) nextErrors.firstName = "First name is required.";
    else if (!nameRegex.test(firstName)) nextErrors.firstName = "Only letters (A-Z) allowed.";
    else if (firstName.length < 2) nextErrors.firstName = "Minimum 2 characters required.";

    if (!lastName) nextErrors.lastName = "Last name is required.";
    else if (!nameRegex.test(lastName)) nextErrors.lastName = "Only letters (A-Z) allowed.";
    else if (lastName.length < 2) nextErrors.lastName = "Minimum 2 characters required.";

    if (!email) nextErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email address.";

    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 8) nextErrors.password = "Minimum 8 characters required.";
    else if (!specialCharRegex.test(password))
      nextErrors.password = "Add a special character (@$!%*?&).";

    if (nextErrors.firstName || nextErrors.lastName || nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setErrors({ firstName: "", lastName: "", email: "", password: "" });

  mutate(formData, {
    onSuccess: async () => {
      const fullName = `${firstName} ${lastName}`.trim();
      await saveProfile({ displayName: fullName, email });
      router.replace({
        pathname: "/onboarding",
        params: { authMessage: `${firstName} signup successful` },
      });
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || "Signup failed. Try again!";
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
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            <Pressable onPress={() => router.back()} className="mb-2 mt-2">
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </Pressable>

            {/* Header Section */}
            <View className="items-center mb-6">
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-40 h-40"
                resizeMode="contain"
              />

              <Text
                className="text-xl font-bold text-center mt-3"
                style={{ color: Colors.accent }}
              >
                Create Account
              </Text>

              <Text
                className="text-base text-center mt-1"
                style={{ color: Colors.textSecondary }}
              >
                Start your journey to better grades
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

            {/* Form Card */}
            <View
              className="p-5 rounded-3xl"
              style={{
                backgroundColor: Colors.surface,
                borderWidth: 1,
                borderColor: Colors.cardBorder,
              }}
            >
              <InputField
                label="First Name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChangeText={(text) => {
                  setFormData({ ...formData, firstName: text });
                  setErrors((e) => ({ ...e, firstName: "" }));
                }}
                error={errors.firstName}
              />

              <InputField
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChangeText={(text) => {
                  setFormData({ ...formData, lastName: text });
                  setErrors((e) => ({ ...e, lastName: "" }));
                }}
                error={errors.lastName}
              />

              <InputField
                label="Email Address"
                placeholder="your.email@example.com"
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
                label="Password"
                placeholder="Create a strong password"
                secureTextEntry
                passwordToggle
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  setErrors((e) => ({ ...e, password: "" }));
                }}
                error={errors.password}
              />

              <View className="mt-4">
                <PrimaryButton
                  title={isPending ? "Creating Account..." : "Create Account"}
                  handlePress={handleSignup}
                  disabled={isPending}
                />
              </View>

              {serverError ? (
                <Text style={{ color: Colors.danger, fontWeight: "700", marginBottom: 10 }}>
                  {serverError}
                </Text>
              ) : null}

              {isPending && (
                <ActivityIndicator
                  color={Colors.accent}
                  className="mt-4"
                  size="small"
                />
              )}
            </View>

            {/* Login Link */}
            <Pressable 
                onPress={() => router.push("/auth/login")} 
                className="mt-6 items-center"
            >
              <Text style={{ color: Colors.textSecondary }}>
                Already have an account?{" "}
                <Text style={{ color: Colors.accent, fontWeight: "bold" }}>Login</Text>
              </Text>
            </Pressable>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}