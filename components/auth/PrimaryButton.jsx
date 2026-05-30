import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

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
        <Text style={styles.label}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.white,
    ...Typography.button,
  },
});
