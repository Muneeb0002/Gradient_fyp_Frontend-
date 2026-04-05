import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Colors from "../../constants/Colors";

export default function InputField({
  label,
  placeholder,
  secureTextEntry = false,
  passwordToggle = false,
  value,
  onChangeText,
  error,
  ...rest
}) {
  const controlled = value !== undefined && onChangeText !== undefined;
  const [passwordHidden, setPasswordHidden] = useState(true);
  const effectiveSecure = passwordToggle ? passwordHidden : secureTextEntry;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: Colors.textSecondary }}>
        {label}
      </Text>

      <View style={{ position: "relative" }}>
        <TextInput
          {...rest}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={effectiveSecure}
          {...(controlled ? { value, onChangeText } : {})}
          className="py-4 rounded-2xl"
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: error ? Colors.danger : Colors.cardBorder,
            color: Colors.textPrimary,
            paddingLeft: 16,
            paddingRight: passwordToggle ? 48 : 16,
          }}
        />
        {passwordToggle ? (
          <Pressable
            onPress={() => setPasswordHidden((h) => !h)}
            hitSlop={10}
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
            accessibilityLabel={passwordHidden ? "Show password" : "Hide password"}
          >
            <Ionicons
              name={passwordHidden ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={Colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={{ color: Colors.danger, fontSize: 12, marginTop: 6, fontWeight: "600" }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
