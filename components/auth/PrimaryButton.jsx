import { ActivityIndicator, Pressable, Text } from "react-native";
import Colors from "../../constants/Colors";

export default function PrimaryButton({
  title,
  handlePress,
  isLoading = false,
}) {
  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      className="py-4 rounded-2xl items-center mb-3 active:opacity-80"
      style={{
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderColor: Colors.primaryDark,
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text
          className="text-base font-bold tracking-wide"
          style={{ color: Colors.white }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
