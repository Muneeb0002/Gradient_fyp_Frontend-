import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AdminScreenShell from "../../../components/admin/AdminScreenShell";
import PortalPageHeader from "../../../components/admin/PortalPageHeader";
import SectionCard from "../../../components/shared/SectionCard";
import { HISTORY_DETAIL_BY_ID } from "../../../constants/adminPortalData";
import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";

function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <View
      style={[
        styles.bubbleWrap,
        isUser ? styles.bubbleWrapUser : styles.bubbleWrapAssistant,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        <Text style={styles.bubbleRole}>
          {isUser ? "Student" : "Gradiant AI"}
        </Text>
        <Text style={styles.bubbleText}>{text}</Text>
      </View>
    </View>
  );
}

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const session = HISTORY_DETAIL_BY_ID[id] ?? null;

  if (!session) {
    return (
      <AdminScreenShell>
        <PortalPageHeader
          onBack={() => router.back()}
          title="Session"
          subtitle="Not found"
          icon="alert-circle-outline"
        />
        <Text style={styles.missing}>This conversation could not be loaded.</Text>
      </AdminScreenShell>
    );
  }

  return (
    <AdminScreenShell contentStyle={styles.shell}>
      <PortalPageHeader
        onBack={() => router.back()}
        title={session.title}
        subtitle={`${session.subject} · ${session.username}`}
        icon="forum-outline"
        accent={Colors.primary}
      />

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={14}
            color={Colors.textMuted}
          />
          <Text style={styles.metaText}>{session.createdAt}</Text>
        </View>
        <View style={styles.metaChip}>
          <MaterialCommunityIcons
            name="message-outline"
            size={14}
            color={Colors.textMuted}
          />
          <Text style={styles.metaText}>{session.messageCount} messages</Text>
        </View>
      </View>

      <SectionCard label="Conversation" icon="chat-outline">
        <ScrollView
          style={styles.chatScroll}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {session.messages.map((msg, index) => (
            <ChatBubble key={`${msg.role}-${index}`} role={msg.role} text={msg.text} />
          ))}
        </ScrollView>
      </SectionCard>
    </AdminScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: { paddingBottom: 24 },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  chatScroll: {
    maxHeight: 420,
  },
  bubbleWrap: {
    marginBottom: 12,
  },
  bubbleWrapUser: {
    alignItems: "flex-end",
  },
  bubbleWrapAssistant: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "92%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  bubbleUser: {
    backgroundColor: "rgba(63, 183, 168, 0.15)",
    borderColor: "rgba(79, 209, 197, 0.35)",
  },
  bubbleAssistant: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.cardBorder,
  },
  bubbleRole: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  bubbleText: {
    color: Colors.textSecondary,
    ...Typography.bodySmall,
    lineHeight: 21,
  },
  missing: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 24,
    ...Typography.body,
  },
});
