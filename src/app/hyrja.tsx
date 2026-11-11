import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSesioni } from "@/contexts/sesioni";
import { getAuthErrorMessage } from "@/lib/hyrja-offline";
import { krijoLlogari, hyjMeEmail } from "@/lib/hyrja";

type AuthMode = "sign-in" | "sign-up";

export default function HyrjaScreen() {
  const isDark = useColorScheme() === "dark";
  const { error: sessionError } = useSesioni();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Shkruaj email-in dhe fjalëkalimin.");
      setMessage(null);
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const session =
        mode === "sign-up"
          ? await krijoLlogari(normalizedEmail, password)
          : await hyjMeEmail(normalizedEmail, password);

      if (mode === "sign-up" && !session) {
        setMessage(
          "Llogaria u krijua, por sesioni nuk u hap. Kontrollo cilësimin e konfirmimit të email-it në Supabase.",
        );
      }
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setMessage(null);
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? "#0e151d" : "#f5f7fa" },
      ]}
    >
      <Stack.Screen options={{ title: "Hyrja", headerShown: false }} />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, isDark && styles.cardDark]}>
            <Text style={[styles.title, isDark && styles.textDark]}>
              BuildMaster
            </Text>
            <Text style={[styles.subtitle, isDark && styles.mutedDark]}>
              {mode === "sign-up" ? "Krijo llogari" : "Hyr në llogari"}
            </Text>

            <Text style={[styles.label, isDark && styles.mutedDark]}>
              Email
            </Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="emri@example.com"
              placeholderTextColor={isDark ? "#8291a0" : "#8996a3"}
              style={[styles.input, isDark && styles.inputDark]}
              textContentType="emailAddress"
              value={email}
            />

            <Text style={[styles.label, isDark && styles.mutedDark]}>
              Fjalëkalimi
            </Text>
            <TextInput
              accessibilityLabel="Fjalëkalimi"
              autoCapitalize="none"
              autoComplete={mode === "sign-up" ? "new-password" : "password"}
              onChangeText={setPassword}
              onSubmitEditing={() => void handleSubmit()}
              placeholder="Fjalëkalimi"
              placeholderTextColor={isDark ? "#8291a0" : "#8996a3"}
              returnKeyType="done"
              secureTextEntry
              style={[styles.input, isDark && styles.inputDark]}
              textContentType={
                mode === "sign-up" ? "newPassword" : "password"
              }
              value={password}
            />

            {(sessionError || error) && (
              <Text style={styles.error}>{error ?? sessionError}</Text>
            )}
            {message && <Text style={styles.message}>{message}</Text>}

            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => void handleSubmit()}
              style={({ pressed }) => [
                styles.submit,
                (pressed || busy) && styles.dimmed,
              ]}
            >
              {busy ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitText}>
                  {mode === "sign-up" ? "Krijo llogari" : "Hyr"}
                </Text>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() =>
                changeMode(mode === "sign-up" ? "sign-in" : "sign-up")
              }
              style={styles.modeButton}
            >
              <Text style={[styles.modeText, isDark && styles.modeTextDark]}>
                {mode === "sign-up"
                  ? "Ke llogari? Hyr"
                  : "Nuk ke llogari? Krijo llogari"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboard: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 440,
    padding: 24,
    borderRadius: 18,
    backgroundColor: "#ffffff",
  },
  cardDark: { backgroundColor: "#17212b" },
  title: {
    color: "#182433",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
  },
  textDark: { color: "#f1f5f9" },
  mutedDark: { color: "#aab7c4" },
  label: {
    marginTop: 12,
    marginBottom: 6,
    color: "#68788a",
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d9e1e8",
    borderRadius: 10,
    color: "#182433",
    backgroundColor: "#ffffff",
    fontSize: 15,
  },
  inputDark: {
    borderColor: "#334250",
    color: "#f1f5f9",
    backgroundColor: "#202d39",
  },
  error: {
    marginTop: 14,
    color: "#a33b32",
    fontSize: 13,
    lineHeight: 19,
  },
  message: {
    marginTop: 14,
    color: "#355d86",
    fontSize: 13,
    lineHeight: 19,
  },
  submit: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    borderRadius: 10,
    backgroundColor: "#355d86",
  },
  submitText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  dimmed: { opacity: 0.65 },
  modeButton: { alignItems: "center", paddingVertical: 16 },
  modeText: { color: "#355d86", fontSize: 14, fontWeight: "600" },
  modeTextDark: { color: "#94b6dc" },
});
