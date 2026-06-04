import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { parseGeoSyllabusSections } from "../../lib/parseGeoExplanation";
import { geographyTheoryDataApi } from "../../src/geographyApi/geographyTheoryDataApi";
import useMapQuery from "../../src/hooks/useGeographyMapQuery.js";

export default function GeographyMapsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureSections, setFeatureSections] = useState([]);
  const [isFeatureLoading, setIsFeatureLoading] = useState(false);
  const autoOpenedRef = useRef(false);

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
      setFeatureSections([]);
      autoOpenedRef.current = false;
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
      popup_sections: point.popup_sections || [],
    })) || []),

    ...(apiResponse?.paths?.map((path) => ({
      label: path.label,
      color: path.color || Colors.accent,
      coords: path.data.map((coord) => formatCoord(coord)),
      renderType: "polyline",
      facts: path.facts || path.description || "",
      description: path.description || "",
      rawCoordinates: path.data,
      popup_sections: path.popup_sections || [],
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
        popup_sections: region.popup_sections || [],
      };
    }) || []),
  ];

  const hasPopupSections = (sections) =>
    Array.isArray(sections) &&
    sections.filter((s) => s?.body?.trim()).length >= 2;

  const handleFeaturePress = useCallback(
    async (feature) => {
      if (!feature) return;

      setSelectedFeature(feature);
      setFeatureSections([]);
      setIsFeatureLoading(true);

      if (hasPopupSections(feature.popup_sections)) {
        setFeatureSections(feature.popup_sections);
        setIsFeatureLoading(false);
        return;
      }

      const fallbackSections = apiResponse?.explanation
        ? parseGeoSyllabusSections(apiResponse.explanation)
        : [];

      try {
        const prompt = `You are a Cambridge O Level Geography (2217/2059) tutor. Write ONLY about "${feature.label}" in Pakistan. Do not mention other rivers, provinces, or features.

Structure exactly as four parts, written as a proper exam-style answer worth 4 marks (1 mark per point). Start the detailed explanation immediately after the number without any header or prefix:
[1] [Detailed Cambridge-style statement explaining physical & geographical features]
[2] [Detailed Cambridge-style statement explaining climate, soil & resources]
[3] [Detailed Cambridge-style statement explaining agricultural & economic significance]
[4] [Detailed Cambridge-style statement explaining key challenges & examiner wisdom]`;

        const response = await geographyTheoryDataApi({ query: prompt, marks: 4 });
        const answer = response?.data?.explanation;
        const parsed = answer ? parseGeoSyllabusSections(answer) : [];
        setFeatureSections(parsed.length > 0 ? parsed : fallbackSections);
      } catch (err) {
        console.error("Error fetching feature details:", err);
        setFeatureSections(fallbackSections);
      } finally {
        setIsFeatureLoading(false);
      }
    },
    [apiResponse?.explanation],
  );

  useEffect(() => {
    if (!showResult || isLoading || !apiResponse) return;
    if (apiResponse.searchMode !== "entity" || formattedFeatures.length !== 1) return;
    if (autoOpenedRef.current) return;

    autoOpenedRef.current = true;
    handleFeaturePress(formattedFeatures[0]);
  }, [showResult, isLoading, apiResponse, formattedFeatures, handleFeaturePress]);

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
                  {selectedFeature ? (
                    <Pressable
                      onPress={() => {
                        setSelectedFeature(null);
                        setFeatureSections([]);
                      }}
                    >
                      <Text style={styles.clearBtn}>Clear Selection</Text>
                    </Pressable>
                  ) : null}
                </View>

                {apiResponse.searchMode === "category" && formattedFeatures.length > 1 ? (
                  <Text style={styles.tapHint}>
                    Tap any feature on the map for a 4-part breakdown (e.g. Sindh, Indus).
                  </Text>
                ) : null}

                {apiResponse.searchMode === "entity" && apiResponse.focusedEntity ? (
                  <Text style={styles.tapHint}>
                    Showing {apiResponse.focusedEntity}. Tap the map label to reopen details.
                  </Text>
                ) : null}

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
  tapHint: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
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