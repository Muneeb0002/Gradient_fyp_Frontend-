import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import InputField from "../auth/InputField";
import PrimaryButton from "../auth/PrimaryButton";
import Colors from "../../constants/Colors";
import { validateStudentSignupPassword } from "../../lib/formValidation";

export default function StudentPasswordModal({
  visible,
  studentName,
  onClose,
  onSave,
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const err = validateStudentSignupPassword(password);
    if (err) {
      setError(err);
      return;
    }
    onSave(password);
    setPassword("");
    setError("");
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.card}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.message}>
            Set a new password for {studentName}. They will use this on next login.
          </Text>
          <InputField
            label="New password"
            placeholder="Min 8 chars + special"
            secureTextEntry
            passwordToggle
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError("");
            }}
            error={error}
          />
          <PrimaryButton title="Save password" handlePress={handleSave} />
          <Pressable onPress={handleClose} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center", padding: 24 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  card: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  title: { color: Colors.white, fontSize: 18, fontWeight: "800" },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  cancel: { alignItems: "center", marginTop: 12 },
  cancelText: { color: Colors.textMuted, fontWeight: "600" },
});
