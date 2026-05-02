import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import QuestionInput from "../../components/shared/QuestionInput";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";

import useHistoryImageTheory from "../../src/hooks/useHistoryImageTheory";

import Colors from "../../constants/Colors";

const MAX_IMAGES = 1;

export default function HistoryImageScreen() {
  const router = useRouter();

  const [marks, setMarks] = useState(3);
  const [question, setQuestion] = useState("");

  const [images, setImages] = useState([]);

  const { mutate: analyzeImageTheory, isPending } = useHistoryImageTheory();

  // =========================
  // PICK IMAGE
  // =========================
  const pickImage = async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        Alert.alert("Limit reached", `You can add up to ${MAX_IMAGES} image.`);
        return;
      }

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow gallery access to upload image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: false,
        base64: true, // IMPORTANT
      });

      if (!result.canceled && result.assets?.length > 0) {
        const selected = result.assets[0];

        if (!selected.base64) {
          Alert.alert("Error", "Image conversion failed.");
          return;
        }

        setImages([
          {
            uri: selected.uri,
            base64: selected.base64,
          },
        ]);
      }
    } catch (error) {
      console.log("Pick Image Error:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const removeAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };
  
  const handleGenerate = async () => {
  try {
    if (!images.length) {
      Alert.alert("Image required", "Please upload an image first.");
      return;
    }

    // ✅ FIXED: "query" field + marks String
    const payload = {
      query: question?.trim() || "Explain this image properly",
      marks: String(marks),
      imageUri: images[0].uri,
    };

    analyzeImageTheory(payload, {
      onSuccess: (response) => {
        const finalAnswer =
          response?.data?.answer ||
          response?.data?.data?.answer ||
          response?.answer ||
          response?.result ||
          "No answer generated";

        router.push({
          pathname: "/history/solution",
          params: {
            marks: String(marks),
            mode: "image",
            imageCount: String(images.length),
            question: question?.trim() || "Image Analysis",
            answer: finalAnswer,
          },
        });
      },

      onError: (error) => {
        Alert.alert(
          "Analysis Failed",
          error?.message || "Something went wrong"
        );
      },
    });
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Failed to process image.");
  }
};

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      style={{ flex: 1 }}
    >
      <AppDecor />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <ScreenHeader
              onBack={() => router.back()}
              title="History - Image"
              subtitle="Upload source image and generate structured answer"
              icon="image-search-outline"
            />

            {/* MAIN CARD */}
            <View style={styles.card}>
              {/* QUESTION */}
              <SectionCard
                label="Question (optional)"
                icon="help-circle-outline"
              >
                <QuestionInput
                  hideLabel
                  value={question}
                  onChangeText={setQuestion}
                />
              </SectionCard>

              {/* IMAGE UPLOAD */}
              <Text style={styles.uploadLabel}>
                Source image (max {MAX_IMAGES})
              </Text>

              <View style={styles.grid}>
                {/* IMAGE PREVIEW */}
                {images.map((item, idx) => (
                  <View key={`${item.uri}-${idx}`} style={styles.thumbWrap}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.thumb}
                      resizeMode="cover"
                    />

                    <Pressable
                      onPress={() => removeAt(idx)}
                      style={styles.removeFab}
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={22}
                        color={Colors.white}
                      />
                    </Pressable>
                  </View>
                ))}

                {/* ADD BUTTON */}
                {images.length < MAX_IMAGES && (
                  <Pressable
                    onPress={pickImage}
                    style={({ pressed }) => [
                      styles.addTile,
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="image-plus"
                      size={28}
                      color={Colors.accent}
                    />

                    <Text style={styles.addTileText}>
                      Add ({images.length}/{MAX_IMAGES})
                    </Text>
                  </Pressable>
                )}
              </View>

              <Text style={styles.uploadHint}>
                Upload notes, diagrams, maps, or history source images for
                AI-based answer generation.
              </Text>

              {/* MARKS */}
              <Text style={styles.marksLabel}>
                Marks (answer length)
              </Text>

              <View style={styles.marksRow}>
                {[3, 5].map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setMarks(m)}
                    style={[
                      styles.markChip,
                      marks === m && styles.markChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.markChipText,
                        marks === m && styles.markChipTextActive,
                      ]}
                    >
                      {m} marks
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* SUBMIT */}
              <PrimaryButton
                title={isPending ? "Generating..." : "Generate image answer"}
                handlePress={handleGenerate}
                disabled={isPending}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 48,
    paddingTop: 8,
    flexGrow: 1,
  },

  card: {
    marginTop: 8,
    borderRadius: 24,
    padding: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
      },

      android: {
        elevation: 8,
      },
    }),
  },

  uploadLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },

  thumbWrap: {
    width: "31%",
    marginHorizontal: "1%",
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    position: "relative",
  },

  thumb: {
    width: "100%",
    height: "100%",
  },

  removeFab: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
    padding: 2,
    zIndex: 2,
  },

  addTile: {
    width: "31%",
    marginHorizontal: "1%",
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderStyle: "dashed",
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },

  addTileText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },

  uploadHint: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 14,
  },

  marksLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },

  marksRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  markChip: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },

  markChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },

  markChipText: {
    color: Colors.textSecondary,
    fontWeight: "800",
    fontSize: 14,
  },

  markChipTextActive: {
    color: Colors.white,
  },
});