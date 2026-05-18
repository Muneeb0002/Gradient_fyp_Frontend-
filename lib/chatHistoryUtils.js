import Colors from "../constants/Colors";
import { sanitizeDisplayText } from "./displayText";

/** @typedef {{ _id: string, username?: string, query: string, answer: string, marks: number, mode: string, createdAt: string, updatedAt?: string }} ChatRecord */

export function normalizeChats(response) {
  if (!response?.success || !Array.isArray(response.data)) return [];
  return [...response.data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

export function topicKey(query) {
  return encodeURIComponent((query || "").trim());
}

export function decodeTopicKey(key) {
  try {
    return decodeURIComponent(key || "");
  } catch {
    return key || "";
  }
}

export function truncate(text, max = 72) {
  const t = sanitizeDisplayText(text || "")
    .trim()
    .replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function answerPreview(answer, max = 90) {
  const plain = sanitizeDisplayText(answer || "")
    .replace(/\*\*/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\n+/g, " ")
    .trim();
  return truncate(plain, max);
}

export function formatChatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatChatDate(iso);
}

export function getModeMeta(mode) {
  const m = (mode || "chat").toLowerCase();
  if (m === "image") {
    return {
      label: "Image",
      icon: "image-outline",
      color: "#F9A8D4",
    };
  }
  if (m === "theory" || m === "text") {
    return {
      label: "Theory",
      icon: "text-box-outline",
      color: "#93C5FD",
    };
  }
  return {
    label: "Chat",
    icon: "message-text-outline",
    color: Colors.accent,
  };
}

/** Group chats by same query string */
export function groupChatsByTopic(chats) {
  const map = new Map();
  for (const chat of chats) {
    const key = (chat.query || "").trim();
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, {
        id: topicKey(key),
        title: key,
        preview: answerPreview(chat.answer),
        lastActive: formatRelativeTime(chat.createdAt),
        lastActiveIso: chat.createdAt,
        chatCount: 0,
        color: getModeMeta(chat.mode).color,
        icon: getModeMeta(chat.mode).icon,
        mode: chat.mode,
        marks: chat.marks,
        chats: [],
      });
    }
    const group = map.get(key);
    group.chats.push(chat);
    group.chatCount += 1;
    if (new Date(chat.createdAt) > new Date(group.lastActiveIso)) {
      group.lastActiveIso = chat.createdAt;
      group.lastActive = formatRelativeTime(chat.createdAt);
      group.preview = answerPreview(chat.answer);
      group.marks = chat.marks;
      group.mode = chat.mode;
      group.color = getModeMeta(chat.mode).color;
      group.icon = getModeMeta(chat.mode).icon;
    }
  }
  return [...map.values()].sort(
    (a, b) => new Date(b.lastActiveIso) - new Date(a.lastActiveIso),
  );
}

export function getChatsForTopic(chats, topicQuery) {
  const q = (topicQuery || "").trim();
  return chats
    .filter((c) => (c.query || "").trim() === q)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function findChatById(chats, id) {
  return chats.find((c) => c._id === id) ?? null;
}

export function chatToSessionRow(chat) {
  return {
    id: chat._id,
    title: truncate(chat.query, 48),
    preview: answerPreview(chat.answer, 100),
    date: formatChatDate(chat.createdAt),
    marks: chat.marks,
    mode: chat.mode,
  };
}
