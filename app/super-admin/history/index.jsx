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
import { MOCK_HISTORY } from "../../../constants/adminPortalData";
import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";

const SUBJECT_COLORS = {
  Mathematics: Colors.primary,
  Geography: "#60A5FA",
  History: "#FBBF24",
  Economics: "#A78BFA",
};

function HistoryRow({ item, onPress }) {
  const accent = SUBJECT_COLORS[item.subject] ?? Colors.accent;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}
    >
      <View style={[styles.subjectDot, { backgroundColor: accent }]} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {item.preview}
        </Text>
        <Text style={styles.meta}>
          {item.username} · {item.subject}
        </Text>
        <Text style={styles.date}>{item.createdAt}</Text>
      </View>
      <View style={styles.trailing}>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{item.messageCount}</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={Colors.textMuted}
        />
      </View>
    </Pressable>
  );
}

export default function SuperAdminHistoryScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_HISTORY;
    return MOCK_HISTORY.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.username.toLowerCase().includes(q) ||
        h.subject.toLowerCase().includes(q) ||
        h.preview.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <AdminScreenShell scroll={false} contentStyle={styles.shell}>
      <PortalPageHeader
        onBack={() => router.replace("/super-admin")}
        title="Chat history"
        subtitle="All learning conversations"
        icon="message-text"
        accent="#A78BFA"
      />

      <ListScreenToolbar
        total={filtered.length}
        label="sessions"
        query={query}
        onChangeQuery={setQuery}
        placeholder="Search by user, subject, or topic"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryRow
            item={item}
            onPress={() => router.push(`/super-admin/history/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 700);
            }}
            tintColor={Colors.accent}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No sessions match your search.</Text>
          </View>
        }
      />
    </AdminScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, paddingBottom: 0 },
  list: { paddingBottom: 32 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  subjectDot: {
    width: 4,
    borderRadius: 2,
    alignSelf: "stretch",
    marginRight: 12,
  },
  info: { flex: 1 },
  title: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  preview: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 8,
    fontWeight: "600",
  },
  date: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  trailing: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    marginBottom: 8,
  },
  countText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
  },
  empty: { alignItems: "center", paddingTop: 40 },
  emptyText: { color: Colors.textMuted, ...Typography.bodySmall },
});
