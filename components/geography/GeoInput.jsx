import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import Colors from "../../constants/Colors";

export default function GeoInput({ onSubmit, compact = false }) {
  const [text, setText] = useState("");

  return (
    <View>
      {!compact ? (
        <Text style={{ color: Colors.textSecondary }}>
          Enter your question (optional)
        </Text>
      ) : null}

      <TextInput
        placeholder="e.g. Explain Indus River system"
        placeholderTextColor={Colors.textMuted}
        value={text}
        onChangeText={setText}
        className={compact ? "p-4 rounded-2xl" : "mt-2 p-4 rounded-2xl"}
        style={{
          backgroundColor: Colors.surfaceAlt,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          color: Colors.white,
          minHeight: 100,
        }}
        multiline
      />

      <Pressable
        onPress={() => onSubmit({ text })}
        className="py-4 rounded-2xl items-center mt-4"
        style={{
          backgroundColor: Colors.primary,
          borderWidth: 1,
          borderColor: Colors.primaryDark,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Analyze</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
});
