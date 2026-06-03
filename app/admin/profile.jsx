import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AdminScreenShell from "../../components/admin/AdminScreenShell";
import PortalPageHeader from "../../components/admin/PortalPageHeader";
import ProfileHeroCard from "../../components/admin/ProfileHeroCard";
import SectionCard from "../../components/shared/SectionCard";
import { ADMIN_PROFILE } from "../../constants/adminPortalData";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import usePortalProfile from "../../src/hooks/usePortalProfile";

function DetailRow({ label, value, icon }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons name={icon} size={20} color={Colors.accent} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function AdminProfileScreen() {
  const router = useRouter();
  const profile = usePortalProfile(ADMIN_PROFILE);
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <AdminScreenShell>
      <PortalPageHeader
        title="Profile"
        subtitle="Your administrator account"
        icon="account-outline"
        onBack={() => router.back()}
      />

      <ProfileHeroCard
        name={fullName}
        email={profile.email}
        roleLabel="Administrator"
        meta={`Joined ${profile.joinedAt}`}
      />

      <SectionCard label="Account details" icon="card-account-details-outline">
        <DetailRow label="First name" value={profile.firstName} icon="account" />
        <DetailRow label="Last name" value={profile.lastName} icon="account-outline" />
        <DetailRow label="Email" value={profile.email} icon="email-outline" />
        <DetailRow label="Role" value="Administrator" icon="shield-check-outline" />
      </SectionCard>

      <SectionCard label="Preferences" icon="tune" style={styles.prefs}>
        <Pressable
          onPress={() => setNotifyEnabled((v) => !v)}
          style={({ pressed }) => [styles.toggleRow, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.toggleLabel}>Email notifications</Text>
          <View style={[styles.toggle, notifyEnabled && styles.toggleOn]}>
            <View style={[styles.knob, notifyEnabled && styles.knobOn]} />
          </View>
        </Pressable>
      </SectionCard>
    </AdminScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
  },
  rowText: { flex: 1, marginLeft: 12 },
  rowLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  rowValue: {
    color: Colors.white,
    marginTop: 2,
    ...Typography.bodySmall,
  },
  prefs: { marginTop: 16 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabel: { color: Colors.textSecondary, fontWeight: "600", fontSize: 14 },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.inputBorder,
    padding: 3,
    justifyContent: "center",
  },
  toggleOn: { backgroundColor: Colors.primaryDark },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.textMuted,
  },
  knobOn: { alignSelf: "flex-end", backgroundColor: Colors.accent },
});
