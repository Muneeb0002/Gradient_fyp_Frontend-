import { Image, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function GeoMap() {
  return (
    <View
      className="p-4 rounded-2xl"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <Text style={{ color: Colors.accent }} className="font-bold mb-2">
        Map / Diagram Analysis
      </Text>

      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nile_delta.jpg/320px-Nile_delta.jpg",
        }}
        className="w-full h-40 rounded-2xl"
      />

      <Text style={{ color: "white", marginTop: 10 }}>
        📍 Nile Delta located in Egypt{"\n"}
        📍 Formed by sediment deposition{"\n"}
        📍 Fertile agricultural land
      </Text>
    </View>
  );
}
