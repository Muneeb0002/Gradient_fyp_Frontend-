import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/auth/InputField";
import PrimaryButton from "../components/auth/PrimaryButton";
import AppDecor from "../components/shared/AppDecor";
import Colors from "../constants/Colors";
import { getProfile, saveProfile } from "../lib/storage";

export default function SettingsScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUri, setPhotoUri] = useState("");

  const load = useCallback(async () => {
    const p = await getProfile();
    setDisplayName(p.displayName ?? "");
    setEmail(p.email ?? "");
    setPhotoUri(p.photoUri ?? "");
    setPassword("");
    setConfirmPassword("");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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

  const clearPhoto = () => {
    Alert.alert("Remove photo?", "Your default app logo will show on the dashboard.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setPhotoUri("") },
    ]);
  };

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      className="flex-1"
    >
      <AppDecor />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backPill, pressed && { opacity: 0.88 }]}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={22}
                color={Colors.white}
              />
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            <LinearGradient
              colors={["rgba(63,183,168,0.2)", "rgba(15,31,59,0.4)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[Colors.primaryDark, Colors.primary, Colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarRing}
                >
                  <Image
                    source={
                      photoUri
                        ? { uri: photoUri }
                        : require("../assets/images/logo.png")
                    }
                    style={styles.avatarImg}
                    resizeMode={photoUri ? "cover" : "contain"}
                  />
                </LinearGradient>
                <Pressable
                  onPress={pickPhoto}
                  style={({ pressed }) => [
                    styles.cameraFab,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={20}
                    color={Colors.white}
                  />
                </Pressable>
              </View>

              <Text style={styles.heroTitle}>Settings</Text>
              <Text style={styles.heroSub}>
                Update your photo, name, and security — saved on this device.
              </Text>

              <View style={styles.photoActions}>
                <Pressable onPress={pickPhoto} style={styles.linkBtn}>
                  <MaterialCommunityIcons
                    name="image-edit-outline"
                    size={18}
                    color={Colors.accent}
                  />
                  <Text style={styles.linkBtnText}>Choose from gallery</Text>
                </Pressable>
                {photoUri ? (
                  <Pressable
                    onPress={clearPhoto}
                    style={[styles.linkBtnMuted, { marginTop: 4 }]}
                  >
                    <Text style={styles.linkBtnMutedText}>Remove photo</Text>
                  </Pressable>
                ) : null}
              </View>
            </LinearGradient>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Profile</Text>
              <InputField
                label="Display name"
                placeholder="Your name"
                value={displayName}
                onChangeText={setDisplayName}
              />
              <InputField
                label="Email"
                placeholder="you@school.edu"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Security</Text>
              <Text style={styles.hint}>
                Leave password blank to keep your current one (demo).
              </Text>
              <InputField
                label="New password"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <InputField
                label="Confirm password"
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <PrimaryButton
              title="Save changes"
              handlePress={async () => {
                if (password && password !== confirmPassword) {
                  Alert.alert(
                    "Password mismatch",
                    "New password and confirmation must match."
                  );
                  return;
                }
                await saveProfile({
                  displayName: displayName.trim() || "Abdullah Rana",
                  email: email.trim(),
                  photoUri: photoUri || "",
                  ...(password ? { password } : {}),
                });
                Alert.alert("Saved", "Your settings have been updated.", [
                  { text: "OK", onPress: () => router.back() },
                ]);
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 40,
    paddingTop: 8,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  backText: {
    marginLeft: 4,
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  heroCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  avatarContainer: {
    width: 112,
    height: 112,
    alignSelf: "center",
    marginBottom: 16,
  },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: Colors.surface,
  },
  cameraFab: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryDark,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: { elevation: 6 },
    }),
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  heroSub: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  photoActions: {
    marginTop: 16,
    alignItems: "center",
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  linkBtnText: {
    marginLeft: 8,
    color: Colors.accent,
    fontSize: 15,
    fontWeight: "700",
  },
  linkBtnMuted: {
    paddingVertical: 4,
  },
  linkBtnMutedText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardTitle: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  hint: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 18,
  },
});
