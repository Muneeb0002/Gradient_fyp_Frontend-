// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import Colors from "../../constants/Colors";
// import { sanitizeDisplayText } from "../../lib/displayText";
// import {
//   formatChatDate,
//   splitAnswerParagraphs,
// } from "../../lib/chatHistoryUtils";

// import MapAnswerView from "./MapAnswerView.js";

// function UserBubble({ text }) {
//   return (
//     <View style={styles.userRow}>
//       <View style={styles.userBubble}>
//         <Text style={styles.userText}>{text}</Text>
//       </View>
//     </View>
//   );
// }

// function AssistantBubble({ paragraphs, marks }) {
//   return (
//     <View style={styles.assistantRow}>
//       <View style={styles.avatar}>
//         <MaterialCommunityIcons
//           name="robot-outline"
//           size={18}
//           color={Colors.accent}
//         />
//       </View>
//       <View style={styles.assistantBody}>
//         <Text style={styles.assistantLabel}>GRADIANT</Text>
//         {paragraphs.map((para, i) => (
//           <Text key={`p-${i}`} style={styles.assistantText}>
//             {para}
//           </Text>
//         ))}
//         {marks != null ? (
//           <Text style={styles.marksHint}>{marks} marks · examiner style</Text>
//         ) : null}
//       </View>
//     </View>
//   );
// }

// function hasMapData(response) {
//   if (!response) return false;
//   const { points = [], paths = [], regions = [] } = response;
//   return points.length > 0 || paths.length > 0 || regions.length > 0;
// }

// export default function ChatConversation({ chat }) {
//   const paragraphs = splitAnswerParagraphs(chat.answer);
//   const showMap = hasMapData(chat.response);

//   return (
//     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
//       <Text style={styles.dateLabel}>{formatChatDate(chat.createdAt)}</Text>
//       <UserBubble text={sanitizeDisplayText(chat.query)} />

//       {showMap ? (
//         <View style={styles.assistantRow}>
//           <View style={styles.avatar}>
//             <MaterialCommunityIcons name="robot-outline" size={18} color={Colors.accent} />
//           </View>
//           <View style={styles.assistantBody}>
//             <Text style={styles.assistantLabel}>GRADIANT</Text>
//             <MapAnswerView response={chat.response} />
//             {chat.response?.explanation ? (
//               <Text style={styles.assistantText}>
//                 {sanitizeDisplayText(chat.response.explanation)}
//               </Text>
//             ) : null}
//           </View>
//         </View>
//       ) : (
//         <AssistantBubble paragraphs={paragraphs} marks={chat.marks} />
//       )}
//     </ScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   scroll: {
//     paddingBottom: 32,
//     paddingTop: 8,
//   },
//   dateLabel: {
//     alignSelf: "center",
//     color: Colors.textMuted,
//     fontSize: 11,
//     fontWeight: "600",
//     marginBottom: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 10,
//     backgroundColor: "rgba(255,255,255,0.05)",
//   },
//   userRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginBottom: 20,
//   },
//   userBubble: {
//     maxWidth: "88%",
//     backgroundColor: "rgba(79, 209, 197, 0.1)",
//     borderRadius: 18,
//     borderBottomRightRadius: 4,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: "rgba(79, 209, 197, 0.35)",
//   },
//   userText: {
//     color: Colors.accent,
//     fontSize: 15,
//     lineHeight: 22,
//     fontWeight: "600",
//   },
//   assistantRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 10,
//     marginBottom: 8,
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "rgba(79, 209, 197, 0.12)",
//     borderWidth: 1,
//     borderColor: "rgba(79, 209, 197, 0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 2,
//   },
//   assistantBody: {
//     flex: 1,
//     minWidth: 0,
//   },
//   assistantLabel: {
//     color: Colors.accent,
//     fontSize: 11,
//     fontWeight: "800",
//     letterSpacing: 0.8,
//     marginBottom: 8,
//   },
//   assistantText: {
//     color: Colors.textSecondary,
//     fontSize: 15,
//     lineHeight: 24,
//     marginBottom: 10,
//   },
//   marksHint: {
//     color: Colors.textMuted,
//     fontSize: 12,
//     fontStyle: "italic",
//     marginTop: 4,
//   },
// });











import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { formatChatDate } from "../../lib/chatHistoryUtils";
import { sanitizeDisplayText } from "../../lib/displayText";

import AnswerRenderer from "./AnswerRenderer.js";

function UserBubble({ text }) {
  return (
    <View style={styles.userRow}>
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{text}</Text>
      </View>
    </View>
  );
}

export default function ChatConversation({ chat }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      <Text style={styles.dateLabel}>{formatChatDate(chat.createdAt)}</Text>
      <UserBubble text={sanitizeDisplayText(chat.query)} />

      <View style={styles.assistantRow}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={18}
            color={Colors.accent}
          />
        </View>
        <View style={styles.assistantBody}>
          <Text style={styles.assistantLabel}>GRADIANT</Text>

          <AnswerRenderer chat={chat} />

          {chat.response?.explanation ? (
            <Text style={styles.assistantText}>
              {sanitizeDisplayText(chat.response.explanation)}
            </Text>
          ) : null}

          {chat.marks != null ? (
            <Text style={styles.marksHint}>
              {chat.marks} marks · examiner style
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  dateLabel: {
    alignSelf: "center",
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  userBubble: {
    maxWidth: "88%",
    backgroundColor: "rgba(79, 209, 197, 0.1)",
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
  },
  userText: {
    color: Colors.accent,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  assistantRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(79, 209, 197, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  assistantBody: {
    flex: 1,
    minWidth: 0,
  },
  assistantLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  assistantText: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 10,
  },
  marksHint: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
});