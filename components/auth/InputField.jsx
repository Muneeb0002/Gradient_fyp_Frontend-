import { Text, TextInput, View } from "react-native";
import Colors from "../../constants/Colors";

export default function InputField({
  label,
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  error,
  ...rest
}) {
  const controlled = value !== undefined && onChangeText !== undefined;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: Colors.textSecondary }}>
        {label}
      </Text>

      <TextInput
        {...rest}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        secureTextEntry={secureTextEntry}
        {...(controlled ? { value, onChangeText } : {})}
        className="py-4 px-4 rounded-2xl"
        style={{
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: error ? Colors.danger : Colors.cardBorder,
          color: Colors.textPrimary,
        }}
      />

      {error ? (
        <Text style={{ color: Colors.danger, fontSize: 12, marginTop: 6, fontWeight: "600" }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
