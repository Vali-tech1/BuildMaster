import { ConstructionProjectCard } from "@/components/ConstructionProjectCard";
import { artikujt } from "@/data/artikujt";
import { createProject, getProjects } from "@/data/projects";
import type { ProjectSection } from "@/data/constructionProject.types";
import type {
  ProjectStatus,
  SupabaseProject,
} from "@/data/supabaseProject.types";
import { Link, Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProjectForm = {
  name: string;
  location: string;
  description: string;
  status: ProjectStatus;
  progress: string;
  budget: string;
  expenses: string;
};

const initialForm: ProjectForm = {
  name: "",
  location: "",
  description: "",
  status: "Planned",
  progress: "0",
  budget: "0",
  expenses: "0",
};

const projectStatuses: ProjectStatus[] = [
  "Planned",
  "In Progress",
  "Delayed",
  "Completed",
];

export default function Index() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProjects = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      setProjects(await getProjects());
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Nuk u arrit të ngarkohen projektet.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getProjects()
      .then((data) => {
        if (active) {
          setProjects(data);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Nuk u arrit të ngarkohen projektet.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function navigateToProjectSection(section: ProjectSection, projectId: string) {
    router.push({
      pathname: "/projects/[section]",
      params: { section, id: projectId },
    });
  }

  async function handleCreateProject() {
    const name = form.name.trim();
    const progress = Number(form.progress);
    const budget = Number(form.budget);
    const expenses = Number(form.expenses);

    if (!name) {
      setFormError("Emri i projektit është i detyrueshëm.");
      return;
    }

    if (
      !Number.isInteger(progress) ||
      progress < 0 ||
      progress > 100 ||
      !Number.isFinite(budget) ||
      budget < 0 ||
      !Number.isFinite(expenses) ||
      expenses < 0
    ) {
      setFormError(
        "Progresi duhet të jetë 0–100; buxheti dhe shpenzimet nuk mund të jenë negative.",
      );
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const createdProject = await createProject({
        name,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        status: form.status,
        progress,
        budget,
        expenses,
      });
      setProjects((current) => [createdProject, ...current]);
      setForm(initialForm);
      setFormVisible(false);
    } catch (cause) {
      setFormError(
        cause instanceof Error
          ? cause.message
          : "Projekti nuk u ruajt në Supabase.",
      );
    } finally {
      setSaving(false);
    }
  }

  function renderEmptyState() {
    if (loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator color={isDark ? "#94b6dc" : "#355d86"} />
          <Text style={[styles.stateText, isDark && styles.mutedDark]}>
            Po ngarkohen projektet...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.state}>
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void loadProjects()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Provo përsëri</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <Text style={[styles.stateText, isDark && styles.mutedDark]}>
        Nuk ka projekte në Supabase.
      </Text>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? "#0e151d" : "#f5f7fa" },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        contentContainerStyle={[
          styles.container,
          { backgroundColor: isDark ? "#0e151d" : "#f5f7fa" },
        ]}
        data={projects}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadProjects()}
            tintColor={isDark ? "#94b6dc" : "#355d86"}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.titulli, isDark && styles.textDark]}>
              BuildMaster
            </Text>
            <Text style={[styles.pershkrimi, isDark && styles.mutedDark]}>
              Përmbledhje e projekteve ndërtimore
            </Text>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                Projektet
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setFormError(null);
                  setFormVisible(true);
                }}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.addButtonText}>+ Shto projekt</Text>
              </Pressable>
            </View>
            {error && projects.length > 0 && (
              <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
                {error}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.projectItem}>
            <ConstructionProjectCard
              onNavigate={navigateToProjectSection}
              project={item}
            />
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          <View style={styles.articles}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Artikujt
            </Text>
            {artikujt.map((item) => (
              <Link
                key={item.id}
                style={[styles.rreshti, isDark && styles.rreshtiDark]}
                href={{
                  pathname: "/artikull/[id]",
                  params: { id: item.id },
                }}
              >
                {item.titulli}
              </Link>
            ))}
          </View>
        }
      />
      <Modal
        animationType="slide"
        onRequestClose={() => {
          if (!saving) setFormVisible(false);
        }}
        transparent
        visible={formVisible}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackdrop}
        >
          <View
            style={[
              styles.formSheet,
              isDark && styles.formSheetDark,
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.formTitle, isDark && styles.textDark]}>
                Shto projekt të ri
              </Text>
              <Text style={[styles.formNotice, isDark && styles.mutedDark]}>
                Demo publike: ky projekt do të jetë i dukshëm për këdo që ka
                aplikacionin. Mos vendos të dhëna konfidenciale.
              </Text>
              <FormField
                label="Emri i projektit *"
                value={form.name}
                onChangeText={(name) => setForm((current) => ({ ...current, name }))}
                isDark={isDark}
              />
              <FormField
                label="Lokacioni"
                value={form.location}
                onChangeText={(location) =>
                  setForm((current) => ({ ...current, location }))
                }
                isDark={isDark}
              />
              <FormField
                label="Përshkrimi"
                value={form.description}
                onChangeText={(description) =>
                  setForm((current) => ({ ...current, description }))
                }
                isDark={isDark}
                multiline
              />
              <Text style={[styles.fieldLabel, isDark && styles.mutedDark]}>
                Statusi
              </Text>
              <View style={styles.statusOptions}>
                {projectStatuses.map((status) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: form.status === status }}
                    key={status}
                    onPress={() => setForm((current) => ({ ...current, status }))}
                    style={[
                      styles.statusOption,
                      isDark && styles.statusOptionDark,
                      form.status === status && styles.statusOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        isDark && styles.mutedDark,
                        form.status === status && styles.statusOptionTextSelected,
                      ]}
                    >
                      {status}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <FormField
                label="Progresi (%)"
                value={form.progress}
                onChangeText={(progress) =>
                  setForm((current) => ({ ...current, progress }))
                }
                isDark={isDark}
                keyboardType="number-pad"
              />
              <FormField
                label="Buxheti (€)"
                value={form.budget}
                onChangeText={(budget) =>
                  setForm((current) => ({ ...current, budget }))
                }
                isDark={isDark}
                keyboardType="decimal-pad"
              />
              <FormField
                label="Shpenzimet (€)"
                value={form.expenses}
                onChangeText={(expenses) =>
                  setForm((current) => ({ ...current, expenses }))
                }
                isDark={isDark}
                keyboardType="decimal-pad"
              />
              {formError && (
                <Text style={[styles.formError, isDark && styles.errorTextDark]}>
                  {formError}
                </Text>
              )}
              <View style={styles.formActions}>
                <Pressable
                  accessibilityRole="button"
                  disabled={saving}
                  onPress={() => setFormVisible(false)}
                  style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
                >
                  <Text style={[styles.cancelButtonText, isDark && styles.textDark]}>
                    Anulo
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={saving}
                  onPress={() => void handleCreateProject()}
                  style={[styles.saveButton, saving && styles.disabledButton]}
                >
                  {saving ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Ruaj në Supabase</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  isDark,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  isDark: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "number-pad" | "decimal-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, isDark && styles.mutedDark]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={isDark ? "#8291a0" : "#8996a3"}
        style={[
          styles.input,
          isDark && styles.inputDark,
          multiline && styles.multilineInput,
        ]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    alignSelf: "center",
    width: "100%",
    maxWidth: 800,
  },
  header: {
    width: "100%",
  },
  titulli: {
    color: "#1e293b",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  pershkrimi: {
    marginTop: 4,
    marginBottom: 20,
    color: "#64748b",
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    color: "#26384a",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#355d86",
  },
  addButtonText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  pressed: { opacity: 0.75 },
  projectItem: { marginBottom: 16 },
  state: {
    alignItems: "center",
    paddingVertical: 28,
  },
  stateText: {
    paddingVertical: 16,
    color: "#64748b",
    textAlign: "center",
  },
  errorText: {
    color: "#a33b32",
    fontSize: 14,
    textAlign: "center",
  },
  errorTextDark: { color: "#ff9d91" },
  retryButton: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#355d86",
  },
  retryButtonText: { color: "#ffffff", fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(4, 10, 18, 0.58)",
  },
  formSheet: {
    maxHeight: "92%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#ffffff",
  },
  formSheetDark: { backgroundColor: "#17212b" },
  formContent: { padding: 20, paddingBottom: 36 },
  formTitle: {
    color: "#182433",
    fontSize: 21,
    fontWeight: "700",
  },
  formNotice: {
    marginTop: 8,
    marginBottom: 14,
    color: "#68788a",
    fontSize: 12,
    lineHeight: 18,
  },
  field: { marginTop: 10 },
  fieldLabel: {
    marginBottom: 6,
    color: "#68788a",
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  multilineInput: { minHeight: 78, textAlignVertical: "top" },
  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#d9e1e8",
    borderRadius: 18,
  },
  statusOptionDark: { borderColor: "#40515f" },
  statusOptionSelected: {
    borderColor: "#355d86",
    backgroundColor: "#355d86",
  },
  statusOptionText: { color: "#526171", fontSize: 12 },
  statusOptionTextSelected: { color: "#ffffff", fontWeight: "700" },
  formError: {
    marginTop: 14,
    color: "#a33b32",
    fontSize: 13,
    lineHeight: 19,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#edf1f5",
  },
  cancelButtonDark: { backgroundColor: "#263746" },
  cancelButtonText: { color: "#26384a", fontWeight: "600" },
  saveButton: {
    minHeight: 44,
    minWidth: 150,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#355d86",
  },
  disabledButton: { opacity: 0.65 },
  saveButtonText: { color: "#ffffff", fontWeight: "700" },
  articles: { marginTop: 20 },
  rreshti: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d9e1e8",
    paddingVertical: 16,
    color: "#34495e",
    fontSize: 15,
  },
  textDark: { color: "#f1f5f9" },
  mutedDark: { color: "#a4b1bf" },
  rreshtiDark: {
    borderBottomColor: "#334250",
    color: "#d8e2ec",
  },
});
