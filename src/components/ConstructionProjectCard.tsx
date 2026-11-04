import { SymbolView } from "expo-symbols";
import type { AndroidSymbol, SFSymbol } from "expo-symbols";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import type {
  SupabaseProject,
} from "@/data/supabaseProject.types";
import type { ProjectSection } from "@/data/constructionProject.types";
import {
  calculateProjectProgress,
  calculateRemainingBudget,
  formatProjectCurrency,
} from "@/utils/construction-project";

type ConstructionProjectCardProps = {
  project: SupabaseProject;
  onNavigate: (section: ProjectSection, projectId: string) => void;
};

type ProjectIconProps = {
  ios: SFSymbol;
  material: AndroidSymbol;
  color: string;
  size?: number;
};

const statusStyles = {
  "In Progress": { background: "#eaf5ee", text: "#247248", dot: "#31945c" },
  Completed: { background: "#eaf1fb", text: "#315f9d", dot: "#4783c5" },
  Delayed: { background: "#fff2e8", text: "#a64f18", dot: "#db742f" },
  Planned: { background: "#edf3f9", text: "#355d86", dot: "#5c83aa" },
} as const;

function ProjectIcon({ ios, material, color, size = 18 }: ProjectIconProps) {
  return (
    <SymbolView
      name={{ ios, android: material, web: material }}
      tintColor={color}
      size={size}
    />
  );
}

