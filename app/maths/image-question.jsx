import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
import AppLoader from "../../components/shared/AppLoader";
import QuestionInput from "../../components/shared/QuestionInput";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import ThemedMessageModal from "../../components/shared/ThemedMessageModal";
import Colors from "../../constants/Colors";
import useGraphAnalysis from "../../src/hooks/useMathsGraphAnalysis";

export default function MathsImageQuestionScreen() {
  const router = useRouter();
  const [uri, setUri] = useState(null);
  const [note, setNote] = useState("");
  const [dialog, setDialog] = useState(null);
  const { mutate: analyzeGraph, isPending } = useGraphAnalysis(); 

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setDialog({
        title: "Permission needed",
        message: "Allow photo library access to attach a question image.",
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setUri(result.assets[0].uri);
    }
  };

  const handleSolve = () => {
    if (!uri) {
      setDialog({
        title: "Image required",
        message: "Please upload a photo of your maths question first.",
      });
      return;
    }

    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    // ✅ API Mutation call with image details
    analyzeGraph(
      { uri, name: filename, type },
      {
        onSuccess: (apiResponse) => {
          // ✅ API ka data router ke params mein stringify karke solution screen par forward kar diya
          router.push({
            pathname: "/maths/solution-image",
            params: {
              sourceImageUri: encodeURIComponent(uri),
              apiData: JSON.stringify(apiResponse),
              ...(note.trim() ? { note: note.trim() } : {}),
            },
          });
        },
      }
    );
  };

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      style={styles.flex1}
    >
      <AppDecor />
      <ThemedMessageModal
        visible={!!dialog}
        title={dialog?.title ?? ""}
        message={dialog?.message ?? ""}
        onClose={() => setDialog(null)}
      />
      <SafeAreaView style={styles.flex1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <ScreenHeader
            onBack={() => router.back()}
            title="Image question"
            subtitle="Upload a photo — marks are read from the question automatically."
            icon="image-outline"
          />

          <View style={styles.card}>
            <SectionCard label="Question image" icon="camera-outline">
              {uri ? (
                <Image
                  source={{ uri }}
                  style={styles.preview}
                  contentFit="contain"
                />
              ) : (
                <Pressable onPress={pickImage} style={styles.placeholder}>
                  <MaterialCommunityIcons
                    name="image-plus"
                    size={44}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.placeholderText}>
                    Tap to choose an image
                  </Text>
                </Pressable>
              )}

              {uri && !isPending ? (
                <Pressable onPress={pickImage} style={styles.changeBtn}>
                  <Text style={styles.changeBtnText}>Choose different image</Text>
                </Pressable>
              ) : null}
            </SectionCard>

            <View style={{ height: 14 }} />

            <SectionCard label="Note (optional)" icon="note-text-outline">
              <QuestionInput
                hideLabel
                value={note}
                onChangeText={setNote}
                placeholder="e.g. Solve part (a) only"
                helperText="Add a short note if part of the question is unclear."
                editable={!isPending}
              />
            </SectionCard>

            <View style={{ height: 10 }} />

            {isPending ? (
              <AppLoader
                title="Analyzing your graph"
                subtitle="Reading the image and preparing a solution…"
              />
            ) : (
              <PrimaryButton
                title={uri ? "Solve from image" : "Pick image first"}
                handlePress={() => {
                  if (!uri) {
                    pickImage();
                    return;
                  }
                  handleSolve();
                }}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
    paddingTop: 8,
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
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
  },
  placeholder: {
    minHeight: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
  },
  placeholderText: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontSize: 15,
  },
  changeBtn: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 8,
  },
  changeBtnText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  loaderContainer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: 8,
    color: Colors.accent,
    fontWeight: "700",
    fontSize: 15,
  },
});