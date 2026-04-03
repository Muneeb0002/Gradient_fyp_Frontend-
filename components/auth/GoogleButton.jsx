import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import GoogleIcon from "./GoogleIcon";

export default function GoogleButton({ handlePress, isLoading = false }) {
  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      className="py-4 rounded-2xl items-center active:opacity-80"
      style={{ backgroundColor: Colors.white, borderWidth: 1, borderColor: "#DDE3EA" }}
    >
      <View className="flex-row items-center gap-3">
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <>
            <GoogleIcon size={22} />
            <Text
              className="text-base font-medium"
              style={{ color: Colors.black }}
            >
              Continue with Google
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}
