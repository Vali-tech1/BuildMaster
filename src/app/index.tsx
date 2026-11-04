import { ConstructionProjectCard } from "@/components/ConstructionProjectCard";
import { artikujt } from "@/data/artikujt";
import { getProjects } from "@/data/projects";
import type { ProjectSection } from "@/data/constructionProject.types";
import type { SupabaseProject } from "@/data/supabaseProject.types";
import { Link, Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Projektet
            </Text>
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
    </SafeAreaView>
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
