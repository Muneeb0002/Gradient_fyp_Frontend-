import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import Colors from "../../constants/Colors";

export default function HistoryModeScreen() {
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
            title="History"
            subtitle="Choose Theory or Image mode"
            icon="book-open-page-variant"
          />

          <View style={styles.grid}>
            <Pressable
              onPress={() => router.push("/history/theory")}
              style={({ pressed }) => [
                styles.modeCard,
                pressed && { opacity: 0.92 },
              ]}
            >
              <LinearGradient
                colors={["rgba(79,209,197,0.24)", "rgba(79,209,197,0.06)"]}
                style={styles.modeCardInner}
              >
                <View style={styles.modeIconWrap}>
                  <MaterialCommunityIcons name="book-open-variant" size={32} color={Colors.accent} />
                </View>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>Recommended</Text>
                </View>
                <Text style={styles.modeTitle}>Theory</Text>
                <Text style={styles.modeSubtitle}>Examiner-style structure</Text>
                <Text style={styles.modeHint}>Best for text questions and long answers.</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => router.push("/history/image")}
              style={({ pressed }) => [
                styles.modeCard,
                pressed && { opacity: 0.92 },
              ]}
            >
              <LinearGradient
                colors={["rgba(63,183,168,0.24)", "rgba(63,183,168,0.06)"]}
                style={styles.modeCardInner}
              >
                <View style={styles.modeIconWrap}>
                  <MaterialCommunityIcons name="image-search-outline" size={32} color={Colors.accent} />
                </View>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>Source-based</Text>
                </View>
                <Text style={styles.modeTitle}>Image</Text>
                <Text style={styles.modeSubtitle}>Upload sources for visual analysis</Text>
                <Text style={styles.modeHint}>Use this when paper has maps, cartoons, or photos.</Text>
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 10,
  },
  modeCard: {
    flex: 1,
    minWidth: "42%",
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  modeCardInner: {
    padding: 18,
    height: 230,
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
    minHeight: 36,
  },
});