export function ConstructionProjectCard({
  project,
  onNavigate,
}: ConstructionProjectCardProps) {
  const isDark = useColorScheme() === "dark";
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const [menuVisible, setMenuVisible] = useState(false);
  const progress = calculateProjectProgress(project.progress);
  const remainingBudget = calculateRemainingBudget(
    project.budget,
    project.expenses,
  );
  const progressWidth = `${progress}%` as `${number}%`;
  const status = statusStyles[project.status];

  function shareProject() {
    setMenuVisible(false);
    void Share.share({
      message: `${project.name} · ${project.location} · ${progress}% complete`,
    }).catch(() => {
      Alert.alert("Unable to share", "Please try sharing the project again.");
    });
  }

  return (
    <View style={styles.card}>
      {project.is_demo && (
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>SAMPLE PROJECT</Text>
        </View>
      )}

      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <Text style={styles.projectName}>{project.name}</Text>
          <View style={styles.location}>
            <ProjectIcon
              ios="mappin.and.ellipse"
              material="location_on"
              color={styles.colors.muted}
              size={16}
            />
            <Text style={styles.locationText}>
              {project.location ?? "Location not provided"}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityLabel="More project actions"
          accessibilityRole="button"
          hitSlop={6}
          onPress={() => setMenuVisible(true)}
          style={({ pressed }) => [
            styles.menuButton,
            pressed && styles.pressed,
          ]}
        >
          <ProjectIcon
            ios="ellipsis"
            material="more_vert"
            color={styles.colors.text}
            size={20}
          />
        </Pressable>
      </View>

      <View
        style={[
          styles.statusBadge,
          { backgroundColor: status.background },
        ]}
      >
        <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
        <Text style={[styles.statusText, { color: status.text }]}>
          {project.status}
        </Text>
      </View>

      <View style={styles.preview}>
        <View style={styles.previewPlaceholder}>
          <View style={styles.previewIcon}>
            <ProjectIcon
              ios="building.2.fill"
              material="apartment"
              color="#e7edf4"
              size={34}
            />
          </View>
          <View style={styles.previewCopy}>
            <Text style={styles.previewEyebrow}>PROJECT PREVIEW</Text>
            <Text style={styles.previewTitle}>Construction project</Text>
            <Text style={styles.previewCaption}>{project.status}</Text>
          </View>
          <ProjectIcon
            ios="hammer.fill"
            material="construction"
            color="#aab9ca"
            size={22}
          />
        </View>
      </View>

      {project.description && (
        <>
          <SectionHeading title="Project information" styles={styles} />
          <Text style={styles.descriptionText}>{project.description}</Text>
        </>
      )}

      <SectionHeading title="Financial overview" styles={styles} />
      <View style={styles.financialGrid}>
        <FinancialMetric
          label="Total budget"
          value={formatProjectCurrency(project.budget)}
          styles={styles}
        />
        <FinancialMetric
          label="Total expenses"
          value={formatProjectCurrency(project.expenses)}
          styles={styles}
        />
        <View style={[styles.remainingMetric, styles.metricFullWidth]}>
          <Text style={styles.metricLabel}>Remaining budget</Text>
          <Text style={styles.remainingValue}>
            {formatProjectCurrency(remainingBudget)}
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Project progress</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Project progress"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          style={styles.progressTrack}
        >
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressCaption}>
          Overall construction progress
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onNavigate("details", project.id)}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>View Details</Text>
        <ProjectIcon
          ios="arrow.right"
          material="arrow_forward"
          color="#ffffff"
          size={18}
        />
      </Pressable>
      <View style={styles.secondaryActions}>
        <ActionButton
          label="Financial Overview"
          iosIcon="chart.pie"
          materialIcon="account_balance_wallet"
          onPress={() => onNavigate("finances", project.id)}
          styles={styles}
        />
        <ActionButton
          label="Daily Reports"
          iosIcon="doc.text"
          materialIcon="description"
          onPress={() => onNavigate("reports", project.id)}
          styles={styles}
        />
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
        transparent
        visible={menuVisible}
      >
        <Pressable
          accessibilityLabel="Close project actions"
          onPress={() => setMenuVisible(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.menuSheet}>
            <Text style={styles.menuTitle}>Project actions</Text>
            <Pressable
              accessibilityRole="button"
              onPress={shareProject}
              style={({ pressed }) => [
                styles.menuAction,
                pressed && styles.pressed,
              ]}
            >
              <ProjectIcon
                ios="square.and.arrow.up"
                material="ios_share"
                color={styles.colors.text}
                size={19}
              />
              <Text style={styles.menuActionText}>Share project</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setMenuVisible(false)}
              style={({ pressed }) => [
                styles.menuAction,
                pressed && styles.pressed,
              ]}
            >
              <ProjectIcon
                ios="xmark"
                material="close"
                color={styles.colors.muted}
                size={18}
              />
              <Text style={styles.menuActionText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

type CardStyles = ReturnType<typeof createStyles>;

function SectionHeading({
  title,
  styles,
}: {
  title: string;
  styles: CardStyles;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function FinancialMetric({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: CardStyles;
}) {
  return (
    <View style={styles.financialMetric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

function ActionButton({
  label,
  iosIcon,
  materialIcon,
  onPress,
  styles,
}: {
  label: string;
  iosIcon: SFSymbol;
  materialIcon: AndroidSymbol;
  onPress: () => void;
  styles: CardStyles;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryButton,
        pressed && styles.pressed,
      ]}
    >
      <ProjectIcon
        ios={iosIcon}
        material={materialIcon}
        color={styles.colors.accent}
        size={18}
      />
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function createStyles(isDark: boolean) {
  const colors = {
    surface: isDark ? "#17212b" : "#ffffff",
    elevated: isDark ? "#202d39" : "#f7f9fc",
    text: isDark ? "#f1f5f9" : "#182433",
    muted: isDark ? "#a4b1bf" : "#68788a",
    border: isDark ? "#334250" : "#e4eaf0",
    accent: isDark ? "#94b6dc" : "#355d86",
    accentSurface: isDark ? "#26394b" : "#edf3f9",
    success: isDark ? "#76d49a" : "#267448",
    warning: isDark ? "#ffb27b" : "#a64f18",
    track: isDark ? "#344454" : "#e8edf2",
    preview: "#26394b",
    backdrop: "rgba(4, 10, 18, 0.55)",
  };

  return {
    colors,
    ...StyleSheet.create({
      card: {
        alignSelf: "center",
        width: "100%",
        maxWidth: 640,
        padding: 16,
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 22,
        shadowColor: "#101820",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: isDark ? 0.22 : 0.08,
        shadowRadius: 15,
        elevation: 3,
      },
      demoBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 6,
        backgroundColor: colors.accentSurface,
      },
      demoBadgeText: {
        color: colors.accent,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.7,
      },
      heading: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 14,
      },
      headingCopy: { flex: 1, minWidth: 0, paddingRight: 8 },
      projectName: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: -0.35,
        lineHeight: 26,
      },
      location: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
      },
      locationText: {
        marginLeft: 5,
        color: colors.muted,
        fontSize: 13,
        flexShrink: 1,
      },
      menuButton: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: colors.elevated,
      },
      pressed: { opacity: 0.72 },
      statusBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
      },
      statusDot: {
        width: 7,
        height: 7,
        marginRight: 7,
        borderRadius: 4,
      },
      statusText: { fontSize: 12, fontWeight: "700" },
      preview: {
        height: 116,
        marginTop: 16,
        marginBottom: 21,
        overflow: "hidden",
        borderRadius: 15,
        backgroundColor: colors.preview,
      },
      previewImage: { width: "100%", height: "100%" },
      previewPlaceholder: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
      },
      previewIcon: {
        width: 58,
        height: 58,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.08)",
      },
      previewCopy: { flex: 1, minWidth: 0, marginLeft: 13 },
      previewEyebrow: {
        color: "#b9c9d9",
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 1,
      },
      previewTitle: {
        marginTop: 5,
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "700",
      },
      previewCaption: {
        marginTop: 3,
        color: "#cad6e2",
        fontSize: 12,
      },
      sectionTitle: {
        marginTop: 19,
        marginBottom: 10,
        color: colors.text,
        fontSize: 14,
        fontWeight: "700",
      },
      descriptionText: {
        color: colors.muted,
        fontSize: 13,
        lineHeight: 20,
      },
      informationGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
      informationItem: {
        width: "48%",
        minHeight: 54,
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 8,
      },
      informationCopy: { flex: 1, minWidth: 0, marginLeft: 8 },
      informationLabel: { color: colors.muted, fontSize: 11 },
      informationValue: {
        marginTop: 4,
        color: colors.text,
        fontSize: 12,
        fontWeight: "600",
      },
      financialGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
      financialMetric: {
        width: "48%",
        minHeight: 69,
        justifyContent: "center",
        padding: 11,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 13,
        backgroundColor: colors.elevated,
      },
      metricLabel: { color: colors.muted, fontSize: 11 },
      metricValue: {
        marginTop: 6,
        color: colors.text,
        fontSize: 16,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
      },
      remainingMetric: {
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 8,
        paddingHorizontal: 12,
        borderRadius: 13,
        backgroundColor: colors.accentSurface,
      },
      metricFullWidth: { width: "100%" },
      remainingValue: {
        color: colors.success,
        fontSize: 16,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
      },
      progressSection: { marginTop: 20 },
      sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 9,
      },
      progressValue: {
        color: colors.accent,
        fontSize: 15,
        fontWeight: "700",
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
      progressCaption: {
        marginTop: 7,
        color: colors.muted,
        fontSize: 11,
      },
      statisticsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
      statistic: {
        width: "48%",
        minHeight: 62,
        justifyContent: "center",
        marginBottom: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 13,
        backgroundColor: colors.elevated,
      },
      statisticValue: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
      },
      warningText: { color: colors.warning },
      statisticLabel: {
        marginTop: 2,
        color: colors.muted,
        fontSize: 11,
      },
      primaryButton: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
        borderRadius: 13,
        backgroundColor: colors.accent,
      },
      primaryButtonText: {
        marginRight: 9,
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "700",
      },
      secondaryActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 9,
      },
      secondaryButton: {
        minHeight: 48,
        width: "48%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.surface,
      },
      secondaryButtonText: {
        flexShrink: 1,
        marginLeft: 7,
        color: colors.text,
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
      },
      modalBackdrop: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: colors.backdrop,
      },
      menuSheet: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 26,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        backgroundColor: colors.surface,
      },
      menuTitle: {
        marginBottom: 8,
        color: colors.text,
        fontSize: 16,
        fontWeight: "700",
      },
      menuAction: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      },
      menuActionText: {
        marginLeft: 12,
        color: colors.text,
        fontSize: 14,
      },
    }),
  };
}
