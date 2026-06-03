import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import AdminScreenShell from "../../components/admin/AdminScreenShell";
import PortalMenuCard from "../../components/admin/PortalMenuCard";
import PortalPageHeader from "../../components/admin/PortalPageHeader";
import AppLogoutButton from "../../components/shared/AppLogoutButton";
import AppLogoutModal from "../../components/shared/AppLogoutModal";
import ProfileHeroCard from "../../components/admin/ProfileHeroCard";
import StatGrid from "../../components/admin/StatGrid";
import SectionCard from "../../components/shared/SectionCard";
import ThemedMessageModal from "../../components/shared/ThemedMessageModal";
import { ADMIN_OVERVIEW_STATS, ADMIN_PROFILE } from "../../constants/adminPortalData";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import { clearAuthSession } from "../../lib/authSession";
import { usePortalStudents } from "../../src/context/PortalStudentsContext";
import usePortalProfile from "../../src/hooks/usePortalProfile";
import usePortalRootBack from "../../src/hooks/usePortalRootBack";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = usePortalProfile(ADMIN_PROFILE);
  const { students } = usePortalStudents();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  usePortalRootBack(true);

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const stats = ADMIN_OVERVIEW_STATS.map((s) =>
    s.id === "students" ? { ...s, value: String(students.length) } : s,
  );

  const handleLogout = async () => {
    setLogoutVisible(false);
    await clearAuthSession();
    queryClient.clear();
    router.replace("/welcome");
  };

  return (
    <AdminScreenShell>
      <PortalPageHeader
        title="Admin Portal"
        subtitle="Operations dashboard for your team"
        icon="shield-account"
        showBack={false}
      />

      <ProfileHeroCard
        name={fullName}
        email={profile.email}
        roleLabel="Administrator"
        meta={`Member since ${profile.joinedAt}`}
      />

      <Text style={styles.sectionLabel}>Overview</Text>
      <StatGrid items={stats} />

      <Text style={[styles.sectionLabel, styles.sectionGap]}>Quick access</Text>
      <PortalMenuCard
        title="My profile"
        subtitle="Account details and preferences"
        icon="account-circle-outline"
        onPress={() => router.push("/admin/profile")}
      />
      <PortalMenuCard
        title="Students"
        subtitle="View list · reset passwords only"
        icon="school-outline"
        badge={String(students.length)}
        onPress={() => router.push("/admin/students")}
      />
      <PortalMenuCard
        title="Team directory"
        subtitle="Administrator roster overview"
        icon="account-group-outline"
        showChevron={false}
        onPress={() =>
          setInfoModal({
            title: "Team directory",
            message:
              "The full administrator roster is managed in the Control Center by the Super Administrator.",
          })
        }
      />

      <SectionCard label="Your role" icon="information-outline" style={styles.infoCard}>
        <Text style={styles.infoText}>
          You may view students and reset their passwords. Creating or removing
          students and admins is handled by the Super Administrator.
        </Text>
      </SectionCard>

      <AppLogoutButton onPress={() => setLogoutVisible(true)} />

      <ThemedMessageModal
        visible={!!infoModal}
        title={infoModal?.title ?? ""}
        message={infoModal?.message ?? ""}
        onClose={() => setInfoModal(null)}
        confirmLabel="OK"
      />

      <AppLogoutModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />
    </AdminScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: Colors.textMuted,
    ...Typography.sectionLabel,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionGap: {
    marginTop: 20,
  },
  infoCard: {
    marginTop: 8,
  },
  infoText: {
    color: Colors.textSecondary,
    ...Typography.bodySmall,
    lineHeight: 22,
  },
});
