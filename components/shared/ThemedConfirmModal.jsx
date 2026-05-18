import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function ThemedConfirmModal({
  visible,
  title = "Confirm",
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Exit",
  onCancel,
  onConfirm,
  destructive = false,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.root}>
        <Pressable style={styles.dismissLayer} onPress={onCancel} />
        <View style={styles.center} pointerEvents="box-none">
          <View style={styles.card}>
            <View
              style={[
                styles.accentBar,
                destructive && { backgroundColor: Colors.danger },
              ]}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.actions}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.btn,
                  styles.btnCancel,
                  pressed && { opacity: 0.88 },
                ]}
              >
                <Text style={styles.btnCancelText}>{cancelLabel}</Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                style={({ pressed }) => [
                  styles.btn,
                  destructive ? styles.btnDanger : styles.btnConfirm,
                  pressed && { opacity: 0.88 },
                ]}
              >
                <Text style={styles.btnConfirmText}>{confirmLabel}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
  dismissLayer: { ...StyleSheet.absoluteFillObject },
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
  actions: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  btnCancel: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.cardBorder,
  },
  btnCancelText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },
  btnConfirm: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  btnDanger: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  btnConfirmText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
