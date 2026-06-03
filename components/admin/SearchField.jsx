import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import Colors from "../../constants/Colors";

export default function SearchField({ value, onChangeText, placeholder = "Search..." }) {
  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color={Colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: Colors.white,
    fontSize: 15,
    fontWeight: "500",
  },
});
