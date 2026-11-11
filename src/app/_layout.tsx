import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SesioniProvider, useSesioni } from "@/contexts/sesioni";

export default function RootLayout() {
  return (
    <SesioniProvider>
      <AuthenticatedStack />
    </SesioniProvider>
  );
}

function AuthenticatedStack() {
  const { session, loading } = useSesioni();

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator accessibilityLabel="Po kontrollohet sesioni" />
      </SafeAreaView>
    );
  }

  const isAuthenticated = session !== null;

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="projects/[section]" />
        <Stack.Screen name="artikull/[id]" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="hyrja" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
