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
import ThemedConfirmModal from "../../../components/shared/ThemedConfirmModal";
import Colors from "../../../constants/Colors";
import { PORTAL_ALERTS } from "../../../constants/portalAlertMessages";
import Typography from "../../../constants/Typography";
import { usePortalAdmins } from "../../../src/context/PortalAdminsContext";
import usePortalAlert from "../../../src/hooks/usePortalAlert";

function AdminRow({ item, onDelete }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {item.firstName[0]}
          {item.lastName[0]}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.date}>Added {item.createdAt}</Text>
      </View>
      <Pressable
        onPress={() => onDelete(item)}
        hitSlop={12}
        style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.85 }]}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={22}
          color={Colors.danger}
        />
      </Pressable>
    </View>
  );
}

export default function SuperAdminAdminsScreen() {
  const router = useRouter();
  const { admins, removeAdmin, resetAdmins } = usePortalAdmins();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { showAlert, AlertModal } = usePortalAlert();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return admins;
    return admins.filter(
      (a) =>
        a.email.toLowerCase().includes(q) ||
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q),
    );
  }, [admins, query]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      resetAdmins();
      setRefreshing(false);
    }, 700);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const name = `${pendingDelete.firstName} ${pendingDelete.lastName}`;
    removeAdmin(pendingDelete.id);
    setPendingDelete(null);
    const { title, message } = PORTAL_ALERTS.adminRemoved(name);
    showAlert(title, message);
  };

  return (
    <AdminScreenShell scroll={false} contentStyle={styles.shell}>
      <PortalPageHeader
        title="Administrators"
        subtitle="Manage platform administrators"
        icon="account-tie"
        accent="#FBBF24"
        onBack={() => router.replace("/super-admin")}
        rightAction={
          <Pressable
            onPress={() => router.push("/super-admin/admins/create")}
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.88 }]}
          >
            <MaterialCommunityIcons name="plus" size={22} color={Colors.white} />
          </Pressable>
        }
      />

      <ListScreenToolbar
        total={filtered.length}
        label="admins"
        query={query}
        onChangeQuery={setQuery}
        placeholder="Search by name or email"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdminRow item={item} onDelete={setPendingDelete} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="account-search-outline"
              size={48}
              color={Colors.textMuted}
            />
            <Text style={styles.emptyText}>No administrators match your search.</Text>
          </View>
        }
      />

      <Pressable
        onPress={() => router.push("/super-admin/admins/create")}
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.92 }]}
      >
        <MaterialCommunityIcons name="account-plus" size={26} color={Colors.white} />
        <Text style={styles.fabText}>New admin</Text>
      </Pressable>

      <ThemedConfirmModal
        visible={!!pendingDelete}
        title="Remove administrator"
        message={
          pendingDelete
            ? `Remove ${pendingDelete.firstName} ${pendingDelete.lastName}? This cannot be undone.`
            : ""
        }
        cancelLabel="Cancel"
        confirmLabel="Remove"
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
  },
  initials: { color: Colors.accent, fontWeight: "800", fontSize: 16 },
  info: { flex: 1, marginLeft: 12, marginRight: 8 },
  name: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  email: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  date: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
  deleteBtn: { padding: 8 },
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
  empty: { alignItems: "center", paddingTop: 48, paddingHorizontal: 24 },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 12,
    ...Typography.bodySmall,
  },
});
