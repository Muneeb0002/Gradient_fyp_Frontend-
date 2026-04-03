import { Text, TextInput, View } from "react-native";
import Colors from "../../constants/Colors";

export default function QuestionInput({
  hideLabel = false,
  value,
  onChangeText,
}) {
  const controlled = value !== undefined && onChangeText !== undefined;
  return (
    <View className="mb-4">
      {!hideLabel ? (
        <Text style={{ color: Colors.textSecondary }}>Enter your question</Text>
      ) : null}

      <TextInput
        placeholder="Type your question..."
        placeholderTextColor={Colors.textMuted}
        multiline
        className={hideLabel ? "p-4 rounded-2xl" : "mt-2 p-4 rounded-2xl"}
        style={{
          backgroundColor: Colors.surfaceAlt,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          color: Colors.white,
          minHeight: 120,
        }}
        {...(controlled
          ? { value, onChangeText }
          : {})}
      />
    </View>
  );
}
