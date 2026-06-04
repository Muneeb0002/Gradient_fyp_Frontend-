import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

export default function PrimaryButton({
  title,
  handlePress,
  isLoading = false,
  noMargin = false,
}) {
  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      className="py-4 rounded-2xl items-center active:opacity-80"
      style={[
        styles.base,
        noMargin ? styles.noMargin : styles.withMargin,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.white} />
      ) : typeof title === "string" ? (
        <Text style={styles.label}>{title}</Text>
      ) : (
        title
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  withMargin: {
    marginBottom: 12,
  },
  noMargin: {
    marginBottom: 0,
  },
  label: {
    color: Colors.white,
    ...Typography.button,
  },
});
