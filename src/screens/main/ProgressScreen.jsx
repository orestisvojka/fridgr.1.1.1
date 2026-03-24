import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Target,
  TrendingUp,
  Calendar,
  Flame,
  Apple,
  Droplets,
  Zap,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    header: {
      backgroundColor: C.surface,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    headerTitle: { ...FONT.h2, color: C.text, marginBottom: SPACING.sm },
    headerSubtitle: { ...FONT.body, color: C.textSecondary },
    section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl },
    sectionTitle: { ...FONT.h4, color: C.text, marginBottom: SPACING.md },
    card: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    progressCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
    progressTitle: { ...FONT.h4, color: C.text },
    progressValue: { ...FONT.h3, color: C.primary },
    progressBar: {
      height: 8,
      backgroundColor: C.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: SPACING.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: C.primary,
      borderRadius: 4,
    },
    progressText: { ...FONT.caption, color: C.textSecondary },
    macroGrid: { flexDirection: 'row', gap: SPACING.md },
    macroCard: {
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    macroIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm,
    },
    macroValue: { ...FONT.h4, color: C.text, marginBottom: 2 },
    macroLabel: { ...FONT.caption, color: C.textSecondary },
    chartPlaceholder: {
      height: 200,
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    chartText: { ...FONT.body, color: C.textSecondary },
  });
}

function ProgressCard({ title, current, target, unit, color, styles }) {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>{title}</Text>
        <Text style={styles.progressValue}>{current}{unit}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressText}>{current} / {target} {unit}</Text>
    </View>
  );
}

function MacroCard({ icon: Icon, value, label, color, bg, styles }) {
  return (
    <View style={styles.macroCard}>
      <View style={[styles.macroIcon, { backgroundColor: bg }]}>
        <Icon size={20} color={color} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={styles.macroValue}>{value}g</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

export default function ProgressScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = createStyles(C);

  const dailyGoals = {
    calories: { current: 1850, target: 2200 },
    protein: { current: 95, target: 120 },
    carbs: { current: 180, target: 250 },
    fat: { current: 65, target: 80 },
  };

  const macros = [
    { icon: Apple, value: dailyGoals.protein.current, label: 'Protein', color: C.primary, bg: C.primaryPale },
    { icon: Zap, value: dailyGoals.carbs.current, label: 'Carbs', color: C.accent, bg: C.accentPale },
    { icon: Droplets, value: dailyGoals.fat.current, label: 'Fat', color: C.primary, bg: C.primaryPale },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxl }}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.xl }]}>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>Track your nutrition goals</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          <ProgressCard
            title="Calories"
            current={dailyGoals.calories.current}
            target={dailyGoals.calories.target}
            unit="kcal"
            color={C.primary}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <View style={styles.macroGrid}>
            {macros.map((macro, index) => (
              <MacroCard key={index} {...macro} styles={styles} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Trends</Text>
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={48} color={C.textSecondary} strokeWidth={ICON_STROKE} />
            <Text style={styles.chartText}>Chart visualization</Text>
            <Text style={styles.chartText}>Coming soon</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <Flame size={24} color={C.accent} strokeWidth={ICON_STROKE} />
              <Text style={{ ...FONT.bodySemiBold, color: C.text }}>7 Day Streak!</Text>
            </View>
            <Text style={{ ...FONT.body, color: C.textSecondary, marginTop: SPACING.sm }}>
              You've been consistent with your nutrition goals for a week. Keep it up!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}