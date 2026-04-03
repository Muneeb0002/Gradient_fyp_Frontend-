import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleButton from "../../components/auth/GoogleButton";
import InputField from "../../components/auth/InputField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import Colors from "../../constants/Colors";
import { useLogin } from "../../src/hooks/useLogin.js";

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutate, isPending } = useLogin();

  const handleLogin = () => {
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }


    // 3. Email Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", " it is mandatory to fill in all the details.");
      return;
    }

    const specialCharRegex = /[ #@$!%*?&]/;

    if (password.length < 6) {
      Alert.alert("Short Password", "Min. 6 chars pasword are required.");
      return;
    }

    if (!specialCharRegex.test(password)) {
      Alert.alert("Weak Password", " special character (@$!%*?&) is mandatory in the password.");
      return;
    }

    mutate(formData, {
      onSuccess: () => {
        router.replace("/dashboard");
      },
      onError: (err) => {
        const errorMsg = err.response?.data?.message || "Login failed. Try again!";
        Alert.alert("Login Error", errorMsg);
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
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />

          <Pressable
            className="items-end mb-6"
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text style={{ color: Colors.primary }}>Forgot password?</Text>
          </Pressable>

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