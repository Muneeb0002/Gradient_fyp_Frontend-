import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import Colors from "../../constants/Colors";

export default function MathematicsHubScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ScreenHeader
            onBack={() => router.back()}
            title="Mathematics"
            subtitle="Choose Image or Numerical mode for your O Level maths question."
            icon="calculator-variant"
          />

          <View style={styles.grid}>
            <Pressable
              onPress={() => router.push("/maths/image-question")}
              style={({ pressed }) => [styles.modeCard, pressed && { opacity: 0.92 }]}
            >
              <LinearGradient
                colors={["rgba(63,183,168,0.24)", "rgba(63,183,168,0.06)"]}
                style={styles.modeCardInner}
              >
                <View style={styles.modeIconWrap}>
                  <MaterialCommunityIcons name="image-search-outline" size={32} color={Colors.accent} />
                </View>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>Visual</Text>
                </View>
                <Text style={styles.modeTitle}>Image question</Text>
                <Text style={styles.modeSubtitle}>Upload a photo of the question</Text>
                <Text style={styles.modeHint}>
                  Diagrams, graphs, or printed questions from books and past papers.
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => router.push("/maths/numerical")}
              style={({ pressed }) => [styles.modeCard, pressed && { opacity: 0.92 }]}
            >
              <LinearGradient
                colors={["rgba(79,209,197,0.24)", "rgba(79,209,197,0.06)"]}
                style={styles.modeCardInner}
              >
                <View style={styles.modeIconWrap}>
                  <MaterialCommunityIcons name="numeric" size={32} color={Colors.accent} />
                </View>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>Typed</Text>
                </View>
                <Text style={styles.modeTitle}>Numerical question</Text>
                <Text style={styles.modeSubtitle}>Type equations and word problems</Text>
                <Text style={styles.modeHint}>
                  Best when you can type the question — same solve flow as before.
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 48,
    paddingTop: 8,
  },
  grid: {
    flexDirection: "column",
    gap: 14,
    marginTop: 10,
    width: "100%",
    alignSelf: "stretch",
  },
  modeCard: {
    width: "100%",
    alignSelf: "stretch",
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  modeCardInner: {
    width: "100%",
    padding: 18,
    height: 220,
    justifyContent: "space-between",
  },
  modeIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modeBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(79, 209, 197, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
    marginBottom: 8,
  },
  modeBadgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
  },
  modeTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  modeSubtitle: {
    marginTop: 6,
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  modeHint: {
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    minHeight: 40,
  },
});
