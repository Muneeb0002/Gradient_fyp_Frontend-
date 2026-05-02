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
import ScreenHeader from "../../components/shared/ScreenHeader";
import ThemedMessageModal from "../../components/shared/ThemedMessageModal";
import Colors from "../../constants/Colors";
import { useGeographyAnalyzeImage } from "../../src/hooks/useGeographyAnalyzeImage.js";

const MAX_IMAGES = 1;

export default function GeographyImageScreen() {
  const router = useRouter();
  const [images, setImages] = useState([]);
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

  const { mutate, isPending } = useGeographyAnalyzeImage();

  const handleGenerate = () => {
  if (images.length === 0) {
    setDialog({ title: "Image required", message: "Please upload an image." });
    return;
  }

  const formData = new FormData();
  const uri = images[0];
  const filename = uri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  // Postman screenshot image_2f0633.png ke mutabiq sirf 'images' key bhejni hai
  formData.append("images", {
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
    name: filename || `upload.jpg`,
    type,
  });

  mutate(formData, {
    onSuccess: (res) => {
      // Backend response structure: res.data.answer
      const responseData = res?.data;
      const finalAnswer = responseData?.answer;

      if (finalAnswer) {
        router.push({
          pathname: "/geography/solution",
          params: {
            answer: finalAnswer,
            // Backend agar marks bhej raha hai toh wo use karein, warna default 4
            marks: String(responseData?.marks || "4"), 
            image: images[0],
            mode: "image",
            queryType: "analysis",
            question: "Image Analysis",
            // Agar features hain toh pass karein, warna khali array
            features: JSON.stringify(responseData?.features || []),
          },
        });
      } else {
        // Agar backend "relevant nahi hai" wala message de (jaisa screenshot mein hai)
        setDialog({ title: "Note", message: "Image is not geography-related." });
      }
    },
    onError: (err) => {
      setDialog({ title: "Error", message: err.message || "Network Error" });
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
              <Text style={styles.uploadLabel}>
                Source image (max 1)
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

                {images.length < 1 && (
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
                      Add Image
                    </Text>
                  </Pressable>
                )}
              </View>

              <Text style={styles.uploadHint}>
                Upload a photo of a geography map, graph, or diagram to get a detailed examiner-style analysis.
              </Text>

              <PrimaryButton
                title="Generate ans"
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
