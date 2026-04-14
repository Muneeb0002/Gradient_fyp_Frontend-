import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Modal, Pressable, ScrollView,
  Text, View, Platform, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import SubjectCard from "../../components/shared/SubjectCard";
import Colors from "../../constants/Colors";
import { getProfile } from "../../lib/storage";


const recent = [
  { icon: "calculator-variant", text: "Solve quadratic equation", color: "#5EEAD4" },
  { icon: "chart-line", text: "Define inflation (Economics)", color: "#86EFAC" },
  { icon: "book-open-page-variant", text: "Causes of World War I", color: "#93C5FD" },
];

export default function HomeTab() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const authMessage = params?.authMessage;
  const [displayName, setDisplayName] = useState("Student");
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showBanner, setShowBanner] = useState(Boolean(authMessage));

  useFocusEffect(
    useCallback(() => {
      getProfile().then((p) => {
        if (p?.displayName) setDisplayName(p.displayName);
      });
    }, [])
  );

  useEffect(() => {
    setShowBanner(Boolean(authMessage));
    if (!authMessage) return;
    const t = setTimeout(() => setShowBanner(false), 2600);
    return () => clearTimeout(t);
  }, [authMessage]);


  return (
    <LinearGradient
      colors={[Colors.backgroundStart, Colors.backgroundMiddle, Colors.backgroundEnd]}
      style={{ flex: 1 }}
    >
      <AppDecor />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Welcome Banner after login */}
          {showBanner ? (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{authMessage}</Text>
            </View>
          ) : null}

          {/* Top Row: greeting + actions (NO settings icon here anymore) */}
          <View style={styles.topRow}>
            <View>
              <Text style={styles.hello}>Hello,</Text>
              <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => setShowNotifModal(true)} style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={22} color={Colors.white} />
              </Pressable>
            </View>
          </View>

          {/* Stats card */}
          <LinearGradient
            colors={["rgba(63,183,168,0.25)", "rgba(79,209,197,0.06)"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statInner}>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons name="chart-box-outline" size={26} color={Colors.accent} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.statLabel}>Total questions asked</Text>
                <Text style={styles.statNum}>25</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeTxt}>This week</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Subjects */}
          <View style={styles.sectionHead}>
            <MaterialCommunityIcons name="view-grid-outline" size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Your subjects</Text>
          </View>
          <View style={styles.subjectGrid}>
            <SubjectCard title="Mathematics" icon="calculator-variant" onPress={() => router.push("/maths")} />
            <SubjectCard title="History" icon="book-open-page-variant" onPress={() => router.push("/history")} />
            <SubjectCard title="Geography" icon="earth" onPress={() => router.push("/geography")} />
            <SubjectCard title="Economics" icon="chart-line" onPress={() => router.push("/economics")} />
          </View>

          {/* Recent Activity */}
          <View style={[styles.sectionHead, { marginTop: 22 }]}>
            <MaterialCommunityIcons name="history" size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Recent activity</Text>
          </View>
          <View style={styles.recentCard}>
            {recent.map((item, idx) => (
              <View key={item.text} style={[styles.recentRow, idx === recent.length - 1 && { marginBottom: 0 }]}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <MaterialCommunityIcons name={item.icon} size={20} color={Colors.textMuted} style={{ marginLeft: 12 }} />
                <Text style={styles.recentText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Replay Intro Tour */}
          <Pressable
            onPress={() => router.push("/onboarding")}
            style={({ pressed }) => [styles.tourBtn, pressed && { opacity: 0.88 }]}
          >
            <View style={styles.tourBtnInner}>
              <MaterialCommunityIcons name="play-circle-outline" size={22} color={Colors.accent} />
              <Text style={styles.tourBtnText}>Replay intro tour</Text>
            </View>
          </Pressable>
        </ScrollView>

        {/* Notifications Modal */}
        <Modal visible={showNotifModal} transparent animationType="fade" onRequestClose={() => setShowNotifModal(false)}>
          <View style={styles.backdrop}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <Text style={styles.modalText}>No new notifications yet.</Text>
              <Pressable onPress={() => setShowNotifModal(false)} style={{ marginTop: 18, alignSelf: "flex-end" }}>
                <Text style={{ color: Colors.accent, fontWeight: "800", fontSize: 15 }}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 110 },
  banner: { marginBottom: 16, padding: 14, borderRadius: 18, backgroundColor: "rgba(79,209,197,0.12)", borderWidth: 1, borderColor: "rgba(79,209,197,0.35)" },
  bannerText: { color: Colors.accent, fontWeight: "800" },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22, paddingTop: 8 },
  hello: { color: Colors.textSecondary, fontSize: 13, fontWeight: "600" },
  name: { color: Colors.accent, fontWeight: "800", fontSize: 22, marginTop: 2, maxWidth: 200 },
  actions: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.cardBorder, alignItems: "center", justifyContent: "center" },
  statCard: { borderRadius: 22, padding: 2, marginBottom: 24, ...Platform.select({ ios: { shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12 }, android: { elevation: 6 } }) },
  statInner: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, borderRadius: 20, padding: 16 },
  statIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.surfaceAlt, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.cardBorder },
  statLabel: { color: Colors.textSecondary, fontSize: 13 },
  statNum: { color: Colors.white, fontSize: 32, fontWeight: "800", marginTop: 4 },
  statBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.cardBorder, marginLeft: 10 },
  statBadgeTxt: { color: Colors.textMuted, fontSize: 11, fontWeight: "700" },
  sectionHead: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitle: { marginLeft: 8, color: Colors.accent, fontSize: 17, fontWeight: "800" },
  subjectGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  recentCard: { borderRadius: 20, padding: 16, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.cardBorder },
  recentRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  dot: { width: 4, height: 28, borderRadius: 2, marginRight: 12 },
  recentText: { flex: 1, color: Colors.white, fontSize: 15, lineHeight: 22, fontWeight: "500" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", paddingHorizontal: 24 },
  modal: { borderRadius: 22, padding: 18, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.cardBorder },
  modalTitle: { color: Colors.white, fontSize: 22, fontWeight: "800" },
  modalText: { color: Colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 8 },
  btnCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.cardBorder, backgroundColor: Colors.surfaceAlt },
  btnDanger: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.primaryDark, backgroundColor: Colors.primary },
  tourBtn: { marginTop: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.cardBorder, backgroundColor: Colors.surfaceAlt, overflow: "hidden" },
  tourBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, paddingHorizontal: 16 },
  tourBtnText: { marginLeft: 10, color: Colors.accent, fontSize: 15, fontWeight: "700" },
});
