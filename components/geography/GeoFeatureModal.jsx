import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppLoader from "../shared/AppLoader";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";

function parseFacts(factsString) {
  if (!factsString) return [];
  const splitChar = factsString.includes(";") ? ";" : "\n";
  return factsString
    .split(splitChar)
    .map((f) => f.trim())
    .filter((f) => f.length > 0);
}

export default function GeoFeatureModal({
  feature,
  visible,
  onClose,
  syllabusSections = [],
  isLoadingDetail = false,
}) {
  const insets = useSafeAreaInsets();
  const { height: windowH } = useWindowDimensions();
  const scrollMaxHeight = Math.min(windowH * 0.5, 440);

  if (!feature) return null;

  const facts = parseFacts(feature.facts);
  const typeLabel =
    feature.renderType === "polyline"
      ? "River / path"
      : feature.renderType === "polygon"
        ? "Region"
        : "Location";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <SafeAreaView edges={["bottom"]} style={styles.sheet}>
          <LinearGradient
            colors={[Colors.surface, Colors.backgroundMiddle]}
            style={styles.gradient}
          >
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.titleRow}>
                <View
                  style={[
                    styles.iconBg,
                    { backgroundColor: (feature.color || Colors.accent) + "22" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      feature.renderType === "marker"
                        ? "map-marker"
                        : feature.renderType === "polygon"
                          ? "vector-polygon"
                          : "routes"
                    }
                    size={20}
                    color={feature.color || Colors.accent}
                  />
                </View>
                <View style={styles.titleCol}>
                  <Text style={styles.title} numberOfLines={2}>
                    {feature.label}
                  </Text>
                  <Text
                    style={[
                      styles.typeText,
                      { color: feature.color || Colors.accent },
                    ]}
                  >
                    {typeLabel}
                  </Text>
                </View>
              </View>
              <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={Colors.textMuted}
                />
              </Pressable>
            </View>

            <ScrollView
              style={[styles.scroll, { maxHeight: scrollMaxHeight }]}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces
            >
              {feature.description ? (
                <View style={styles.block}>
                  <Text style={styles.blockLabel}>About this feature</Text>
                  <Text style={styles.body}>{feature.description}</Text>
                </View>
              ) : null}

              {facts.length > 0 ? (
                <View style={styles.block}>
                  <Text style={styles.blockLabel}>Key facts</Text>
                  {facts.map((fact, idx) => (
                    <View key={idx} style={styles.factRow}>
                      <View
                        style={[
                          styles.factDot,
                          { backgroundColor: feature.color || Colors.accent },
                        ]}
                      />
                      <Text style={styles.body}>{fact}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <View style={styles.block}>
                <Text style={styles.blockLabel}>Syllabus context (O Level)</Text>

                {isLoadingDetail ? (
                  <AppLoader
                    inline
                    title="Analyzing this feature"
                    subtitle={`Preparing 4-part breakdown for ${feature.label}…`}
                  />
                ) : syllabusSections.length > 0 ? (
                  syllabusSections.map((section) => (
                    <View key={section.number} style={styles.sectionCard}>
                      <View style={styles.sectionHeadRow}>
                        <View style={styles.sectionBadge}>
                          <Text style={styles.sectionBadgeText}>
                            {section.number}
                          </Text>
                        </View>
                        <Text style={styles.sectionHeading}>
                          {section.heading}
                        </Text>
                      </View>
                      {section.body ? (
                        <Text style={styles.body}>{section.body}</Text>
                      ) : null}
                    </View>
                  ))
                ) : (
                  <Text style={styles.bodyMuted}>
                    Syllabus breakdown is not available for this feature.
                  </Text>
                )}
              </View>

              <View style={styles.tipBox}>
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  size={18}
                  color="#f59e0b"
                />
                <Text style={styles.tipText}>
                  Exam tip: Use named facts and locations for distribution
                  questions (4–6 marks).
                </Text>
              </View>
            </ScrollView>

            <View
              style={[
                styles.footer,
                { paddingBottom: Math.max(insets.bottom, 12) },
              ]}
            >
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.doneBtn,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.doneBtnText}>Got it</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 22, 40, 0.75)",
  },
  sheet: {
    maxHeight: "88%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  gradient: { maxHeight: "100%" },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  titleRow: { flex: 1, flexDirection: "row", gap: 12 },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleCol: { flex: 1 },
  title: { color: Colors.white, ...Typography.screenTitleCompact },
  typeText: {
    ...Typography.caption,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  scroll: { flexGrow: 0 },
  scrollContent: { paddingHorizontal: 20 },
  block: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  blockLabel: {
    color: Colors.accent,
    ...Typography.sectionLabel,
    marginBottom: 8,
  },
  body: { color: Colors.textSecondary, ...Typography.bodySmall },
  bodyMuted: {
    color: Colors.textMuted,
    ...Typography.bodySmall,
    fontStyle: "italic",
  },
  factRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  factDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  sectionCard: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.cardBorder,
  },
  sectionHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  sectionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionBadgeText: {
    color: Colors.backgroundStart,
    fontSize: 12,
    fontWeight: "800",
  },
  sectionHeading: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  tipBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    color: "#fbbf24",
    ...Typography.bodySmall,
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.cardBorder,
    backgroundColor: Colors.surface,
  },
  doneBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  doneBtnText: { color: Colors.white, ...Typography.button },
});
