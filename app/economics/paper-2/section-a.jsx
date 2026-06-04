import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
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
import ScreenHeader from "../../../components/shared/ScreenHeader";
import SectionCard from "../../../components/shared/SectionCard";
import ThemedMessageModal from "../../../components/shared/ThemedMessageModal";
import Colors from "../../../constants/Colors";
import { savePaper2Session } from "../../../lib/economicsPaper2Session";
import { openSubjectResult } from "../../../lib/subjectNavigation";

const MAX_IMAGES = 3;

export default function EconomicsPaperTwoSectionAScreen() {
  const router = useRouter();
  const [imageUris, setImageUris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(null);

  const pickImage = async () => {
    if (imageUris.length >= MAX_IMAGES) {
      setDialog({
        title: "Maximum images reached",
        message: `Section A accepts up to ${MAX_IMAGES} photos of your question paper.`,
      });
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setDialog({
        title: "Permission needed",
        message: "Allow photo access to upload your Paper 2 question images.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUris((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (imageUris.length === 0) {
      setDialog({
        title: "Add at least one image",
        message: "Upload a photo of your Section A question paper (1–3 images).",
      });
      return;
    }

    setLoading(true);
    await savePaper2Session({
      section: "A",
      inputMode: "image",
      query: "",
      imageUris,
    });

    setTimeout(() => {
      setLoading(false);
      openSubjectResult(router, "/economics/paper-2/result");
    }, 900);
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <ScreenHeader
            onBack={() => router.back()}
            title="Section A"
            subtitle="Data response · 1–3 images"
            icon="image-multiple-outline"
            compact
          />

          <SectionCard label="Question paper photos" icon="camera-outline">
            <Text style={styles.helpText}>
              Photograph the full Section A page(s). Marks beside each part will be detected from your images.
            </Text>

            <View style={styles.imageGrid}>
              {imageUris.map((uri, index) => (
                <View key={`img-${uri}`} style={styles.imageSlot}>
                  <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
                  <Pressable
                    onPress={() => removeImage(index)}
                    style={styles.removeImage}
                    hitSlop={8}
                  >
                    <MaterialCommunityIcons name="close" size={18} color={Colors.white} />
                  </Pressable>
                  <View style={styles.indexBadge}>
                    <Text style={styles.indexText}>{index + 1}</Text>
                  </View>
                </View>
              ))}

              {imageUris.length < MAX_IMAGES ? (
                <Pressable
                  onPress={pickImage}
                  style={({ pressed }) => [styles.addSlot, pressed && { opacity: 0.9 }]}
                >
                  <MaterialCommunityIcons name="image-plus" size={32} color={Colors.textMuted} />
                  <Text style={styles.addTitle}>Add photo</Text>
                  <Text style={styles.addHint}>
                    {imageUris.length}/{MAX_IMAGES} · clear photo works best
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </SectionCard>

          <View style={styles.submitWrap}>
            {loading ? (
              <AppLoader
                compact
                title="Analysing question"
                subtitle="Examiner is reviewing your Section A…"
              />
            ) : null}
            <PrimaryButton
              title={loading ? "Analysing…" : "Get examiner answers"}
              handlePress={handleSubmit}
              isLoading={loading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <ThemedMessageModal
        visible={!!dialog}
        title={dialog?.title}
        message={dialog?.message}
        onClose={() => setDialog(null)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 40,
    paddingTop: 8,
  },
  helpText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
    marginBottom: 14,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageSlot: {
    width: "47%",
    aspectRatio: 0.75,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  preview: {
    width: "100%",
    height: "100%",
  },
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
  indexBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    color: Colors.backgroundStart,
    fontSize: 12,
    fontWeight: "900",
  },
  addSlot: {
    width: "47%",
    aspectRatio: 0.75,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  addTitle: {
    color: Colors.textSecondary,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 8,
  },
  addHint: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
    fontWeight: "600",
  },
  submitWrap: {
    marginTop: 8,
  },
});
