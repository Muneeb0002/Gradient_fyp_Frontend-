import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GeoAnswerCard from "../../components/geography/GeoAnswerCard";
import GeoInput from "../../components/geography/GeoInput";
import GeoMapView from "../../components/geography/GeoMapView";
import AppDecor from "../../components/shared/AppDecor";
import ScreenHeader from "../../components/shared/ScreenHeader";
import SectionCard from "../../components/shared/SectionCard";
import Colors from "../../constants/Colors";
import useMapQuery from "../../src/hooks/useMapQuery.js";
import { askAIFunction } from "../../src/history.api.js/askAIFunction";

export default function GeographyMapsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureDetails, setFeatureDetails] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useMapQuery(searchQuery);

  console.log("SEARCH QUERY:", searchQuery);

  useEffect(() => {
    if (apiResponse) {
      console.log("POINTS:", JSON.stringify(apiResponse?.points));
      console.log("PATHS:", JSON.stringify(apiResponse?.paths));
      console.log("REGIONS:", JSON.stringify(apiResponse?.regions));
    }
  }, [apiResponse]);

  const VALID_QUERIES = [
    "Province",
    "Crops",
    "Livestock",
    "Fruits",
    "Forests",
    "Energy",
    "Mineral",
    "Rivers",
    "Barrages",
    "Ports",
    "Infrastructure",
    "Landforms",
    "Rain systems",
    "Airports",
    "Dryports",
    "Sea ports",
    "Dams",
    "Major Industries",
    "Energy pipelines",
    "Population",
    "Mountain ranges",
    "Deserts",
    "Plateaus",
    "Mountain passes",
    "Glaciers",
    "Canals",
    "Fish farms",
    "Drought areas",
    "Industrial zones",
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

  const formattedRivers = [
    ...(apiResponse?.points?.map((point) => ({
      label: point.label,
      color: point.color || Colors.accent,
      coords: point.data.map((p) => formatCoord(p.coordinates ?? p)),
      renderType: "marker",
      facts: point.facts,
      icon: point.icon
    })) || []),

    ...(apiResponse?.paths?.map((path) => ({
      label: path.label,
      color: path.color || Colors.accent,
      coords: path.data.map((coord) => formatCoord(coord)),
      renderType: "polyline",
    })) || []),

    ...(apiResponse?.regions?.map((region) => ({
      label: region.label,
      color: region.color || Colors.accent,
      coords: region.data.flatMap((r) => r.coordinates.map(formatCoord)),
      renderType: "polygon",
      facts: region.data[0]?.description
    })) || []),
  ];

  const getQueryType = () => "text";

  const handleFeaturePress = async (feature) => {
    setSelectedFeature(feature);
    setFeatureDetails(null);
    setIsFetchingDetails(true);

    try {
      // Create a specific prompt for the clicked feature
      const prompt = `Provide a detailed O-Level Geography examiner-style breakdown (Syllabus 2217) for "${feature.label}" in Pakistan. 
      Structure the response exactly as:
      ### [1] Curriculum Context: 
      [Detailed overview]
      ### [2] Regional/Physical Analysis: 
      [Distribution and physical factors]
      ### [3] Significance: 
      [Importance to Pakistan]
      ### [4] Tutor Wisdom: 
      [Exam tip]`;

      const response = await askAIFunction({ query: prompt, marks: 4 });
      if (response && response.answer) {
        setFeatureDetails(response.answer);
      }
    } catch (error) {
      console.error("Failed to fetch feature specific detail:", error);
    } finally {
      setIsFetchingDetails(false);
    }
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
            formattedRivers.length > 0 ? (
              <View style={styles.resultBlock}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={styles.resultHeading}>GIS visualization</Text>
                  {selectedFeature && (
                    <Pressable onPress={() => setSelectedFeature(null)}>
                      <Text style={{ color: Colors.accent, fontSize: 12, fontWeight: '700' }}>Clear Selection</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.mapShell}>
                  <GeoMapView 
                    rivers={formattedRivers} 
                    onFeaturePress={handleFeaturePress}
                    selectedFeatureId={selectedFeature?.label}
                  />
                </View>

                <GeoAnswerCard queryType={getQueryType()} />
              </View>
            ) : (
              <View style={styles.noDataCard}>
                <View style={styles.noDataIconBg}>
                  <MaterialCommunityIcons name="map-marker-off" size={40} color={Colors.accent} />
                </View>
                <Text style={styles.noDataTitle}>Not in Syllabus</Text>
                <Text style={styles.noDataText}>
                  The query "{searchQuery}" is not recognized as a geographical feature in the O-Level syllabus. Please search for specific topics like Rivers, Dams, Crops, or Provinces.
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

      {/* Feature Detail Popup */}
      <Modal
        visible={!!selectedFeature}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedFeature(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceAlt]}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <MaterialCommunityIcons 
                    name={selectedFeature?.renderType === 'marker' ? 'map-marker' : 'map-marker-path'} 
                    size={24} 
                    color={Colors.accent} 
                  />
                  <Text style={styles.modalTitle}>{selectedFeature?.label}</Text>
                </View>
                <Pressable onPress={() => setSelectedFeature(null)} hitSlop={10}>
                  <MaterialCommunityIcons name="close" size={24} color={Colors.textMuted} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalSubHeading}>
                  {selectedFeature?.renderType === 'polyline' ? 'River / Path Analysis' : 'Location Details'}
                </Text>
                
                {selectedFeature?.facts ? (
                   <View style={styles.factBox}>
                     <Text style={styles.factText}>{selectedFeature.facts}</Text>
                   </View>
                ) : null}

                <Text style={styles.modalDescriptionTitle}>Syllabus Context (AI Generated):</Text>
                
                {isFetchingDetails ? (
                  <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={Colors.accent} />
                    <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 8 }}>AI analyzing {selectedFeature?.label} specifically...</Text>
                  </View>
                ) : (
                  (featureDetails || apiResponse?.explanation) ? (featureDetails || apiResponse.explanation).split('###').map((part, index) => {
                    if (!part.trim()) return null;
                    
                    // Agar part heading se start ho raha hai (e.g. [1] Title)
                    const headingMatch = part.match(/^\s*(\[\d+\]\s+[^:\n]+)(?::|\n|$)/);
                    if (headingMatch) {
                      const heading = headingMatch[1];
                      const content = part.replace(headingMatch[0], '').trim();
                      return (
                        <View key={`part-${index}`} style={{ marginTop: 12 }}>
                          <Text style={styles.explanationHeading}>{heading}</Text>
                          <Text style={styles.modalDescription}>{content}</Text>
                        </View>
                      );
                    }
                    
                    return (
                      <Text key={`part-${index}`} style={styles.modalDescription}>
                        {part.trim()}
                      </Text>
                    );
                  }) : (
                    <Text style={styles.modalDescription}>Analyzing geographical significance...</Text>
                  )
                )}

                <View style={[styles.statusBadge, { backgroundColor: selectedFeature?.color + '22', borderColor: selectedFeature?.color }]}>
                   <Text style={[styles.statusBadgeText, { color: selectedFeature?.color }]}>Verified GIS Data</Text>
                </View>
              </ScrollView>

              <Pressable 
                onPress={() => setSelectedFeature(null)}
                style={({ pressed }) => [
                  styles.modalCloseBtn,
                  pressed && { opacity: 0.8 }
                ]}
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
      },
      android: { elevation: 8 },
    }),
  },
  resultBlock: {
    marginTop: 20,
  },
  resultHeading: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  mapShell: {
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  centerBox: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: Colors.white,
    marginTop: 10,
    fontSize: 14,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalGradient: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalSubHeading: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  factBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  factText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  modalDescriptionTitle: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    opacity: 0.6,
  },
  explanationHeading: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
    marginTop: 8,
  },
  modalDescription: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 20,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modalCloseBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  noDataCard: {
    marginTop: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  noDataIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noDataTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  noDataText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    width: '80%',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retryBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
