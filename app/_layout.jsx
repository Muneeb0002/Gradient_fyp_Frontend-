import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import StartupSplash from "../components/startup/StartupSplash";
import Colors from "../constants/Colors";
import { PortalStudentsProvider } from "../src/context/PortalStudentsContext";
import "../global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <PortalStudentsProvider>
        <SafeAreaProvider>
          <View style={styles.root}>
            <Stack screenOptions={{ headerShown: false }} />
          {showSplash ? (
            <StartupSplash onFinish={() => setShowSplash(false)} />
          ) : null}
          </View>
        </SafeAreaProvider>
      </PortalStudentsProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundStart,
  },
});
