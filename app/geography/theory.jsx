import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
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
import ThemedMessageModal from "../../components/shared/ThemedMessageModal";
import QuestionInput from "../../components/shared/QuestionInput";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";
// import { useAskAI } from "../../src/hooks/useAskAI.js";

import { useUploadGeography } from "../../src/hooks/useUploadGeography.js";


const MAX_IMAGES = 1;

export default function GeographyTheoryScreen() {
  const router = useRouter();
  const [marks, setMarks] = useState(null);
  const [images, setImages] = useState([]);
  const [question, setQuestion] = useState("");
  const [dialog, setDialog] = useState(null);

  const { mutate, isPending } = useUploadGeography();

  const pickImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Limit reached", `You can add up to ${MAX_IMAGES} images.`);
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required!", "Please allow media access to upload images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setImages((prev) => [...prev, result.assets[0].uri].slice(0, MAX_IMAGES));
    }
  };

  const removeAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    // 1. Basic Validation
    // 2. Marks validation (Required for theory)
    if (!marks) {
      setDialog({ title: "Select marks", message: "Please select marks (1 to 6)." });
      return;
    }
    if (!question.trim()) {
      setDialog({ title: "Question required", message: "Please enter a question." });
      return;
    }

    // 2. FormData Prepare Karein
    const formData = new FormData();

    if (images.length > 0) {
      const imageUri = images[0];
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
        name: filename || "upload.jpg",
        type,
      });
    }

    // Map analysis API (useUploadGeography) expects 'query'
    formData.append("query", question.trim());
    formData.append("marks", String(marks));
    formData.append("mode", "theory");

    // 3. API Call trigger karein
    mutate(formData, {
      onSuccess: (res) => {
        console.log("Full Response:", res);

        // useUploadGeography key response mein explanation hota hai (MapAnalysisResponse)
        const finalAnswer = res.data?.explanation || res.data?.answer; 

        if (finalAnswer) {
          router.push({
            pathname: "/geography/solution",
            params: {
              answer: finalAnswer,
              marks: String(marks),
              imageCount: String(images.length),
              image: images[0] || null, // Pass image URI
              mode: "theory",
              question: question.trim(),
            },
          });
        } else {
          Alert.alert("Error", "No answer received from backend.");
        }
      },
      onError: (err) => {
        console.error("Mutation Error:", err);
        setDialog({
          title: "Error",
          message: err.message || "Something went wrong",
        });
      },
    });
  };


  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView style={styles.safe}>
        <ThemedMessageModal
          visible={!!dialog}
          title={dialog?.title}
          message={dialog?.message ?? ""}
          onClose={() => setDialog(null)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            <ScreenHeader
              onBack={() => router.back()}
              title="Geography - Theory"
              subtitle="Text-based structure with marks: 1 to 6"
              icon="book-open-page-variant"
            />

            <View style={styles.card}>
              <SectionCard label="Your question" icon="pencil-outline">
                <QuestionInput
                  hideLabel
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Ask anything about geography..."
                />
              </SectionCard>

              <Text style={styles.uploadLabel}>
                Upload Image (Optional, max {MAX_IMAGES})
              </Text>

              <View style={styles.grid}>
                {images.map((uri, idx) => (
                  <View key={`${uri}-${idx}`} style={styles.thumbWrap}>
                    <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
                    <Pressable
                      onPress={() => removeAt(idx)}
                      style={styles.removeFab}
                      hitSlop={8}
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={22}
                        color={Colors.white}
                      />
                    </Pressable>
                  </View>
                ))}

                {images.length < MAX_IMAGES && (
                  <Pressable
                    onPress={pickImage}
                    style={({ pressed }) => [
                      styles.addTile,
                      pressed && { opacity: 0.88 },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="image-plus"
                      size={78}
                      color={Colors.accent}
                    />
                    <Text style={styles.addTileText}>
                      Add ({images.length}/{MAX_IMAGES})
                    </Text>
                  </Pressable>
                )}
              </View>

              <Text style={styles.marksLabel}>Select Marks (1 to 6)</Text>

              <View style={styles.marksRow}>
                {[1, 2, 3, 4, 5, 6].map((m) => (
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

              {isPending && (
                <ActivityIndicator
                  style={{ marginBottom: 10 }}
                  color={Colors.accent}
                />
              )}

              <PrimaryButton
                title={isPending ? "Generating..." : "Generate answer"}
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
  safe: { flex: 1 },
  flex: { flex: 1 },
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
      android: { elevation: 8 },
    }),
  },
  marksLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 10,
  },
  marksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8
  },
  markChip: {
    width: "30%",
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
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
  uploadLabel: {
    color: Colors.textSecondary,
    fontSize: 17,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 10,
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
  },
  thumb: { width: "100%", height: "100%" },
  removeFab: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
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
});
