import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AdminScreenShell from "../../../components/admin/AdminScreenShell";
import ListScreenToolbar from "../../../components/admin/ListScreenToolbar";
import PortalPageHeader from "../../../components/admin/PortalPageHeader";
import StudentPasswordModal from "../../../components/admin/StudentPasswordModal";
import ThemedConfirmModal from "../../../components/shared/ThemedConfirmModal";

import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";
import usePortalAlert from "../../../src/hooks/usePortalAlert";

// ✅ REAL API HOOK
import { useDeleteAdmin, useFetchUsers } from "../../../src/hooks/useFetchAdminUsers";




function UserRow({ item, onDelete, onPassword }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {item.firstName?.[0]}
          {item.lastName?.[0]}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.date}>
          Joined {new Date(item.createdAt).toDateString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => onPassword(item)}>
          <MaterialCommunityIcons name="key-outline" size={20} color={Colors.accent} />
        </Pressable>

        <Pressable onPress={() => onDelete(item)}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={Colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

export default function SuperAdminUsersScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [passwordTarget, setPasswordTarget] = useState(null);

  const { showAlert, AlertModal } = usePortalAlert();

  const { data, isLoading, isError, refetch } = useFetchUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteAdmin();

  const users = data?.data || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
    );
  }, [users, query]);

  // ✅ Actual delete function
  const confirmDelete = () => {
    if (!pendingDelete) return;

    deleteUser(pendingDelete.email, {
      onSuccess: () => {
        setPendingDelete(null);
        showAlert("User deleted successfully", "success");
      },
      onError: () => {
        setPendingDelete(null);
        showAlert("Failed to delete user", "error");
      },
    });
  };

  return (
    <AdminScreenShell scroll={false} contentStyle={styles.shell}>
      <PortalPageHeader
        title="Students"
        subtitle={`${users.length} users`}
        icon="school"
        accent="#60A5FA"
        onBack={() => router.back()}
      />

      <ListScreenToolbar
        total={filtered.length}
        label="users"
        query={query}
        onChangeQuery={setQuery}
        placeholder="Search users"
      />

      {isLoading && (
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          Loading users...
        </Text>
      )}

      {isError && (
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          Failed to load users
        </Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserRow
            item={item}
            onDelete={setPendingDelete}
            onPassword={setPasswordTarget}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />

      {/* ✅ DELETE — confirmDelete properly wired */}
      <ThemedConfirmModal
        visible={!!pendingDelete}
        title="Delete user"
        message={
          pendingDelete
            ? `Delete ${pendingDelete.firstName} ${pendingDelete.lastName}?`
            : ""
        }
        confirmLabel="Delete"
        destructive={true}
        onCancel={() => !isDeleting && setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />

      {/* PASSWORD */}
      <StudentPasswordModal
        visible={!!passwordTarget}
        studentName={
          passwordTarget
            ? `${passwordTarget.firstName} ${passwordTarget.lastName}`
            : ""
        }
        onClose={() => setPasswordTarget(null)}
        onSave={(pass) => {
          console.log("NEW PASSWORD:", pass);
          setPasswordTarget(null);
        }}
      />

      <AlertModal />
    </AdminScreenShell>
  );
}
const styles = StyleSheet.create({
  shell: { flex: 1, paddingBottom: 0 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  list: { paddingBottom: 110 },
  row: {
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  mainTap: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    paddingBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
  },
  initials: { color: Colors.accent, fontWeight: "800", fontSize: 15 },
  info: { flex: 1, marginLeft: 12 },
  name: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  email: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  date: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
  },
  badgeVerified: { backgroundColor: "rgba(79, 209, 197, 0.12)" },
  badgePending: { borderWidth: 1, borderColor: Colors.cardBorder },
  badgeText: { fontSize: 10, fontWeight: "800", color: Colors.textMuted },
  badgeTextVerified: { color: Colors.accent },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  actionBtn: { padding: 10 },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    gap: 8,
  },
  fabText: { color: Colors.white, fontWeight: "800", fontSize: 14 },
  empty: { alignItems: "center", paddingTop: 40 },
  emptyText: { color: Colors.textMuted, ...Typography.bodySmall },
});
