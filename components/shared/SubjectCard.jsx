import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import Colors from "../../constants/Colors";

/** `icon` = MaterialCommunityIcons name. */
export default function SubjectCard({ title, icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[48%] p-4 rounded-2xl mb-4 items-center"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <MaterialCommunityIcons name={icon} size={30} color={Colors.accent} />
      <Text className="mt-2 font-semibold" style={{ color: Colors.white }}>
        {title}
      </Text>
    </Pressable>
  );
}
