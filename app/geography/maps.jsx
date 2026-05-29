import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GeoAnswerCard from "../../components/geography/GeoAnswerCard";
import GeoInput from "../../components/geography/GeoInput";
import GeoMapView from "../../components/geography/GeoMapView";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";
import useMapQuery from "../../src/hooks/useGeographyMapQuery.js";

export default function GeographyMapsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useMapQuery(searchQuery);

  useEffect(() => {
    if (apiResponse) {
      console.log("POINTS:", JSON.stringify(apiResponse?.points));
      console.log("PATHS:", JSON.stringify(apiResponse?.paths));
      console.log("REGIONS:", JSON.stringify(apiResponse?.regions));
    }
  }, [apiResponse]);

  const VALID_QUERIES = [
    "Province", "Crops", "Livestock", "Fruits", "Forests", "Energy",
    "Mineral", "Rivers", "Barrages", "Ports", "Infrastructure", "Landforms",
    "Rain systems", "Airports", "Dryports", "Sea ports", "Dams",
    "Major Industries", "Energy pipelines", "Population", "Mountain ranges",
    "Deserts", "Plateaus", "Mountain passes", "Glaciers", "Canals",
    "Fish farms", "Drought areas", "Industrial zones",
  ];

  const normalizeQuery = (input) => {
    const cleaned = input.trim().toLowerCase();
    const match = VALID_QUERIES.find((q) => q.toLowerCase() === cleaned);
    return match || input.trim();
  };

  const handleSubmit = (input) => {
    if (input?.text) {
      const normalized = normalizeQuery(input.text);
      setSearchQuery(normalized);
      setShowResult(true);
      setSelectedFeature(null);
    }
  };

  const formatCoord = (coord) => ({ latitude: coord[0], longitude: coord[1] });

  // ✅ Fix: 2 points se valid rectangle polygon banao
  // Backend sirf bounding box deta hai (top-left, bottom-right)
  // Hum usse 4 corners + closing point mein convert karte hain
  const expandToPolygon = (rawCoords) => {
    if (!rawCoords || rawCoords.length === 0) return [];

    // Already enough points hain to use directly
    if (rawCoords.length >= 3) {
      return rawCoords.map(formatCoord);
    }

    // Sirf 1 point — small square banao
    if (rawCoords.length === 1) {
      const [lat, lng] = rawCoords[0];
      const delta = 0.1;
      return [
        { latitude: lat - delta, longitude: lng - delta },
        { latitude: lat + delta, longitude: lng - delta },
        { latitude: lat + delta, longitude: lng + delta },
        { latitude: lat - delta, longitude: lng + delta },
      ];
    }

    // ✅ Exactly 2 points — bounding box se rectangle banao
    // point1 = [lat1, lng1], point2 = [lat2, lng2]
    const lats = rawCoords.map((c) => c[0]);
    const lngs = rawCoords.map((c) => c[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return [
      { latitude: minLat, longitude: minLng }, // bottom-left
      { latitude: maxLat, longitude: minLng }, // top-left
      { latitude: maxLat, longitude: maxLng }, // top-right
      { latitude: minLat, longitude: maxLng }, // bottom-right
    ];
  };

  // ✅ Center coordinate nikalo (modal/map focus ke liye)
  const getCenterCoord = (rawCoords) => {
    if (!rawCoords || rawCoords.length === 0) return null;
    const lats = rawCoords.map((c) => c[0]);
    const lngs = rawCoords.map((c) => c[1]);
    return {
      latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
      longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  };

  const formattedFeatures = [
    ...(apiResponse?.points?.map((point) => ({
      label: point.label,
      color: point.color || Colors.accent,
      coords: point.data.map((p) => formatCoord(p.coordinates ?? p)),
      renderType: "marker",
      facts: point.facts || "",
      description: point.description || "",
      rawCoordinates: point.data.map((p) => p.coordinates ?? p),
      icon: point.icon,
    })) || []),

    ...(apiResponse?.paths?.map((path) => ({
      label: path.label,
      color: path.color || Colors.accent,
      coords: path.data.map((coord) => formatCoord(coord)),
      renderType: "polyline",
      facts: path.facts || path.description || "",
      description: path.description || "",
      rawCoordinates: path.data,
    })) || []),

    ...(apiResponse?.regions?.map((region) => {
      // ✅ Har region ke data array se saare coordinates collect karo
      const allRawCoords = region.data.flatMap((r) => r.coordinates || []);
      // ✅ Description region.data[0].description se lo
      const regionDescription = region.data[0]?.description || "";
      // ✅ Expanded polygon coords
      const polygonCoords = expandToPolygon(allRawCoords);

      return {
        label: region.label,
        color: region.color || Colors.accent,
        coords: polygonCoords,
        renderType: "polygon",
        facts: region.facts || "",
        // ✅ description alag field mein store karo
        description: regionDescription,
        rawCoordinates: allRawCoords,
        centerCoord: getCenterCoord(allRawCoords),
      };
    }) || []),
  ];

  const handleFeaturePress = (feature) => {
    setSelectedFeature(feature);
  };

  // ✅ Facts ko semicolon ya newline se split karo
  const parseFacts = (factsString) => {
    if (!factsString) return [];
    const splitChar = factsString.includes(";") ? ";" : "\n";
    return factsString
      .split(splitChar)
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  };

  // ✅ explanation ka [1] [2] format parse karo
  const parseExplanation = (explanationText) => {
    if (!explanationText) return [];
    return explanationText
      .split(/\[(\d+)\]/)
      .reduce((acc, part, index, arr) => {
        if (/^\d+$/.test(part)) {
          const content = arr[index + 1] || "";
          const lines = content.trim().split("\n");
          const heading = lines[0]?.trim() || "";
          const body = lines.slice(1).join("\n").trim();
          acc.push({ number: part, heading, body });
        }
        return acc;
      }, []);
  };

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      style={{ flex: 1 }}
    >
      <AppDecor />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <ScreenHeader
            onBack={() => router.back()}
            title="Geography - Maps"
            subtitle="GIS-style map + AI analysis for O Level."
            icon="map-search-outline"
          />

          <SectionCard
            label="Ask or upload"
            icon="map-search-outline"
            style={styles.mainCard}
          >
            <GeoInput compact onSubmit={handleSubmit} />
          </SectionCard>

          {isLoading && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={Colors.accent} />
              <Text style={styles.loadingText}>
                {searchQuery.trim()
                  ? `AI Engine analyzing ${searchQuery.trim()}...`
                  : "AI Engine analyzing..."}
              </Text>
            </View>
          )}

          {isError && (
            <View style={styles.centerBox}>
              <Text style={{ color: "red" }}>
                Error: {error?.message || "Failed to fetch map"}
              </Text>
            </View>
          )}

          {showResult && !isLoading && apiResponse && (
            formattedFeatures.length > 0 ? (
              <View style={styles.resultBlock}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultHeading}>GIS Visualization</Text>
                  {selectedFeature && (
                    <Pressable onPress={() => setSelectedFeature(null)}>
                      <Text style={styles.clearBtn}>Clear Selection</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.mapShell}>
                  <GeoMapView
                    rivers={formattedFeatures}
                    onFeaturePress={handleFeaturePress}
                    selectedFeatureId={selectedFeature?.label}
                  />
                </View>

                <GeoAnswerCard
                  queryType="text"
                  answer={apiResponse?.explanation}
                />
              </View>
            ) : (
              <View style={styles.noDataCard}>
                <View style={styles.noDataIconBg}>
                  <MaterialCommunityIcons
                    name="map-marker-off"
                    size={40}
                    color={Colors.accent}
                  />
                </View>
                <Text style={styles.noDataTitle}>Not in Syllabus</Text>
                <Text style={styles.noDataText}>
                  The query "{searchQuery}" is not recognized as a geographical
                  feature in the O-Level syllabus. Please search for specific
                  topics like Rivers, Dams, Crops, or Provinces.
                </Text>
                <Pressable
                  style={styles.retryBtn}
                  onPress={() => setShowResult(false)}
                >
                  <Text style={styles.retryBtnText}>Try Another Topic</Text>
                </Pressable>
              </View>
            )
          )}
        </ScrollView>
      </SafeAreaView>

      {/* ─── FEATURE DETAIL MODAL ─── */}
      <Modal
        visible={!!selectedFeature}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedFeature(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={["#1e293b", "#0f172a"]}
              style={styles.modalGradient}
            >
              <View style={styles.dragHandle} />

              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <View style={[
                    styles.featureIconBg,
                    { backgroundColor: (selectedFeature?.color || "#3b82f6") + "22" },
                  ]}>
                    <MaterialCommunityIcons
                      name={
                        selectedFeature?.renderType === "marker"
                          ? "map-marker"
                          : selectedFeature?.renderType === "polygon"
                          ? "vector-polygon"
                          : "routes"
                      }
                      size={20}
                      color={selectedFeature?.color || "#3b82f6"}
                    />
                  </View>
                  <Text style={styles.modalTitle} numberOfLines={1}>
                    {selectedFeature?.label}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSelectedFeature(null)}
                  style={styles.closeIconBtn}
                  hitSlop={10}
                >
                  <MaterialCommunityIcons name="close" size={18} color="#94a3b8" />
                </Pressable>
              </View>

              {/* Badges */}
              <View style={styles.typeBadgeRow}>
                <View style={[
                  styles.typeBadge,
                  { borderColor: (selectedFeature?.color || "#3b82f6") + "66",
                    backgroundColor: (selectedFeature?.color || "#3b82f6") + "18" }
                ]}>
                  <Text style={[styles.typeBadgeText, { color: selectedFeature?.color || "#3b82f6" }]}>
                    {selectedFeature?.renderType === "polyline"
                      ? "CANAL / RIVER PATH"
                      : selectedFeature?.renderType === "polygon"
                      ? "REGION / AREA"
                      : "LOCATION POINT"}
                  </Text>
                </View>
                <View style={styles.gisTag}>
                  <MaterialCommunityIcons name="check-circle" size={14} color="#22c55e" />
                  <Text style={styles.gisTagText}>Verified GIS Data</Text>
                </View>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>

                {/* ✅ 1. Description - region.data[0].description se aata hai */}
                {selectedFeature?.description ? (
                  <View style={styles.infoCardSection}>
                    <View style={styles.sectionLabelRow}>
                      <MaterialCommunityIcons name="map-legend" size={15} color="#38bdf8" />
                      <Text style={styles.sectionLabel}>About this Feature</Text>
                    </View>
                    <Text style={styles.descriptionText}>
                      {selectedFeature.description}
                    </Text>
                  </View>
                ) : null}

                {/* ✅ 2. Key Facts - region.facts se aata hai (semicolon split) */}
                {selectedFeature?.facts ? (
                  <View style={styles.infoCardSection}>
                    <View style={styles.sectionLabelRow}>
                      <MaterialCommunityIcons name="text-box-search-outline" size={15} color="#38bdf8" />
                      <Text style={styles.sectionLabel}>Key Facts</Text>
                    </View>
                    {parseFacts(selectedFeature.facts).map((fact, idx) => (
                      <View key={idx} style={styles.factItem}>
                        <View style={[styles.factDot, { backgroundColor: selectedFeature?.color || "#3b82f6" }]} />
                        <Text style={styles.factText}>{fact}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {/* ✅ 3. Syllabus Explanation Sections - apiResponse.explanation se */}
                {apiResponse?.explanation &&
                  parseExplanation(apiResponse.explanation).map((section, idx) => (
                    <View key={idx} style={styles.infoCardSection}>
                      <View style={styles.sectionLabelRow}>
                        <View style={styles.sectionNumberBadge}>
                          <Text style={styles.sectionNumberText}>{section.number}</Text>
                        </View>
                        <Text style={styles.sectionLabel}>{section.heading}</Text>
                      </View>
                      {section.body ? (
                        <Text style={styles.descriptionText}>{section.body}</Text>
                      ) : null}
                    </View>
                  ))}

                {/* ✅ 4. Exam Tip */}
                <View style={styles.tipBox}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color="#f59e0b" />
                  <Text style={styles.tipText}>
                    Exam Tip: Use specific facts while answering 4-mark or 6-mark distribution analysis questions.
                  </Text>
                </View>
              </ScrollView>

              <Pressable
                onPress={() => setSelectedFeature(null)}
                style={({ pressed }) => [styles.modalCloseBtn, pressed && { opacity: 0.8 }]}
              >
                <Text style={styles.modalCloseBtnText}>GOT IT</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 36,
    paddingTop: 8,
  },
  mainCard: {
    marginTop: 8,
    borderRadius: 24,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  resultBlock: { marginTop: 20 },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  resultHeading: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  clearBtn: { color: Colors.accent, fontSize: 12, fontWeight: "700" },
  mapShell: {
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  centerBox: { marginTop: 40, alignItems: "center", justifyContent: "center" },
  loadingText: { color: Colors.white, marginTop: 10, fontSize: 14, opacity: 0.8 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    justifyContent: "flex-end",
  },
  modalContent: {
    width: "100%",
    maxHeight: "85%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  modalGradient: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 30,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  featureIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: { color: "#ffffff", fontSize: 22, fontWeight: "700", flex: 1 },
  closeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeBadgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  gisTag: { flexDirection: "row", alignItems: "center", gap: 6 },
  gisTagText: { color: "#22c55e", fontSize: 13, fontWeight: "600" },
  modalBody: { marginBottom: 16 },
  infoCardSection: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionNumberBadge: {
    backgroundColor: "#38bdf8",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionNumberText: { color: "#0f172a", fontSize: 11, fontWeight: "800" },
  descriptionText: { color: "#cbd5e1", fontSize: 14, lineHeight: 22 },
  factItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  factDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    flexShrink: 0,
  },
  factText: { color: "#e2e8f0", fontSize: 14, lineHeight: 22, flex: 1 },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(245,158,11,0.06)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.15)",
    marginBottom: 6,
  },
  tipText: { color: "#fbbf24", fontSize: 13, lineHeight: 18, flex: 1 },
  modalCloseBtn: {
    backgroundColor: "#3b82f6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  modalCloseBtnText: { color: "#ffffff", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },

  // No Data
  noDataCard: {
    marginTop: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  noDataIconBg: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(244,63,94,0.1)",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
  },
  noDataTitle: { color: Colors.white, fontSize: 20, fontWeight: "800", marginBottom: 10 },
  noDataText: {
    color: Colors.textSecondary, fontSize: 14, lineHeight: 22,
    textAlign: "center", marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 36, paddingVertical: 14,
    borderRadius: 16, width: "80%", alignItems: "center",
  },
  retryBtnText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
});