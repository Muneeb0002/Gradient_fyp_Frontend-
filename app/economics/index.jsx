import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../../components/shared/AppDecor";
import PrimaryButton from "../../components/auth/PrimaryButton";
import Colors from "../../constants/Colors";

export default function EconomicsScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      className="flex-1"
    >
      <AppDecor />
      <SafeAreaView className="flex-1 px-6 py-8">
        <Pressable onPress={() => router.back()} className="mb-4">
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={Colors.white}
          />
        </Pressable>

        <View
          className="flex-1 justify-center items-center px-2"
          style={{ minHeight: 280 }}
        >
          <View
            className="w-20 h-20 rounded-3xl items-center justify-center mb-6"
            style={{
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
            }}
          >
            <MaterialCommunityIcons
              name="chart-line"
              size={40}
              color={Colors.accent}
            />
          </View>
          <Text
            className="text-2xl font-bold text-center"
            style={{ color: Colors.accent }}
          >
            Economics
          </Text>
          <Text
            className="text-center mt-3 text-base leading-6"
            style={{ color: Colors.textSecondary }}
          >
            Yeh module jald aa raha hai — definitions, diagrams, aur past-paper
            style practice ke saath.
          </Text>
        </View>

        <PrimaryButton
          title="Back to dashboard"
          handlePress={() => router.replace("/(tabs)")}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
