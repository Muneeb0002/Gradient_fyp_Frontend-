import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

// Keep splash visible while we do our custom animation
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AnimatedSplash({ onFinish }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.75)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide the native splash first
    SplashScreen.hideAsync();

    // Sequence: logo fades + scales in, then text appears, then glow pulses
    Animated.sequence([
      // 1. Logo scale + fade in
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // 2. Text fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // 3. Glow pulse
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // 4. Hold for 800ms
      Animated.delay(800),
      // 5. Fade entire screen out
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(() => onFinish());
  }, []);

  return (
    <View style={styles.splashContainer}>
      {/* Glow circle behind logo */}
      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

      {/* Logo */}
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.splashLogo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App name with gradient-style manual color */}
      <Animated.View style={{ opacity: textOpacity, alignItems: "center", marginTop: 20 }}>
        <Text style={styles.splashTitle}>
          <Text style={{ color: "#4FD1C5" }}>G</Text>
          <Text style={{ color: "#FFFFFF" }}>RADI</Text>
          <Text style={{ color: "#4FD1C5" }}>ANT</Text>
        </Text>
        <Text style={styles.splashSub}>AI-Powered O-Level Study</Text>
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
        {splashDone && (
          <Stack screenOptions={{ headerShown: false }} />
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#0B1628",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(79, 209, 197, 0.12)",
    shadowColor: "#4FD1C5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 60,
    elevation: 0,
  },
  splashLogo: {
    width: 140,
    height: 140,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 6,
    color: "#FFFFFF",
  },
  splashSub: {
    marginTop: 8,
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    letterSpacing: 1.5,
  },
});
