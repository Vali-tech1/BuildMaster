import { dilNgaLlogaria } from "@/lib/hyrja";
import { getAuthErrorMessage } from "@/lib/hyrja-offline";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ButoniDil() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setBusy(true);
    setError(null);

    try {
      await dilNgaLlogaria();
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void handleSignOut()}
        style={({ pressed }) => [
          styles.button,
          (pressed || busy) && styles.dimmed,
        ]}
      >
        <Text style={styles.buttonText}>{busy ? "Duke dalë..." : "Dil"}</Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "flex-end", marginBottom: 16 },
  button: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#e7edf3",
  },
  buttonText: { color: "#26384a", fontSize: 14, fontWeight: "700" },
  dimmed: { opacity: 0.65 },
  error: {
    marginTop: 6,
    color: "#a33b32",
    fontSize: 12,
    textAlign: "right",
  },
});
