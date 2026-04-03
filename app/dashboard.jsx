import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../components/shared/AppDecor";
import SubjectCard from "../components/shared/SubjectCard";
import Colors from "../constants/Colors";
import { getProfile } from "../lib/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";

const recent = [
  { icon: "calculator-variant", text: "Solve quadratic equation", color: "#5EEAD4" },
  { icon: "chart-line", text: "Define inflation (Economics)", color: "#86EFAC" },
  { icon: "book-open-page-variant", text: "Causes of World War I", color: "#93C5FD" },
];

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState("Abdullah Rana");
  const [photoUri, setPhotoUri] = useState("");

  useFocusEffect(
    useCallback(() => {
      getProfile().then((p) => {
        if (p.displayName) setDisplayName(p.displayName);
        setPhotoUri(p.photoUri ?? "");
      });
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Token delete karein
              await AsyncStorage.removeItem("token");

              // 2. React Query ka cache saaf karein (Zaruri hai!)
              queryClient.clear();

              // 3. Welcome ya Login screen par bhej dein
              router.replace("/welcome");
            } catch (error) {
              Alert.alert("Error", "Logout nahi ho saka");
            }
          }
        }
      ]
    );
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12 }}
        >
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.push("/settings")}
              style={({ pressed }) => [
                styles.profilePress,
                pressed && { opacity: 0.92 },
              ]}
            >
              <LinearGradient
                colors={[Colors.primaryDark, Colors.primary]}
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
              <View style={styles.profileText}>
                <View style={styles.profileTitleRow}>
                  <Text style={styles.helloLabel}>Hello</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={18}
                    color={Colors.textMuted}
                  />
                </View>
                <Text style={styles.profileName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styles.profileRole}>O Level Student</Text>
              </View>
            </Pressable>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() =>
                  Alert.alert("Notifications", "No new notifications yet.")
                }
                style={styles.iconBtn}
                hitSlop={8}
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={Colors.white}
                />
              </Pressable>
              <Pressable
                onPress={handleLogout} // Pehle wala replace logic ab handleLogout mein hai
                style={styles.iconBtn}
                hitSlop={8}
              >
                {/* Aapka Logout Icon yahan aayega */}
                <Ionicons name="log-out-outline" size={24} color={Colors.white} />
              </Pressable>
            </View>
          </View>

          <LinearGradient
            colors={["rgba(63,183,168,0.25)", "rgba(79,209,197,0.08)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statInner}>
              <View style={styles.statIconWrap}>
                <MaterialCommunityIcons
                  name="chart-box-outline"
                  size={26}
                  color={Colors.accent}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>
                  Total questions asked
                </Text>
                <Text style={styles.statNumber}>25</Text>
              </View>
              <View style={[styles.statBadge, { marginLeft: 10 }]}>
                <Text style={styles.statBadgeText}>This week</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.sectionHead}>
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={20}
              color={Colors.accent}
            />
            <Text style={styles.sectionTitle}>Your subjects</Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            <SubjectCard
              title="Mathematics"
              icon="calculator-variant"
              onPress={() => router.push("/maths")}
            />
            <SubjectCard
              title="History"
              icon="book-open-page-variant"
              onPress={() => router.push("/history")}
            />
            <SubjectCard
              title="Geography"
              icon="earth"
              onPress={() => router.push("/geography")}
            />
            <SubjectCard
              title="Economics"
              icon="chart-line"
              onPress={() => router.push("/economics")}
            />
          </View>

          <View style={[styles.sectionHead, { marginTop: 22 }]}>
            <MaterialCommunityIcons
              name="history"
              size={20}
              color={Colors.accent}
            />
            <Text style={styles.sectionTitle}>Recent activity</Text>
          </View>

          <View style={styles.recentCard}>
            {recent.map((item, idx) => (
              <View
                key={item.text}
                style={[
                  styles.recentRow,
                  idx === recent.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View
                  style={[styles.recentDot, { backgroundColor: item.color }]}
                />
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={Colors.textMuted}
                  style={{ marginLeft: 12 }}
                />
                <Text style={styles.recentText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push("/onboarding")}
            style={({ pressed }) => [
              styles.tourBtn,
              pressed && { opacity: 0.9 },
            ]}
          >
            <View style={styles.tourBtnInner}>
              <MaterialCommunityIcons
                name="play-circle-outline"
                size={22}
                color={Colors.accent}
              />
              <Text style={styles.tourBtnText}>Replay intro tour</Text>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  profilePress: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    paddingVertical: 4,
    paddingRight: 8,
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  profileTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helloLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  profileName: {
    color: Colors.accent,
    fontWeight: "800",
    fontSize: 18,
    marginTop: 2,
  },
  profileRole: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  statCard: {
    borderRadius: 22,
    padding: 2,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  statInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statNumber: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 4,
  },
  statBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statBadgeText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 8,
    color: Colors.accent,
    fontSize: 17,
    fontWeight: "800",
  },
  recentCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  recentDot: {
    width: 4,
    height: 28,
    borderRadius: 2,
    marginRight: 12,
  },
  recentText: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  tourBtn: {
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.surfaceAlt,
    overflow: "hidden",
  },
  tourBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: "100%",
  },
  tourBtnText: {
    marginLeft: 10,
    color: Colors.accent,
    fontSize: 15,
    fontWeight: "700",
  },
});
