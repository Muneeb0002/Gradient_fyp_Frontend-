import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import Colors from "../../constants/Colors";

export default function EconomicsHubScreen() {
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
            title="Economics"
            subtitle="Cambridge O Level 2281 — choose your paper type"
            icon="chart-line"
          />

          <View style={styles.syllabusChip}>
            <MaterialCommunityIcons name="certificate-outline" size={18} color={Colors.accent} />
            <Text style={styles.syllabusText}>Syllabus 2281 · Examiner-style guidance</Text>
          </View>

          <View style={styles.grid}>
            <Pressable
              onPress={() => router.push("/economics/paper-1")}
              style={({ pressed }) => [styles.modeCard, pressed && { opacity: 0.92 }]}
            >
              <LinearGradient
                colors={["rgba(63,183,168,0.24)", "rgba(63,183,168,0.06)"]}
                style={styles.modeCardInner}
              >
                <View style={styles.modeIconWrap}>
                  <MaterialCommunityIcons name="format-list-checks" size={32} color={Colors.accent} />
                </View>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>Paper 1</Text>
                </View>
                <Text style={styles.modeTitle}>Multiple choice</Text>
                <Text style={styles.modeSubtitle}>Explain MCQs with mark-scheme clarity</Text>
                <Text style={styles.modeHint}>
                  Paste question text, upload a photo, or use both for a full examiner breakdown.
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={[styles.modeCard, styles.modeCardSoon]}>
              <LinearGradient
                colors={["rgba(100,116,139,0.12)", "rgba(100,116,139,0.04)"]}
                style={styles.modeCardInner}
              >
                <View style={[styles.modeIconWrap, styles.modeIconMuted]}>
                  <MaterialCommunityIcons name="file-document-outline" size={32} color={Colors.textMuted} />
                </View>
                <View style={[styles.modeBadge, styles.modeBadgeMuted]}>
                  <Text style={styles.modeBadgeTextMuted}>Paper 2</Text>
                </View>
                <Text style={styles.modeTitleMuted}>Structured questions</Text>
                <Text style={styles.modeSubtitleMuted}>Section A & B with diagrams</Text>
                <Text style={styles.modeHintMuted}>Coming in the next update.</Text>
              </LinearGradient>
            </View>
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
  syllabusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 16,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  syllabusText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "column",
    gap: 14,
    width: "100%",
  },
  modeCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  modeCardSoon: {
    opacity: 0.85,
  },
  modeCardInner: {
    padding: 18,
    minHeight: 220,
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
  modeIconMuted: {
    backgroundColor: Colors.surfaceAlt,
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
  modeBadgeMuted: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.cardBorder,
  },
  modeBadgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
  },
  modeBadgeTextMuted: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },
  modeTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  modeTitleMuted: {
    color: Colors.textSecondary,
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
  modeSubtitleMuted: {
    marginTop: 6,
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  modeHint: {
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    minHeight: 36,
  },
  modeHintMuted: {
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
});
