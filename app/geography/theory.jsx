import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
import { useAskAI } from "../../src/hooks/useAskAI.js";

export default function GeographyTheoryScreen() {
  const router = useRouter();
  const [marks, setMarks] = useState(null);
  const [question, setQuestion] = useState("");
  const [dialog, setDialog] = useState(null);

  const { mutateAsync, isPending } = useAskAI();

  const handleGenerate = async () => {
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

    try {
      const prompt = `Geography (O Level style).\n\nQuestion: ${question}\n\nProvide a clear geography answer suitable for ${marks} marks.`;

      const result = await mutateAsync({ query: prompt, marks: marks });

      router.push({
        pathname: "/geography/solution",
        params: {
          question: question,
          marks: String(marks),
          mode: "theory",
          answer: result?.answer || result?.response || JSON.stringify(result),
        },
      });
    } catch (error) {
      setDialog({
        title: "Something went wrong",
        message: "Failed to generate answer. Please try again.",
      });
      console.error(error);
    }
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
              subtitle="Text-based structure with marks: 4 / 7 / 14"
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

              <Text style={styles.marksLabel}>Marks (answer length)</Text>

              <View style={styles.marksRow}>
                {[4, 7, 14].map((m) => (
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
