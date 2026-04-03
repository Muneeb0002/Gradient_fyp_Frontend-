import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react"; 
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert, 
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import InputField from "../../components/auth/InputField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import Colors from "../../constants/Colors";
import { useSignup } from "../../src/hooks/useSignup.js";

export default function SignUpScreen() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { mutate, isPending } = useSignup();

  const handleSignup = () => {
  const { firstName, lastName, email, password } = formData;

  // 1. All Fields Empty Check
  if (!firstName || !lastName || !email || !password) {
    Alert.alert("Missing Fields", "All fields are required.");
    return;
  }

  // 2. Name Validation (Sirf alphabets allow honge)
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    Alert.alert("Invalid Name", "Only letters (A-Z) allowed.");
    return;
  }

  if (firstName.length < 2 || lastName.length < 2) {
    Alert.alert("Short Name", "Minimum 2 characters required.");
    return;
  }

  // 3. Email Validation (Regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Invalid Email", " it is mandatory to fill in all the details.");
    return;
  }

  const specialCharRegex = /[ #@$!%*?&]/; 
  
  if (password.length < 8) {
    Alert.alert("Short Password", "Min. 8 chars pasword are required.");
    return;
  }

  if (!specialCharRegex.test(password)) {
    Alert.alert("Weak Password", " special character (@$!%*?&) is mandatory in the password.");
    return;
  }



  // Agar saari validations pass ho jayein toh API call karein
  mutate(formData, {
    onSuccess: () => {
      router.replace("/onboarding");
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || "Signup failed. Try again!";
      Alert.alert("Signup Error", errorMsg);
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
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />

              <InputField
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />

              <InputField
                label="Email Address"
                placeholder="your.email@example.com"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                label="Password"
                placeholder="Create a strong password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />

              <View className="mt-4">
                <PrimaryButton
                  title={isPending ? "Creating Account..." : "Create Account"}
                  handlePress={handleSignup}
                  disabled={isPending}
                />
              </View>

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