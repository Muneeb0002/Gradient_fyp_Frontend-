import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

export default function ProfileHeroCard({
  name,
  email,
  roleLabel,
  meta,
  icon = "shield-account",
}) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <MaterialCommunityIcons name={icon} size={36} color={Colors.accent} />
      </View>
      <View style={styles.info}>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{roleLabel}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79, 209, 197, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.35)",
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  rolePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(79, 209, 197, 0.15)",
    marginBottom: 8,
  },
  roleText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  name: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "800",
  },
  email: {
    color: Colors.textSecondary,
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
  },
  meta: {
    color: Colors.textMuted,
    marginTop: 6,
    ...Typography.caption,
    fontWeight: "500",
    textTransform: "none",
    letterSpacing: 0,
  },
});
