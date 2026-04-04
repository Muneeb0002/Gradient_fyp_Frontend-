import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
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

export default function GeographyMapsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
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
    }
  };

  const formatCoord = (coord) => ({ latitude: coord[0], longitude: coord[1] });

  const formattedRivers = [
    ...(apiResponse?.points?.map((point) => ({
      label: point.label,
      color: point.color || Colors.accent,
      coords: point.data.map((p) => formatCoord(p.coordinates ?? p)),
      renderType: "marker",
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
    })) || []),
  ];

  const getQueryType = () => "text";

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
                AI Engine analyzing rivers...
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
            <View style={styles.resultBlock}>
              <Text style={styles.resultHeading}>GIS visualization</Text>

              <View style={styles.mapShell}>
                <GeoMapView rivers={formattedRivers} />
              </View>

              <GeoAnswerCard queryType={getQueryType()} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
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
    marginBottom: 10,
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
});
