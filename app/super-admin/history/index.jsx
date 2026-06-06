import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";

// Humne jo naya hook banaya tha useQuery wala, usko sahi path se import karein bhae
import { useFetchAdminHistory } from "../../../src/hooks/useFetchAdminUsers";


const MODE_COLORS = {
  chat: Colors.primary,
  quiz: "#60A5FA",
  test: "#FBBF24",
};

function HistoryRow({ item, onPress }) {
  // Subject backend mein nahi hai, toh mode ("chat") ke mutabiq rang set hoga
  const accent = MODE_COLORS[item.mode] ?? Colors.accent;

  // Date format sahi karne ke liye
  const formattedDate = item.createdAt 
    ? new Date(item.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}
    >
      <View style={[styles.subjectDot, { backgroundColor: accent }]} />
      <View style={styles.info}>
        {/* API ki 'query' ko Title bana diya */}
        <Text style={styles.title} numberOfLines={1}>
          {item.query || "No Query"}
        </Text>
        {/* API ke 'answer' ko Preview bana diya */}
        <Text style={styles.preview} numberOfLines={2}>
          {item.answer || "No Answer"}
        </Text>
        <Text style={styles.meta}>
          {item.username} · Mode: {item.mode?.toUpperCase()}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <View style={styles.trailing}>
        {/* Marks ko yahan show karwa diya pill ke andar */}
        <View style={styles.countPill}>
          <Text style={styles.countText}>+{item.marks || 0} Marks</Text>
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
  
  // 1. TanStack `useQuery` Hook Call Kiya
  const { data: apiResponse, isLoading, isError, refetch } = useFetchAdminHistory();

  // 2. Real API array extracted (235 items)
  const historyData = apiResponse?.data || [];

  // Search filter ka logic ab real history data par chalega
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return historyData;
    return historyData.filter(
      (h) =>
        (h.query && h.query.toLowerCase().includes(q)) ||
        (h.username && h.username.toLowerCase().includes(q)) ||
        (h.answer && h.answer.toLowerCase().includes(q)) ||
        (h.mode && h.mode.toLowerCase().includes(q)),
    );
  }, [historyData, query]);

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
        placeholder="Search by user, query, or answer"
      />

      {/* 3. Loading State UI */}
      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={[styles.emptyText, { marginTop: 10 }]}>Fetching history from server...</Text>
        </View>
      )}

      {/* 4. Error State UI */}
      {isError && (
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: "red" }]}>
            Failed to load chat history.
          </Text>
        </View>
      )}

      {/* 5. Main List UI Render */}
      {!isLoading && !isError && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id} // Mongoose ID use ki hai bhae
          renderItem={({ item }) => (
            <HistoryRow
              item={item}
              onPress={() => router.push(`/super-admin/history/${item._id}`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch} // Pull-to-refresh par query dubara run hogi
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
      )}
    </AdminScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, paddingBottom: 0 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    justifyContent: "space-between",
    alignSelf: "stretch",
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