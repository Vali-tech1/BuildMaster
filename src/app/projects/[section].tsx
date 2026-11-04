import { getProjectById } from "@/data/projects";
import type { SupabaseProject } from "@/data/supabaseProject.types";
import type { ProjectSection } from "@/data/constructionProject.types";
import {
  calculateProjectProgress,
  calculateRemainingBudget,
  formatProjectCurrency,
} from "@/utils/construction-project";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sectionTitles: Record<ProjectSection, string> = {
  details: "Project Details",
  finances: "Financial Overview",
  reports: "Daily Reports",
};

function isProjectSection(
  section: string | undefined,
): section is ProjectSection {
  return section === "details" || section === "finances" || section === "reports";
}

export default function ProjectSectionScreen() {
  const { id, section: rawSection } = useLocalSearchParams<{
    id?: string | string[];
    section?: string | string[];
  }>();
  const section = Array.isArray(rawSection) ? rawSection[0] : rawSection;
  const projectId = Array.isArray(id) ? id[0] : id;
  const [project, setProject] = useState<SupabaseProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDark = useColorScheme() === "dark";
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const sectionTitle = isProjectSection(section)
    ? sectionTitles[section]
    : "Project";

  useEffect(() => {
    let active = true;

    async function loadProject() {
      if (!projectId) {
        setError("Project ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await getProjectById(projectId);
        if (active) {
          setProject(result);
        }
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Nuk u arrit të ngarkohet projekti.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProject();
    return () => {
      active = false;
    };
  }, [projectId]);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <Stack.Screen options={{ title: sectionTitle }} />
      <ScrollView
        contentContainerStyle={styles.content}
        style={styles.scrollView}
      >
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={styles.colors.accent} />
          </View>
        ) : error ? (
          <Text style={styles.bodyText}>{error}</Text>
        ) : !project ? (
          <Text style={styles.bodyText}>This project could not be found.</Text>
        ) : section === "details" ? (
          <DetailsContent project={project} styles={styles} />
        ) : section === "finances" ? (
          <FinancesContent project={project} styles={styles} />
        ) : section === "reports" ? (
          <ReportsContent project={project} styles={styles} />
        ) : (
          <Text style={styles.bodyText}>
            This project section is unavailable.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type ScreenStyles = ReturnType<typeof createStyles>;

function DetailsContent({
  project,
  styles,
}: {
  project: SupabaseProject;
  styles: ScreenStyles;
}) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.subtitle}>
        {project.location ?? "Location not provided"}
      </Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{project.status}</Text>
      </View>
      <DetailRow
        label="Project progress"
        value={`${calculateProjectProgress(project.progress)}%`}
        styles={styles}
      />
      {project.description && (
        <Text style={styles.description}>{project.description}</Text>
      )}
      {project.is_demo && (
        <Text style={styles.demoNote}>
          This is fictional sample data stored in Supabase.
        </Text>
      )}
    </View>
  );
}

function FinancesContent({
  project,
  styles,
}: {
  project: SupabaseProject;
  styles: ScreenStyles;
}) {
  const remaining = calculateRemainingBudget(project.budget, project.expenses);
  const spendingPercent =
    project.budget > 0
      ? Math.round((project.expenses / project.budget) * 100)
      : 0;
  const boundedSpendingPercent = Math.min(100, Math.max(0, spendingPercent));

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Project finances</Text>
      <Text style={styles.subtitle}>{project.name}</Text>
      <DetailRow
        label="Total budget"
        value={formatProjectCurrency(project.budget)}
        styles={styles}
      />
      <DetailRow
        label="Total expenses"
        value={formatProjectCurrency(project.expenses)}
        styles={styles}
      />
      <DetailRow
        label="Remaining budget"
        value={formatProjectCurrency(remaining)}
        styles={styles}
        highlight
      />
      <View style={styles.progressHeader}>
        <Text style={styles.rowLabel}>Budget spent</Text>
        <Text style={styles.rowValue}>{spendingPercent}%</Text>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Project budget spent"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: boundedSpendingPercent,
        }}
        style={styles.progressTrack}
      >
        <View
          style={[
            styles.progressFill,
            { width: `${boundedSpendingPercent}%` },
          ]}
        />
      </View>
      {project.is_demo && (
        <Text style={styles.demoNote}>
          These are fictional sample financial figures.
        </Text>
      )}
    </View>
  );
}

function ReportsContent({
  project,
  styles,
}: {
  project: SupabaseProject;
  styles: ScreenStyles;
}) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Daily Reports</Text>
      <Text style={styles.subtitle}>{project.name}</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>No reports yet</Text>
        <Text style={styles.bodyText}>
          Daily site reports will appear here when available. Report creation
          and storage have not been implemented yet.
        </Text>
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  styles,
  highlight = false,
}: {
  label: string;
  value: string;
  styles: ScreenStyles;
  highlight?: boolean;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.highlightValue]}>
        {value}
      </Text>
    </View>
  );
}

function createStyles(isDark: boolean) {
  const colors = {
    background: isDark ? "#0e151d" : "#f4f7fa",
    surface: isDark ? "#17212b" : "#ffffff",
    text: isDark ? "#f1f5f9" : "#182433",
    muted: isDark ? "#a4b1bf" : "#68788a",
    border: isDark ? "#334250" : "#e4eaf0",
    accent: isDark ? "#94b6dc" : "#355d86",
    accentSurface: isDark ? "#26394b" : "#edf3f9",
    track: isDark ? "#344454" : "#e8edf2",
  };

  return {
    colors,
    ...StyleSheet.create({
      safeArea: { flex: 1, backgroundColor: colors.background },
      scrollView: { flex: 1 },
      content: {
        flexGrow: 1,
        width: "100%",
        maxWidth: 680,
        alignSelf: "center",
        padding: 16,
      },
      panel: {
        padding: 18,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        backgroundColor: colors.surface,
      },
      loading: { paddingVertical: 28, alignItems: "center" },
      title: {
        color: colors.text,
        fontSize: 21,
        fontWeight: "700",
        lineHeight: 28,
      },
      subtitle: {
        marginTop: 5,
        marginBottom: 14,
        color: colors.muted,
        fontSize: 14,
      },
      statusBadge: {
        alignSelf: "flex-start",
        marginBottom: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.accentSurface,
      },
      statusText: { color: colors.accent, fontSize: 12, fontWeight: "700" },
      detailRow: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      },
      rowLabel: { color: colors.muted, fontSize: 13, flexShrink: 1 },
      rowValue: {
        marginLeft: 12,
        color: colors.text,
        fontSize: 14,
        fontWeight: "600",
        textAlign: "right",
        flexShrink: 1,
      },
      highlightValue: { color: colors.accent },
      description: {
        marginTop: 12,
        color: colors.muted,
        fontSize: 14,
        lineHeight: 21,
      },
      progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        marginBottom: 8,
      },
      progressTrack: {
        height: 9,
        overflow: "hidden",
        borderRadius: 8,
        backgroundColor: colors.track,
      },
      progressFill: {
        height: "100%",
        borderRadius: 8,
        backgroundColor: colors.accent,
      },
      demoNote: {
        marginTop: 18,
        color: colors.muted,
        fontSize: 12,
        lineHeight: 18,
      },
      emptyState: {
        marginTop: 8,
        padding: 16,
        borderRadius: 14,
        backgroundColor: colors.background,
      },
      emptyStateTitle: {
        marginBottom: 6,
        color: colors.text,
        fontSize: 16,
        fontWeight: "700",
      },
      bodyText: { color: colors.muted, fontSize: 14, lineHeight: 21 },
    }),
  };
}
