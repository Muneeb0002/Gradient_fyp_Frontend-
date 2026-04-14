import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "../../constants/Colors";

function TabIcon({ name, library, focused, color }) {
  if (library === "ionic") {
    return <Ionicons name={name} size={24} color={color} />;
  }
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <MaterialCommunityIcons
        name={focused ? name : name + "-outline"}
        size={24}
        color={color}
      />
    </View>
  );
}

export default function TabLayout() {
  const haptic = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-variant" library="mci" focused={focused} color={color} />
          ),
        }}
        listeners={{ tabPress: haptic }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="book-open-variant" library="mci" focused={focused} color={color} />
          ),
        }}
        listeners={{ tabPress: haptic }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="chart-timeline-variant" library="mci" focused={focused} color={color} />
          ),
        }}
        listeners={{ tabPress: haptic }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={23}
              color={color}
            />
          ),
        }}
        listeners={{ tabPress: haptic }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(11, 22, 40, 0.97)",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 24 : 16,
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(79, 209, 197, 0.25)",
    elevation: 12,
    shadowColor: "#4FD1C5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    paddingBottom: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },
});
