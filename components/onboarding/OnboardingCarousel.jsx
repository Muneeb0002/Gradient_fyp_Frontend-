import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ONBOARDING_SLIDES } from "../../constants/onboardingSlides";
import Colors from "../../constants/Colors";
import { setOnboardingComplete } from "../../lib/storage";
import AppDecor from "../shared/AppDecor";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL = ONBOARDING_SLIDES.length;

function triggerLight() {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

const iconShadow =
  Platform.OS === "android"
    ? { elevation: 12 }
    : {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      };

export default function OnboardingCarousel() {
  const router = useRouter();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const lastIndex = TOTAL - 1;

  const finish = useCallback(async () => {
    triggerLight();
    await setOnboardingComplete();
    router.replace("/dashboard");
  }, [router]);

  const goNext = useCallback(() => {
    triggerLight();
    if (index < lastIndex) {
      const next = index + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    } else {
      finish();
    }
  }, [index, lastIndex, finish]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setIndex(viewableItems[0].index);
    }
  }, []);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

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

      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <View style={styles.stepPill}>
            <MaterialCommunityIcons
              name="map-marker-path"
              size={14}
              color={Colors.accent}
            />
            <Text style={styles.stepText}>
              Step {index + 1} of {TOTAL}
            </Text>
          </View>
          <Pressable
            onPress={finish}
            style={({ pressed }) => [
              styles.skipBtn,
              pressed && { opacity: 0.85 },
            ]}
            hitSlop={12}
          >
            <Text style={styles.skipLabel}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.flexOne}>
          <FlatList
            ref={listRef}
            data={ONBOARDING_SLIDES}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewConfig}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH}
            snapToAlignment="center"
            style={styles.list}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                listRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              }, 120);
            }}
            getItemLayout={(_, i) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * i,
              index: i,
            })}
            renderItem={({ item }) => (
              <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
                <View style={styles.iconWrap}>
                  <LinearGradient
                    colors={[Colors.primaryDark, Colors.primary, Colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.iconRing, iconShadow]}
                  >
                    <View style={styles.iconInner}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={68}
                        color={Colors.accent}
                      />
                    </View>
                  </LinearGradient>
                </View>

                <View style={styles.textCard}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {ONBOARDING_SLIDES.map((_, i) => (
              <View
                key={ONBOARDING_SLIDES[i].key}
                style={[
                  styles.dot,
                  i === index && styles.dotActive,
                  i === index && {
                    backgroundColor: Colors.accent,
                    width: 28,
                  },
                ]}
              />
            ))}
          </View>

          <Pressable onPress={goNext} style={styles.ctaOuter}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>
                {index === lastIndex ? "Get started" : "Next"}
              </Text>
              <MaterialCommunityIcons
                name={index === lastIndex ? "check" : "chevron-right"}
                size={22}
                color={Colors.white}
              />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  stepPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  stepText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  skipLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  slide: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: "center",
  },
  iconWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  iconRing: {
    borderRadius: 999,
    padding: 3,
  },
  iconInner: {
    width: 136,
    height: 136,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  textCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 22,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 12,
    paddingTop: 8,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.cardBorder,
    opacity: 0.7,
  },
  dotActive: {
    opacity: 1,
  },
  ctaOuter: {
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
