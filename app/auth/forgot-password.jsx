import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react"; // 1. useState import karein
import { Pressable, Text, View, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/auth/InputField.jsx";
import PrimaryButton from "../../components/auth/PrimaryButton";
import Colors from "../../constants/Colors";
import { useForgotPassword } from "../../src/hooks/useForgotPassword.js";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState(""); 

  const { mutate, isPending } = useForgotPassword();

  const handleSendOTP = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    mutate(email, {
      onSuccess: () => {
        router.push({
          pathname: "auth/verify-otp",
          params: { email: email } 
        });
      },
      onError: (err) => {
        Alert.alert("Error", err.response?.data?.message || "Something went wrong");
      }
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
      <SafeAreaView className="flex-1 px-6 py-8">
        {/* Back Button */}
        <Pressable onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>

        {/* Title */}
        <View className="mb-8">
          <Text
            className="text-2xl font-bold "
            style={{ color: Colors.accent }}
          >
            Forgot Password
          </Text>
          <Text
            className="text-base mt-2"
            style={{ color: Colors.textSecondary }}
          >
            Enter your email to receive a password reset OTP
          </Text>
        </View>

        {/* Input */}
        <InputField
          label="Email Address"
          placeholder="e.g. your.mail@example.com"
          value={email}
          onChangeText={(text) => setEmail(text)} 
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Send OTP Button */}
        <View className="mt-6">
          <PrimaryButton
            title={isPending ? "Sending..." : "Send OTP"} 
            handlePress={handleSendOTP}
            disabled={isPending}
          />
        </View>

        {isPending && (
          <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 20 }} />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}