import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppDecor from "../shared/AppDecor";
import Colors from "../../constants/Colors";

export default function AdminScreenShell({
  children,
  scroll = true,
  refreshControl,
  contentStyle,
  edges = ["top", "left", "right"],
}) {
  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scroll, contentStyle]}
      refreshControl={refreshControl}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scroll, styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <LinearGradient
      colors={[
        Colors.backgroundStart,
        Colors.backgroundMiddle,
        Colors.backgroundEnd,
      ]}
      style={styles.root}
    >
      <AppDecor />
      <SafeAreaView style={styles.safe} edges={edges}>
        {body}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingBottom: 40, paddingTop: 8 },
});
