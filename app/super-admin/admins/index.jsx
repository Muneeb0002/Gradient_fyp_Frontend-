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
import Typography from "../../../constants/Typography";
import usePortalAlert from "../../../src/hooks/usePortalAlert";

import { useDeleteAdmin, useFetchAdmins } from "../../../src/hooks/useFetchAdminUsers";

function AdminRow({ item, onDelete }) {
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
          Added {new Date(item.createdAt).toDateString()}
        </Text>
      </View>

      <Pressable
        onPress={() => onDelete(item)}
        style={({ pressed }) => [
          styles.deleteBtn,
          pressed && { opacity: 0.7 },
        ]}
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
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const { showAlert, AlertModal } = usePortalAlert();

  const { data, isLoading, isError, refetch } = useFetchAdmins();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  const admins = data?.data || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return admins;
    return admins.filter(
      (a) =>
        a.email?.toLowerCase().includes(q) ||
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q)
    );
  }, [admins, query]);

  const onRefresh = async () => {
    await refetch();
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteAdmin(pendingDelete.email, {
      onSuccess: () => {
        setPendingDelete(null);
        showAlert("Admin delete ho gaya!", "success");
      },
      onError: () => {
        setPendingDelete(null);
        showAlert("Delete fail hua!", "error");
      },
    });
  };

  return (
    <AdminScreenShell scroll={false} contentStyle={styles.shell}>
      <PortalPageHeader
        title="Administrators"
        subtitle="Manage platform administrators"
        icon="account-tie"
        accent="#FBBF24"
        onBack={() => router.back()}
        rightAction={
          <Pressable
            onPress={() => router.push("/super-admin/admins/create")}
            style={styles.addBtn}
          >
            <MaterialCommunityIcons name="plus" size={22} color="white" />
          </Pressable>
        }
      />

      <ListScreenToolbar
        total={filtered.length}
        label="admins"
        query={query}
        onChangeQuery={setQuery}
        placeholder="Search admins"
      />

      {isLoading && (
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          Loading admins...
        </Text>
      )}

      {isError && (
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          Failed to load admins
        </Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AdminRow item={item} onDelete={setPendingDelete} />
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />

      <ThemedConfirmModal
        visible={!!pendingDelete}
        title="Delete admin"
        message={
          pendingDelete
            ? `Delete ${pendingDelete.firstName} ${pendingDelete.lastName}?`
            : ""
        }
        onCancel={() => !isDeleting && setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
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
  empty: { alignItems: "center", paddingTop: 48, paddingHorizontal: 24 },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 12,
    ...Typography.bodySmall,
  },
});