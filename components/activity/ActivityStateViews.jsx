import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppLoader from "../shared/AppLoader";
import Colors from "../../constants/Colors";

export function ActivityLoading({
  message = "Loading",
  subtitle,
  compact = false,
}) {
  return (
    <View style={[styles.center, compact && styles.centerCompact]}>
      <AppLoader
        compact={compact}
        title={message}
        subtitle={subtitle || "Please wait a moment…"}
      />
    </View>
  );
}

export function ActivityError({ message, onRetry }) {
  return (
    <View style={styles.center}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name="cloud-off-outline"
          size={36}
          color={Colors.danger}
        />
      </View>
      <Text style={styles.errorTitle}>Could not load history</Text>
      <Text style={styles.errorMsg}>{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.88 }]}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ActivityEmpty({ title, subtitle, icon = "message-text-outline" }) {
  return (
    <View style={styles.center}>
      <View style={[styles.iconCircle, { borderColor: Colors.cardBorder }]}>
        <MaterialCommunityIcons name={icon} size={40} color={Colors.accent} />
      </View>
      <Text style={styles.errorTitle}>{title}</Text>
      <Text style={styles.errorMsg}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(79, 209, 197, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  centerCompact: { paddingVertical: 16 },
  errorTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  errorMsg: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  retryText: { color: Colors.white, fontWeight: "800", fontSize: 14 },
});
