import { Pressable, Text } from "react-native";
import Colors from "../../constants/Colors";

export default function SecondaryButton({ title, handlePress, noMargin = false }) {
  return (
    <Pressable
      onPress={handlePress}
      className="py-4 rounded-2xl items-center"
      style={[
        {
          borderWidth: 1,
          borderColor: Colors.primary,
          backgroundColor: Colors.surface,
        },
        noMargin ? { marginBottom: 0 } : { marginBottom: 12 },
      ]}
    >
      <Text className="text-base font-semibold" style={{ color: Colors.white }}>
        {title}
      </Text>
    </Pressable>
  );
}
