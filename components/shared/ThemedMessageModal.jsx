import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

/**
 * App-themed dialog (dark surface + teal accents) instead of system Alert.
 */
export default function ThemedMessageModal({
  visible,
  title = "Notice",
  message,
  onClose,
  confirmLabel = "OK",
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.dismissLayer} onPress={onClose} />
        <View style={styles.center} pointerEvents="box-none">
          <View style={styles.card}>
            <View style={styles.accentBar} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.buttonText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  dismissLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 0,
    overflow: "hidden",
  },
  accentBar: {
    height: 3,
    backgroundColor: Colors.accent,
    marginHorizontal: -20,
    marginBottom: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});
