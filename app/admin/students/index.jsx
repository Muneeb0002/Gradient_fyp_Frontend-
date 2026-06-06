import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import Colors from "../../../constants/Colors";
import { PORTAL_ALERTS } from "../../../constants/portalAlertMessages";
import { useFetchAdminUsers } from "../../../src/hooks/useFetchAdminUsers";
import usePortalAlert from "../../../src/hooks/usePortalAlert";

function StudentRow({ item, onPassword }) {
  return (
    <Pressable
      onPress={() => onPassword(item)}
      style={({ pressed }) => [
        styles.row,
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {(item.firstName?.[0] || "").toUpperCase()}
          {(item.lastName?.[0] || "").toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.hint}>Tap to reset password</Text>
      </View>

      <MaterialCommunityIcons name="key-outline" size={22} color={Colors.accent} />
    </Pressable>
  );
}

export default function AdminStudentsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [passwordTarget, setPasswordTarget] = useState(null);

  const { showAlert, AlertModal } = usePortalAlert();

  // ✅ FIX: better naming + direct access
  const { mutate, data, isPending, isError } = useFetchAdminUsers();

  const students = data?.data ?? [];

  // ✅ single function for fetching
  const loadStudents = () => {
    mutate({
      createdBy: "Gradiant@gmail.com",
      createdByPass: "ABC123.@",
    });
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ✅ stable filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;

    return students.filter((u) => {
      const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
      return (
        u.email?.toLowerCase().includes(q) ||
        fullName.includes(q)
      );
    });
  }, [students, query]);

  return (
    <AdminScreenShell scroll={false} contentStyle={styles.shell}>
      <PortalPageHeader
        onBack={() => router.back()}
        title="Students"
        subtitle="View learners · reset passwords only"
        icon="school"
        accent="#60A5FA"
      />

      <ListScreenToolbar
        total={filtered.length}
        label="students"
        query={query}
        onChangeQuery={setQuery}
        placeholder="Search students"
      />

      <View style={styles.notice}>
        <MaterialCommunityIcons
          name="information-outline"
          size={18}
          color={Colors.accent}
        />
        <Text style={styles.noticeText}>
          You can reset student passwords. Only Super Admin can add/remove students.
        </Text>
      </View>

      {/* LOADING */}
      {isPending && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={{ color: Colors.textMuted, marginTop: 10 }}>
            Loading students...
          </Text>
        </View>
      )}

      {/* ERROR */}
      {isError && (
        <View style={styles.center}>
          <Text style={{ color: "red" }}>
            Failed to fetch students. Try again.
          </Text>
        </View>
      )}

      {/* LIST */}
      {!isPending && !isError && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id?.toString()}
          renderItem={({ item }) => (
            <StudentRow item={item} onPassword={setPasswordTarget} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isPending}
              onRefresh={loadStudents}
              tintColor={Colors.accent}
            />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No students found.</Text>
          }
        />
      )}

      {/* PASSWORD MODAL */}
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

          console.log("Reset password:", passwordTarget._id, pass);

          setPasswordTarget(null);

          const { title, message } =
            PORTAL_ALERTS.passwordUpdated(name);

          showAlert(title, message);
        }}
      />

      <AlertModal />
    </AdminScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, paddingBottom: 0 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "rgba(79, 209, 197, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.25)",
  },

  noticeText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },

  list: { paddingBottom: 24 },

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

  initials: {
    color: Colors.accent,
    fontWeight: "800",
    fontSize: 16,
  },

  info: { flex: 1, marginLeft: 12, marginRight: 8 },

  name: { color: Colors.white, fontWeight: "700", fontSize: 15 },

  email: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },

  hint: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },

  empty: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 32,
  },
});