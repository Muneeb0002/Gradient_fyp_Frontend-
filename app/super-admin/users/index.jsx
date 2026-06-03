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
import { PORTAL_ALERTS } from "../../../constants/portalAlertMessages";
import { usePortalStudents } from "../../../src/context/PortalStudentsContext";
import usePortalAlert from "../../../src/hooks/usePortalAlert";

function UserRow({ item, onEdit, onDelete, onPassword }) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.mainTap} onPress={() => onEdit(item)}>
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
          <Text style={styles.date}>Joined {item.joinedAt}</Text>
        </View>
        <View
          style={[
            styles.badge,
            item.isVerified ? styles.badgeVerified : styles.badgePending,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              item.isVerified && styles.badgeTextVerified,
            ]}
          >
            {item.isVerified ? "Verified" : "Pending"}
          </Text>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Pressable onPress={() => onPassword(item)} hitSlop={8} style={styles.actionBtn}>
          <MaterialCommunityIcons name="key-outline" size={20} color={Colors.accent} />
        </Pressable>
        <Pressable onPress={() => onEdit(item)} hitSlop={8} style={styles.actionBtn}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color={Colors.textSecondary} />
        </Pressable>
        <Pressable onPress={() => onDelete(item)} hitSlop={8} style={styles.actionBtn}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={Colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

export default function SuperAdminUsersScreen() {
  const router = useRouter();
  const { students, removeStudent, resetStudents, updateStudentPassword } =
    usePortalStudents();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [passwordTarget, setPasswordTarget] = useState(null);
  const { showAlert, AlertModal } = usePortalAlert();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q),
    );
  }, [students, query]);

  const verifiedCount = students.filter((u) => u.isVerified).length;

  return (
    <AdminScreenShell scroll={false} contentStyle={styles.shell}>
      <PortalPageHeader
        onBack={() => router.back()}
        title="Students"
        subtitle={`${students.length} registered · ${verifiedCount} verified`}
        icon="school"
        accent="#60A5FA"
        rightAction={
          <Pressable
            onPress={() => router.push("/super-admin/users/create")}
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.88 }]}
          >
            <MaterialCommunityIcons name="plus" size={22} color={Colors.white} />
          </Pressable>
        }
      />

      <ListScreenToolbar
        total={filtered.length}
        label="students"
        query={query}
        onChangeQuery={setQuery}
        placeholder="Search students"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserRow
            item={item}
            onEdit={(s) => router.push(`/super-admin/users/${s.id}`)}
            onDelete={setPendingDelete}
            onPassword={(s) => setPasswordTarget(s)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                resetStudents();
                setRefreshing(false);
              }, 600);
            }}
            tintColor={Colors.accent}
          />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No students found.</Text>
          </View>
        }
      />

      <Pressable
        onPress={() => router.push("/super-admin/users/create")}
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.92 }]}
      >
        <MaterialCommunityIcons name="account-plus" size={24} color={Colors.white} />
        <Text style={styles.fabText}>Add student</Text>
      </Pressable>

      <ThemedConfirmModal
        visible={!!pendingDelete}
        title="Remove student"
        message={
          pendingDelete
            ? `Remove ${pendingDelete.firstName} ${pendingDelete.lastName} from the platform?`
            : ""
        }
        destructive
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          const name = `${pendingDelete.firstName} ${pendingDelete.lastName}`;
          removeStudent(pendingDelete.id);
          setPendingDelete(null);
          const { title, message } = PORTAL_ALERTS.studentRemoved(name);
          showAlert(title, message);
        }}
      />

      <StudentPasswordModal
        visible={!!passwordTarget}
        studentName={
          passwordTarget
            ? `${passwordTarget.firstName} ${passwordTarget.lastName}`
            : ""
        }
        onClose={() => setPasswordTarget(null)}
        onSave={(pass) => {
          if (!passwordTarget) return;
          const name = `${passwordTarget.firstName} ${passwordTarget.lastName}`;
          updateStudentPassword(passwordTarget.id, pass);
          setPasswordTarget(null);
          const { title, message } = PORTAL_ALERTS.passwordUpdated(name);
          showAlert(title, message);
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
