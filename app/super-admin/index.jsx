import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text } from "react-native";
import AdminScreenShell from "../../components/admin/AdminScreenShell";
import ManagementGrid from "../../components/admin/ManagementGrid";
import PortalMenuCard from "../../components/admin/PortalMenuCard";
import PortalPageHeader from "../../components/admin/PortalPageHeader";
import ProfileHeroCard from "../../components/admin/ProfileHeroCard";
import StatGrid from "../../components/admin/StatGrid";
import AppLogoutButton from "../../components/shared/AppLogoutButton";
import AppLogoutModal from "../../components/shared/AppLogoutModal";
import {
  MOCK_HISTORY,
  SUPER_ADMIN_OVERVIEW_STATS,
  SUPER_ADMIN_PROFILE,
} from "../../constants/adminPortalData";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import { clearAuthSession } from "../../lib/authSession";
import { usePortalAdmins } from "../../src/context/PortalAdminsContext";
import { usePortalStudents } from "../../src/context/PortalStudentsContext";
import { useFetchAdminHistory, useFetchAdmins, useFetchUsers } from "../../src/hooks/useFetchAdminUsers";
import usePortalProfile from "../../src/hooks/usePortalProfile";
import usePortalRootBack from "../../src/hooks/usePortalRootBack";

export default function SuperAdminDashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profile = usePortalProfile(SUPER_ADMIN_PROFILE);
  const { admins } = usePortalAdmins();
  const { students } = usePortalStudents();
  const [logoutVisible, setLogoutVisible] = useState(false);
  usePortalRootBack(true);

  const { 
    data: adminsData, 
    isLoading: isAdminLoading, 
  } = useFetchAdmins();

  const { 
    data: apiResponse, 
    isLoading: isHistoryLoading, 
  } = useFetchAdminHistory();

  const { 
    data: usersData, 
    isLoading: isUsersLoading, 
  } = useFetchUsers();

  const displayName = profile.displayName ?? SUPER_ADMIN_PROFILE.displayName;
  const email = profile.email ?? SUPER_ADMIN_PROFILE.email;

const adminsCount = adminsData?.total ?? admins.length ?? 0;
const usersCount = usersData?.total ?? students.length ?? 0;
const historyCount = apiResponse?.total ?? MOCK_HISTORY.length ?? 0;
  const stats = useMemo(
    () =>
      SUPER_ADMIN_OVERVIEW_STATS.map((s) => {
        if (s.id === "admins") {
          return { 
            ...s, 
            value: isAdminLoading ? "..." : String(adminsCount) 
          };
        }
        if (s.id === "users") {
          return { 
            ...s, 
            value: isUsersLoading ? "..." : String(usersCount) 
          };
        }
        if (s.id === "sessions") {
          return { 
            ...s, 
            value: isHistoryLoading ? "..." : String(historyCount) 
          };
        }
        return s;
      }),
    // ✅ FIX: API data dependencies mein add ki
    [adminsCount, usersCount, historyCount, isAdminLoading, isUsersLoading, isHistoryLoading],
  );

  const managementItems = useMemo(
    () => [
      {
        key: "admins",
        title: "Administrators",
        subtitle: "Create & manage team",
        icon: "account-tie",
        count: adminsCount, // ✅ API data
        colors: ["rgba(251, 191, 36, 0.18)", Colors.surface],
        onPress: () => router.push("/super-admin/admins"),
      },
      {
        key: "students",
        title: "Students",
        subtitle: "Full student CRUD",
        icon: "school",
        count: usersCount, // ✅ API data
        colors: ["rgba(96, 165, 250, 0.15)", Colors.surface],
        onPress: () => router.push("/super-admin/users"),
      },
      {
        key: "history",
        title: "Chat history",
        subtitle: "Every AI session",
        icon: "message-text",
        count: historyCount, // ✅ API data
        colors: ["rgba(167, 139, 250, 0.15)", Colors.surface],
        onPress: () => router.push("/super-admin/history"),
      },
      {
        key: "new-admin",
        title: "New admin",
        subtitle: "Add team member",
        icon: "account-plus",
        colors: ["rgba(79, 209, 197, 0.18)", Colors.surface],
        onPress: () => router.push("/super-admin/admins/create"),
      },
    ],
    [adminsCount, usersCount, historyCount, router],
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
        title="Control Center"
        subtitle="Manage admins, students, and platform activity"
        icon="crown"
        accent="#FBBF24"
        showBack={false}
      />

      <ProfileHeroCard
        name={displayName}
        email={email}
        roleLabel="Super Administrator"
        icon="crown"
      />

      <Text style={styles.sectionLabel}>Live metrics</Text>
      <StatGrid items={stats} columns={4} />

      <Text style={[styles.sectionLabel, styles.sectionGap]}>Management</Text>
      <ManagementGrid items={managementItems} />

      <Text style={[styles.sectionLabel, styles.sectionGap]}>Shortcuts</Text>
      <PortalMenuCard
        title="Add student"
        subtitle="Register a new learner"
        icon="account-school-outline"
        onPress={() => router.push("/super-admin/users/create")}
      />

      <AppLogoutButton onPress={() => setLogoutVisible(true)} />

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
});