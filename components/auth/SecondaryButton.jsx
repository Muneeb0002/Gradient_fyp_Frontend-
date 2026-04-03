import { Pressable, Text } from "react-native";
import Colors from "../../constants/Colors";

export default function SecondaryButton({ title, handlePress }) {
  return (
    <Pressable
      onPress={handlePress}
      className="py-4 rounded-2xl items-center mb-3"
      style={{
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.surface,
      }}
    >
      <Text className="text-base font-semibold" style={{ color: Colors.white }}>
        {title}
      </Text>
    </Pressable>
  );
}
