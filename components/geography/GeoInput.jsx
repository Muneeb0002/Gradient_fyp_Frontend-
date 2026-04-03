import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import Colors from "../../constants/Colors";

const MAX_IMAGES = 3;

export default function GeoInput({ onSubmit, compact = false }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Limit reached", `You can add up to ${MAX_IMAGES} images.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow gallery access to upload maps.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setImages((prev) => [...prev, result.assets[0].uri].slice(0, MAX_IMAGES));
    }
  };

  const removeAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <View>
      {!compact ? (
        <Text style={{ color: Colors.textSecondary }}>
          Enter your question (optional)
        </Text>
      ) : null}

      <TextInput
        placeholder="e.g. Explain Indus River system"
        placeholderTextColor={Colors.textMuted}
        value={text}
        onChangeText={setText}
        className={compact ? "p-4 rounded-2xl" : "mt-2 p-4 rounded-2xl"}
        style={{
          backgroundColor: Colors.surfaceAlt,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          color: Colors.white,
          minHeight: 100,
        }}
        multiline
      />

      <Text style={styles.label}>Maps / diagrams (optional, max {MAX_IMAGES})</Text>

      <View style={styles.grid}>
        {images.map((uri, idx) => (
          <View key={`${uri}-${idx}`} style={styles.thumbWrap}>
            <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
            <Pressable
              onPress={() => removeAt(idx)}
              style={styles.removeFab}
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={22}
                color={Colors.white}
              />
            </Pressable>
          </View>
        ))}
        {images.length < MAX_IMAGES && (
          <Pressable
            onPress={pickImage}
            style={({ pressed }) => [
              styles.addTile,
              pressed && { opacity: 0.88 },
            ]}
          >
            <MaterialCommunityIcons
              name="image-plus"
              size={28}
              color={Colors.accent}
            />
            <Text style={styles.addTileText}>
              Add ({images.length}/{MAX_IMAGES})
            </Text>
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={() => onSubmit({ text, images })}
        className="py-4 rounded-2xl items-center mt-4"
        style={{
          backgroundColor: Colors.primary,
          borderWidth: 1,
          borderColor: Colors.primaryDark,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Analyze</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  thumbWrap: {
    width: "31%",
    marginHorizontal: "1%",
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  removeFab: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
  },
  addTile: {
    width: "31%",
    marginHorizontal: "1%",
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderStyle: "dashed",
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  addTileText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
});
