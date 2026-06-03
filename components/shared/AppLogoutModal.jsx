import { Ionicons } from "@expo/vector-icons";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

/** Same logout confirm dialog as Settings screen */
export default function AppLogoutModal({
  visible,
  onCancel,
  onConfirm,
  title = "Logout",
  message = "Are you sure you want to logout? You will need to login again.",
  cancelLabel = "Cancel",
  confirmLabel = "Yes, Logout",
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalIconWrap}>
            <Ionicons name="log-out-outline" size={32} color={Colors.danger} />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.modalActions}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [styles.modalBtnCancel, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.modalBtnCancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [styles.modalBtnLogout, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.modalBtnLogoutText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: { elevation: 16 },
    }),
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(251,113,133,0.12)",
    borderWidth: 1,
    borderColor: "rgba(251,113,133,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  modalActions: { flexDirection: "row", gap: 12, width: "100%" },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
  },
  modalBtnCancelText: {
    color: Colors.textSecondary,
    fontWeight: "700",
    fontSize: 15,
  },
  modalBtnLogout: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(251,113,133,0.15)",
    borderWidth: 1,
    borderColor: "rgba(251,113,133,0.4)",
    alignItems: "center",
  },
  modalBtnLogoutText: {
    color: Colors.danger,
    fontWeight: "800",
    fontSize: 15,
  },
});
