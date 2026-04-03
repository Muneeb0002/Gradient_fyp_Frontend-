// import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import "../global.css";

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <Stack screenOptions={{ headerShown: false }} />
//     </SafeAreaProvider>
//   );
// }
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // 1. QueryClient import karein
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

// 2. QueryClient ka instance create karein (ise function ke bahar rakhein)
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // 3. Poori app ko QueryClientProvider mein wrap karein
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}