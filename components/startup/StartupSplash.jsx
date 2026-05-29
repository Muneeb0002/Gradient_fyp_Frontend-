import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../../constants/Colors";

const HOLD_MS = 900;
const FADE_OUT_MS = 520;

export default function StartupSplash({ onFinish }) {
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(18)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const blobTop = useRef(new Animated.Value(0)).current;
  const blobBottom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      await SplashScreen.hideAsync().catch(() => {});

      Animated.parallel([
        Animated.timing(blobTop, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(blobBottom, {
          toValue: 1,
          duration: 800,
          delay: 80,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 48,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 420,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(ringScale, {
            toValue: 1,
            tension: 40,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(titleY, {
            toValue: 0,
            duration: 420,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(lineWidth, {
            toValue: 1,
            duration: 480,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
        ]),
        Animated.timing(subOpacity, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 1,
          duration: HOLD_MS + 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(120),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: FADE_OUT_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!cancelled && finished) onFinish();
      });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [
    blobBottom,
    blobTop,
    lineWidth,
    logoOpacity,
    logoScale,
    onFinish,
    overlayOpacity,
    progress,
    ringOpacity,
    ringScale,
    subOpacity,
    titleOpacity,
    titleY,
  ]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const accentLineWidth = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 48],
  });

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[
          Colors.backgroundStart,
          Colors.backgroundMiddle,
          Colors.backgroundEnd,
        ]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.blobTop,
          {
            opacity: blobTop,
            transform: [
              {
                scale: blobTop.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blobBottom,
          {
            opacity: blobBottom,
            transform: [
              {
                scale: blobBottom.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ],
          },
        ]}
      />

      <View style={styles.center}>
        <View style={styles.logoStage}>
          <Animated.View
            style={[
              styles.ringOuter,
              {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.logoFrame,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(79, 209, 197, 0.22)",
                "rgba(63, 183, 168, 0.08)",
              ]}
              style={styles.logoFrameGradient}
            >
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </LinearGradient>
          </Animated.View>
        </View>

        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>GRADIANT</Text>
          <Animated.View style={[styles.accentLine, { width: accentLineWidth }]} />
        </Animated.View>

        <Animated.Text style={[styles.subtitle, { opacity: subOpacity }]}>
          AI-powered O-Level study
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: subOpacity }]}>
          Exam-style steps · Smarter revision
        </Animated.Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    elevation: 100,
    backgroundColor: Colors.backgroundStart,
  },
  blobTop: {
    position: "absolute",
    top: -80,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.primary,
    opacity: 0.09,
  },
  blobBottom: {
    position: "absolute",
    bottom: 80,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.accent,
    opacity: 0.07,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logoStage: {
    width: 168,
    height: 168,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  ringOuter: {
    position: "absolute",
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
    backgroundColor: "rgba(79, 209, 197, 0.06)",
  },
  logoFrame: {
    width: 132,
    height: 132,
    borderRadius: 66,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.4)",
    ...Platform.select({
      ios: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },
  logoFrameGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 88,
    height: 88,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 5,
    color: Colors.white,
    textAlign: "center",
  },
  accentLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    marginTop: 12,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
    textAlign: "center",
  },
  tagline: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textMuted,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  footer: {
    paddingHorizontal: 48,
    paddingBottom: Platform.OS === "ios" ? 52 : 36,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
});
