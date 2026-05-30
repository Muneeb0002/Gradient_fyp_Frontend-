import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GeoAnswerCard from "../../components/geography/GeoAnswerCard";
import GeoFeatureModal from "../../components/geography/GeoFeatureModal";
import GeoInput from "../../components/geography/GeoInput";
import GeoMapView from "../../components/geography/GeoMapView";
import AppDecor from "../../components/shared/AppDecor";
import AppLoader from "../../components/shared/AppLoader";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";
import Typography from "../../constants/Typography";
import { extractAiAnswer } from "../../lib/aiResponse";
import { parseGeoSyllabusSections } from "../../lib/parseGeoExplanation";
import { askAIFunction } from "../../src/history.api.js/askAIFunction";
import useMapQuery from "../../src/hooks/useGeographyMapQuery.js";

export default function GeographyMapsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureSections, setFeatureSections] = useState([]);
  const [isFeatureLoading, setIsFeatureLoading] = useState(false);

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useMapQuery(searchQuery);

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

  const handleFeaturePress = async (feature) => {
    setSelectedFeature(feature);
    setFeatureSections([]);
    setIsFeatureLoading(true);

    const fallbackSections = apiResponse?.explanation
      ? parseGeoSyllabusSections(apiResponse.explanation)
      : [];

    try {
      const prompt = `You are a Cambridge O Level Geography (2217) tutor. Write a focused breakdown for "${feature.label}" in Pakistan only.

Structure exactly as four parts:
### [1] Curriculum Context:
### [2] Regional/Physical Analysis:
### [3] Significance:
### [4] Tutor Wisdom:`;

      const response = await askAIFunction({ query: prompt, marks: 4 });
      const answer = extractAiAnswer(response);
      const parsed = answer ? parseGeoSyllabusSections(answer) : [];
      setFeatureSections(parsed.length > 0 ? parsed : fallbackSections);
    } catch {
      setFeatureSections(fallbackSections);
    } finally {
      setIsFeatureLoading(false);
    }
  };

  const closeFeatureModal = () => {
    setSelectedFeature(null);
    setFeatureSections([]);
    setIsFeatureLoading(false);
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

          {isLoading && showResult && (
            <AppLoader
              title="Building your map"
              subtitle={
                searchQuery.trim()
                  ? `Analyzing “${searchQuery.trim()}” for O Level Geography…`
                  : "Preparing GIS data…"
              }
            />
          )}

          {isError && showResult && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {error?.message || "Failed to fetch map. Please try again."}
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

      <GeoFeatureModal
        feature={selectedFeature}
        visible={!!selectedFeature}
        onClose={closeFeatureModal}
        syllabusSections={featureSections}
        isLoadingDetail={isFeatureLoading}
      />
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
    ...Typography.sectionLabel,
  },
  clearBtn: { color: Colors.accent, ...Typography.buttonSmall },
  mapShell: {
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  errorBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.dangerSoft,
    borderWidth: 1,
    borderColor: "rgba(251, 113, 133, 0.35)",
  },
  errorText: { color: Colors.danger, ...Typography.bodySmall, fontWeight: "600" },
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
  noDataTitle: {
    color: Colors.white,
    ...Typography.screenTitle,
    marginBottom: 10,
  },
  noDataText: {
    color: Colors.textSecondary,
    ...Typography.bodySmall,
    textAlign: "center",
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  retryBtnText: { color: Colors.white, ...Typography.button },
});