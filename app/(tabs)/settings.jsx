import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/auth/InputField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AppDecor from "../../components/shared/AppDecor";
import Colors from "../../constants/Colors";
import { getProfile, saveProfile } from "../../lib/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUri, setPhotoUri] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const load = useCallback(async () => {
    const p = await getProfile();
    setDisplayName(p.displayName ?? "");
    setEmail(p.email ?? "");
    setPhotoUri(p.photoUri ?? "");
    setPassword("");
    setConfirmPassword("");
  }, []);

  useEffect(() => { void load(); }, [load]);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to set a profile photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      queryClient.clear();
      setShowLogoutModal(false);
      router.replace("/welcome");
    } catch {
      setShowLogoutModal(false);
      Alert.alert("Error", "Logout failed, try again.");
    }
  };

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      Alert.alert("Password mismatch", "New password and confirmation must match.");
      return;
    }
    await saveProfile({
      displayName: displayName.trim() || "Student",
      email: email.trim(),
      photoUri: photoUri || "",
      ...(password ? { password } : {}),
    });
    Alert.alert("Saved", "Your settings have been updated.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      style={{ flex: 1 }}
    >
      <AppDecor />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Page Header ── */}
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>Account</Text>
              <Text style={styles.pageSub}>Manage your profile and preferences</Text>
            </View>

            {/* ── Avatar Card ── */}
            <LinearGradient
              colors={["rgba(79,209,197,0.18)", "rgba(42,143,131,0.06)"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.avatarCard}
            >
              {/* Avatar */}
              <Pressable onPress={pickPhoto} style={styles.avatarWrap}>
                <LinearGradient
                  colors={[Colors.primaryDark, Colors.primary, Colors.accent]}
                  style={styles.avatarRing}
                >
                  <Image
                    source={photoUri ? { uri: photoUri } : require("../../assets/images/logo.png")}
                    style={styles.avatarImg}
                    resizeMode={photoUri ? "cover" : "contain"}
                  />
                </LinearGradient>
                <View style={styles.cameraFab}>
                  <MaterialCommunityIcons name="camera" size={16} color={Colors.white} />
                </View>
              </Pressable>

              <Text style={styles.avatarName}>{displayName || "Your Name"}</Text>
              <Text style={styles.avatarEmail}>{email || "—"}</Text>

              <View style={styles.avatarBadge}>
                <MaterialCommunityIcons name="school-outline" size={14} color={Colors.accent} />
                <Text style={styles.avatarBadgeText}>O Level Student</Text>
              </View>
            </LinearGradient>

            {/* ── Quick Stats Row ── */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxNum}>25</Text>
                <Text style={styles.statBoxLabel}>Questions</Text>
              </View>
              <View style={[styles.statBox, styles.statBoxMid]}>
                <Text style={styles.statBoxNum}>4</Text>
                <Text style={styles.statBoxLabel}>Subjects</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxNum}>A*</Text>
                <Text style={styles.statBoxLabel}>Target</Text>
              </View>
            </View>

            {/* ── Profile Info Card ── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="account-edit-outline" size={18} color={Colors.accent} />
                <Text style={styles.cardTitle}>Profile Information</Text>
              </View>
              <InputField
                label="Display Name"
                placeholder="Your name"
                value={displayName}
                onChangeText={setDisplayName}
              />
              <InputField
                label="Email Address"
                placeholder="you@school.edu"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* ── Security Card ── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="shield-lock-outline" size={18} color={Colors.accent} />
                <Text style={styles.cardTitle}>Security</Text>
              </View>
              <Text style={styles.hint}>Leave blank to keep your current password.</Text>
              <InputField
                label="New Password"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <InputField
                label="Confirm Password"
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* ── Save Button ── */}
            <View style={{ marginBottom: 16 }}>
              <PrimaryButton title="Save Changes" handlePress={handleSave} />
            </View>

            {/* ── App Info Card ── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="information-outline" size={18} color={Colors.accent} />
                <Text style={styles.cardTitle}>About</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>App</Text>
                <Text style={styles.infoValue}>Gradient FYP</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Focus</Text>
                <Text style={styles.infoValue}>O-Level Excellence</Text>
              </View>
            </View>

            {/* ── Logout Button ── */}
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.logoutInner}>
                <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
                <Text style={styles.logoutText}>Logout</Text>
              </View>
            </Pressable>

            <View style={{ height: 110 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ── Custom Logout Confirmation Modal ── */}
        <Modal
          visible={showLogoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              {/* Icon */}
              <View style={styles.modalIconWrap}>
                <Ionicons name="log-out-outline" size={32} color={Colors.danger} />
              </View>
              <Text style={styles.modalTitle}>Logout</Text>
              <Text style={styles.modalText}>
                Are you sure you want to logout? You will need to login again.
              </Text>
              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setShowLogoutModal(false)}
                  style={({ pressed }) => [styles.modalBtnCancel, pressed && { opacity: 0.8 }]}
                >
                  <Text style={styles.modalBtnCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={confirmLogout}
                  style={({ pressed }) => [styles.modalBtnLogout, pressed && { opacity: 0.85 }]}
                >
                  <Text style={styles.modalBtnLogoutText}>Yes, Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },

  pageHeader: { marginBottom: 20, paddingTop: 10 },
  pageTitle: { color: Colors.white, fontSize: 28, fontWeight: "800", letterSpacing: 0.3 },
  pageSub: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },

  avatarCard: {
    borderRadius: 24, padding: 24, marginBottom: 16,
    borderWidth: 1, borderColor: "rgba(79,209,197,0.2)",
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  avatarWrap: { width: 100, height: 100, marginBottom: 14 },
  avatarRing: { width: 100, height: 100, borderRadius: 50, padding: 3, alignItems: "center", justifyContent: "center" },
  avatarImg: { width: 94, height: 94, borderRadius: 47, backgroundColor: Colors.surface },
  cameraFab: {
    position: "absolute", right: 0, bottom: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primaryDark, borderWidth: 2, borderColor: Colors.backgroundStart,
    alignItems: "center", justifyContent: "center",
  },
  avatarName: { color: Colors.white, fontSize: 20, fontWeight: "800", textAlign: "center" },
  avatarEmail: { color: Colors.textSecondary, fontSize: 13, marginTop: 4, textAlign: "center" },
  avatarBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    marginTop: 12, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 999, backgroundColor: "rgba(79,209,197,0.1)",
    borderWidth: 1, borderColor: "rgba(79,209,197,0.25)",
  },
  avatarBadgeText: { color: Colors.accent, fontSize: 12, fontWeight: "700" },

  statsRow: { flexDirection: "row", marginBottom: 16, gap: 10 },
  statBox: {
    flex: 1, borderRadius: 18, padding: 14,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.cardBorder,
    alignItems: "center",
  },
  statBoxMid: { borderColor: "rgba(79,209,197,0.3)", backgroundColor: "rgba(79,209,197,0.07)" },
  statBoxNum: { color: Colors.accent, fontSize: 22, fontWeight: "800" },
  statBoxLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: "600", marginTop: 4 },

  card: {
    borderRadius: 22, padding: 18, marginBottom: 14,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.cardBorder,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  cardTitle: { color: Colors.accent, fontSize: 13, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  hint: { color: Colors.textMuted, fontSize: 12, marginBottom: 10, lineHeight: 18 },

  infoRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  infoLabel: { color: Colors.textMuted, fontSize: 14 },
  infoValue: { color: Colors.white, fontSize: 14, fontWeight: "600" },

  logoutBtn: {
    marginTop: 4, borderRadius: 18, borderWidth: 1,
    borderColor: "rgba(251,113,133,0.35)",
    backgroundColor: "rgba(251,113,133,0.08)",
    overflow: "hidden",
  },
  logoutInner: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 15, gap: 10,
  },
  logoutText: { color: Colors.danger, fontSize: 16, fontWeight: "800" },

  // Logout Modal
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
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 24 },
      android: { elevation: 16 },
    }),
  },
  modalIconWrap: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: "rgba(251,113,133,0.12)",
    borderWidth: 1, borderColor: "rgba(251,113,133,0.3)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: { color: Colors.white, fontSize: 22, fontWeight: "800", marginBottom: 8 },
  modalText: {
    color: Colors.textSecondary, fontSize: 14, lineHeight: 22,
    textAlign: "center", marginBottom: 24,
  },
  modalActions: { flexDirection: "row", gap: 12, width: "100%" },
  modalBtnCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1, borderColor: Colors.cardBorder,
    alignItems: "center",
  },
  modalBtnCancelText: { color: Colors.textSecondary, fontWeight: "700", fontSize: 15 },
  modalBtnLogout: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: "rgba(251,113,133,0.15)",
    borderWidth: 1, borderColor: "rgba(251,113,133,0.4)",
    alignItems: "center",
  },
  modalBtnLogoutText: { color: Colors.danger, fontWeight: "800", fontSize: 15 },
});
