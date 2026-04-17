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
import ThemedMessageModal from "../../components/shared/ThemedMessageModal";
import Colors from "../../constants/Colors";

const MAX_IMAGES = 3;

export default function GeographyImageScreen() {
  const router = useRouter();
  const [marks, setMarks] = useState(null);
  const [images, setImages] = useState([]);
  const [question, setQuestion] = useState("");
  const [imageType, setImageType] = useState("map");
  const [dialog, setDialog] = useState(null);

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

  const handleGenerate = () => {
    if (images.length === 0) {
      setDialog({
        title: "Image required",
        message: "Please upload at least one image to proceed.",
      });
      return;
    }

    if (!question.trim()) {
      setDialog({
        title: "Missing question",
        message: "Please enter a question first.",
      });
      return;
    }

    if (marks == null) {
      setDialog({
        title: "Select marks",
        message: "Please select marks.",
      });
      return;
    }

    let mockPaths = undefined;
    if (imageType === "map") {
      const mockData = {
        success: true,
        message: "Analysis completed successfully",
        data: {
          features: [
            {
              type: "point",
              label: "Pipri, Karachi",
              data: [
                [24.81, 67.35]
              ],
              color: "#f43f5e",
              facts: "Largest industrial complex in Pakistan, built with assistance from USSR.",
              icon: "map-pin"
            }
          ]
        }
      };
      mockPaths = JSON.stringify(mockData);
    }

    router.push({
      pathname: "/geography/solution",
      params: {
        marks: String(marks),
        imageCount: String(images.length),
        mode: "analysis",
        queryType: imageType,
        question: question.trim(),
        ...(mockPaths && { paths: mockPaths }),
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
              title="Geography - Image"
              subtitle="Upload sources and get image-based structure"
              icon="image-search-outline"
            />

            <View style={styles.card}>
              <SectionCard label="Question" icon="help-circle-outline">
                <QuestionInput
                  hideLabel
                  value={question}
                  onChangeText={setQuestion}
                />
              </SectionCard>

              <Text style={styles.uploadLabel}>
                Source images (max {MAX_IMAGES})
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
                Upload photos of maps, diagrams, or sources — then generate an image-based answer.
              </Text>

              <Text style={styles.marksLabel}>Marks (answer length)</Text>
              <View style={styles.marksRow}>
                {[3, 7, 14].map((m) => (
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

              <Text style={styles.marksLabel}>Image Type</Text>
              <View style={styles.marksRow}>
                <Pressable
                  onPress={() => setImageType("map")}
                  style={[styles.markChip, imageType === "map" && styles.markChipActive]}
                >
                  <Text style={[styles.markChipText, imageType === "map" && styles.markChipTextActive]}>
                    Map
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setImageType("graph")}
                  style={[styles.markChip, imageType === "graph" && styles.markChipActive]}
                >
                  <Text style={[styles.markChipText, imageType === "graph" && styles.markChipTextActive]}>
                    Graph
                  </Text>
                </Pressable>
              </View>

              <PrimaryButton
                title="Generate image answer"
                handlePress={handleGenerate}
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
  uploadLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
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
  uploadHint: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  marksLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  marksRow: { flexDirection: "row", marginBottom: 8 },
  markChip: {
    flex: 1,
    marginHorizontal: 5,
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
});
