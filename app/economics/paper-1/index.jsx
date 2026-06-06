import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../../components/auth/PrimaryButton";
import AppDecor from "../../../components/shared/AppDecor";
import AppLoader from "../../../components/shared/AppLoader";
import QuestionInput from "../../../components/shared/QuestionInput";
import ScreenHeader from "../../../components/shared/ScreenHeader";
import SectionCard from "../../../components/shared/SectionCard";
import ThemedMessageModal from "../../../components/shared/ThemedMessageModal";
import Colors from "../../../constants/Colors";
import { SAMPLE_MCQ_QUESTION } from "../../../constants/economicsSampleData";
import { saveMcqSession } from "../../../lib/economicsMcqSession";
import { openSubjectResult } from "../../../lib/subjectNavigation";

import { useEconomicsPaper1Mutation } from "../../../src/hooks/useEconomicsPaper1";

const MODES = [
  { id: "text", label: "Text", icon: "format-text" },
  { id: "image", label: "Image", icon: "image-outline" },
  { id: "both", label: "Both", icon: "file-image-plus-outline" },
];

export default function EconomicsPaperOneScreen() {
  const router = useRouter();
  const [mode, setMode] = useState("text");
  const [question, setQuestion] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(true);

  const { mutateAsync } = useEconomicsPaper1Mutation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setDialog({
        title: "Permission needed",
        message: "Allow photo access to attach an MCQ image.",
      });
      return;
    }
    // 🛠️ FIX: MediaTypeOptions deprecation warning resolved
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleExplain = async () => {
    const hasText = !!question.trim();
    const hasImage = !!imageUri;

    if (mode === "text" && !hasText) {
      setDialog({
        title: "Add your question",
        message: "Paste or type the MCQ including all four options.",
      });
      return;
    }
    if (mode === "image" && !hasImage) {
      setDialog({
        title: "Add an image",
        message: "Upload a photo of the MCQ from your paper or textbook.",
      });
      return;
    }
    if (mode === "both" && !hasText && !hasImage) {
      setDialog({
        title: "Text or image required",
        message: "Provide question text, an image, or both.",
      });
      return;
    }

    try {
      setLoading(true);

      // 🛠️ 1. Actual Backend Mutation Call
      const apiResponse = await mutateAsync({
        mode,
        question: question.trim(),
        imageUri: hasImage ? imageUri : "",
      });

      // 🛠️ 2. Saving Real API Response inside local session state
      await saveMcqSession({
        question: question.trim(),
        mode,
        imageUri: hasImage ? imageUri : "",
        apiResult: apiResponse, 
      });

      setLoading(false);
      openSubjectResult(router, "/economics/paper-1/result");
    } catch (apiError) {
      setLoading(false);
      setDialog({
        title: "Analysis Failed",
        message: apiError.response?.data?.message || "Something went wrong while scanning the MCQ.",
      });
    }
  };

  const fillSample = () => setQuestion(SAMPLE_MCQ_QUESTION);

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <ScreenHeader
              onBack={() => router.back()}
              title="Paper 1 · MCQ"
              subtitle="Get the correct option, rationale, and examiner tips"
              icon="format-list-checks"
              compact
            />

            <View style={styles.guidelinesCard}>
              <Pressable
                onPress={() => setShowGuidelines(!showGuidelines)}
                style={styles.guidelinesHeader}
              >
                <View style={styles.guidelinesHeaderLeft}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color={Colors.accent}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.guidelinesTitle}>Syllabus & MCQ Guidelines</Text>
                </View>
                <MaterialCommunityIcons
                  name={showGuidelines ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.textMuted}
                />
              </Pressable>

              {showGuidelines && (
                <View style={styles.guidelinesContent}>
                  <Text style={styles.guidelinesIntro}>
                    To get a complete economics MCQ explanation, follow these:
                  </Text>
                  
                  <View style={styles.guidelineRow}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={Colors.primary} style={styles.guidelineIcon} />
                    <Text style={styles.guidelineText}>
                      <Text style={{ fontWeight: "700", color: Colors.white }}>Scope: </Text>
                      Cambridge O-Level Economics (Syllabus 2281) MCQ questions (1 mark).
                    </Text>
                  </View>

                  <View style={styles.guidelineRow}>
                    <MaterialCommunityIcons name="check-circle" size={16} color={Colors.primary} style={styles.guidelineIcon} />
                    <Text style={styles.guidelineText}>
                      <Text style={{ fontWeight: "700", color: Colors.white }}>Format: </Text>
                      Provide the main question stem along with all options A, B, C, and D for exact analysis.
                    </Text>
                  </View>

                  <View style={styles.guidelineRow}>
                    <MaterialCommunityIcons name="image" size={16} color={Colors.accent} style={styles.guidelineIcon} />
                    <Text style={styles.guidelineText}>
                      <Text style={{ fontWeight: "700", color: Colors.white }}>Image Mode: </Text>
                      Ensure any data tables, pie charts, or demand/supply graphs in the printed MCQ are clearly visible.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.modeRow}>
              {MODES.map((m) => {
                const active = mode === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setMode(m.id)}
                    style={[styles.modeTab, active && styles.modeTabActive]}
                  >
                    <MaterialCommunityIcons
                      name={m.icon}
                      size={18}
                      color={active ? Colors.accent : Colors.textMuted}
                    />
                    <Text style={[styles.modeTabText, active && styles.modeTabTextActive]}>
                      {m.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {(mode === "text" || mode === "both") && (
              <SectionCard label="Question" icon="help-circle-outline">
                <QuestionInput
                  hideLabel
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Paste the MCQ stem and options A–D…"
                  helperText="Include all four options for the most accurate explanation."
                />
                <Pressable onPress={fillSample} style={styles.sampleLink}>
                  <MaterialCommunityIcons name="text-short" size={16} color={Colors.accent} />
                  <Text style={styles.sampleLinkText}>Use sample question</Text>
                </Pressable>
              </SectionCard>
            )}

            {(mode === "image" || mode === "both") && (
              <SectionCard
                label="Question image"
                icon="camera-outline"
                style={styles.imageSection}
              >
                {imageUri ? (
                  <View style={styles.previewWrap}>
                    <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
                    <Pressable onPress={() => setImageUri("")} style={styles.removeImage}>
                      <MaterialCommunityIcons name="close" size={18} color={Colors.white} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={pickImage} style={styles.uploadBox}>
                    <MaterialCommunityIcons
                      name="image-plus"
                      size={36}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.uploadTitle}>Upload MCQ photo</Text>
                    <Text style={styles.uploadHint}>Clear photo of printed question works best</Text>
                  </Pressable>
                )}
                {imageUri ? (
                  <Pressable onPress={pickImage} style={styles.changePhoto}>
                    <Text style={styles.changePhotoText}>Choose different photo</Text>
                  </Pressable>
                ) : null}
              </SectionCard>
            )}

            <View style={styles.submitWrap}>
              {loading ? (
                <AppLoader
                  compact
                  title="Analysing MCQ"
                  subtitle="Examiner is reviewing your question…"
                />
              ) : null}
              <PrimaryButton
                title={loading ? "Analysing…" : "Explain MCQ"}
                handlePress={handleExplain}
                isLoading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <ThemedMessageModal
          visible={!!dialog}
          title={dialog?.title ?? ""}
          message={dialog?.message ?? ""}
          onClose={() => setDialog(null)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 22, paddingBottom: 40, paddingTop: 8 },
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modeTabActive: {
    backgroundColor: "rgba(79, 209, 197, 0.12)",
    borderColor: "rgba(79, 209, 197, 0.4)",
  },
  modeTabText: { color: Colors.textMuted, fontWeight: "700", fontSize: 13 },
  modeTabTextActive: { color: Colors.accent },
  sampleLink: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  sampleLinkText: { color: Colors.accent, fontWeight: "700", fontSize: 13 },
  imageSection: { marginTop: 14 },
  uploadBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.surfaceAlt,
  },
  uploadTitle: { color: Colors.textSecondary, fontWeight: "700", fontSize: 15, marginTop: 12 },
  uploadHint: { color: Colors.textMuted, fontSize: 12, marginTop: 4, textAlign: "center" },
  previewWrap: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  preview: { width: "100%", height: 200 },
  removeImage: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  changePhoto: { alignItems: "center", marginTop: 12 },
  changePhotoText: { color: Colors.accent, fontWeight: "700", fontSize: 13 },
  submitWrap: { marginTop: 8 },
  guidelinesCard: {
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  guidelinesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14 },
  guidelinesHeaderLeft: { flexDirection: "row", alignItems: "center" },
  guidelinesTitle: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  guidelinesContent: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.05)" },
  guidelinesIntro: { color: Colors.textSecondary, fontSize: 12, lineHeight: 16, marginBottom: 10, marginTop: 10 },
  guidelineRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  guidelineIcon: { marginRight: 8, marginTop: 2 },
  guidelineText: { flex: 1, color: Colors.textSecondary, fontSize: 12, lineHeight: 16 },
});