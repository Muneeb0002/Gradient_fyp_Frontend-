import { Text, TextInput, View } from "react-native";
import Colors from "../../constants/Colors";

export default function InputField({
  label,
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
}) {
  const controlled = value !== undefined && onChangeText !== undefined;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: Colors.textSecondary }}>
        {label}
      </Text>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        secureTextEntry={secureTextEntry}
        {...(controlled ? { value, onChangeText } : {})}
        className="py-4 px-4 rounded-2xl"
        style={{
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          color: Colors.textPrimary,
        }}
      />
    </View>
  );
}
