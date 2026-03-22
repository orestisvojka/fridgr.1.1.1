// src/screens/main/ProfileScreen.jsx
import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Crown,
  Settings,
  HelpCircle,
  FileText,
  Star,
  LogOut,
  ChevronRight,
  Calendar,
  Heart,
  Sparkles,
  Flame,
  ScanLine,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import {
  PREMIUM_HERO_COMPACT,
  PREMIUM_HERO_COMPACT_END,
  PREMIUM_HERO_COMPACT_START,
  PREMIUM_AVATAR_GRADIENT,
} from '../../constants/premiumScreenTheme';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import {
  REFERRAL_LABELS,
  GOAL_LABELS,
  DIET_LABELS,
  SKILL_LABELS,
  TIME_LABELS,
  formatAllergyList,
  formatMealsFocus,
} from '../../constants/profileLabels';

const STAT_ICONS = {
  heart: Heart,
  sparkles: Sparkles,
  flame: Flame,
  scan: ScanLine,
};

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    hero: { paddingBottom: SPACING.section },
    heroContent: { alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.xl },
    avatar: {
      width: 80, height: 80, borderRadius: 40,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
      marginBottom: SPACING.sm,
    },
    avatarText: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
    heroName: { ...FONT.h3, color: '#FFFFFF' },
    heroEmail: { ...FONT.body, color: 'rgba(255,255,255,0.55)' },
    joinBadge: {
      flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
      marginTop: SPACING.xs,
    },
    joinText: { ...FONT.caption, color: 'rgba(255,255,255,0.6)' },
    statsGrid: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.lg,
      marginTop: -SPACING.md,
      gap: SPACING.sm,
      marginBottom: SPACING.sm,
    },
    statCard: {
      flex: 1, borderRadius: RADIUS.lg, padding: SPACING.md,
      alignItems: 'center', gap: SPACING.xs, ...SHADOWS.sm,
    },
    statValue: { ...FONT.h4, textAlign: 'center' },
    statLabel: { ...FONT.caption, color: C.textTertiary, textAlign: 'center' },
    section: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, gap: SPACING.sm },
    sectionTitle: { ...FONT.h5, color: C.textSecondary },
    card: {
      backgroundColor: C.surface, borderRadius: RADIUS.xl,
      borderWidth: 1, borderColor: C.borderLight, overflow: 'hidden',
      ...SHADOWS.xs,
    },
    prefRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      gap: SPACING.md,
    },
    prefLabel: { ...FONT.caption, color: C.textTertiary, flexShrink: 0 },
    prefValue: { ...FONT.bodyMedium, color: C.text, flex: 1, textAlign: 'right' },
    prefDivider: { height: StyleSheet.hairlineWidth, backgroundColor: C.borderLight, marginLeft: SPACING.lg },
    menuItem: {
      flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
      paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    },
    menuIcon: {
      width: 36, height: 36, borderRadius: RADIUS.md,
      alignItems: 'center', justifyContent: 'center',
    },
    menuLabel: { ...FONT.bodyMedium, color: C.text, flex: 1 },
    menuValue: { ...FONT.bodySmall, color: C.textTertiary },
    divider: { height: 1, backgroundColor: C.borderLight, marginLeft: SPACING.lg + 36 + SPACING.md },
    version: { ...FONT.caption, color: C.textTertiary, textAlign: 'center', marginTop: SPACING.xl },
  });
}

function MenuItem({
  icon: Icon, label, value, onPress, iconBg, iconColor, isDestructive, styles, colors,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.82 }]}
    >
      <View style={[styles.menuIcon, { backgroundColor: iconBg || colors.surface2 }]}>
        <Icon size={18} color={iconColor || colors.textSecondary} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={[styles.menuLabel, isDestructive && { color: colors.error }]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {!isDestructive && <ChevronRight size={16} color={colors.textTertiary} strokeWidth={ICON_STROKE} />}
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user, logout } = useAuth();
  const { savedRecipes } = useRecipes();
  const { answers } = useOnboarding();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const stats = [
    { label: 'Saved', value: savedRecipes.length, iconKey: 'heart', color: '#22C55E', bg: '#F0FDF4' },
    { label: 'Generated', value: user?.stats?.recipesGenerated ?? 0, iconKey: 'sparkles', color: '#15803D', bg: '#F0FDF4' },
    { label: 'Streak', value: `${user?.stats?.cookingStreak ?? 0}d`, iconKey: 'flame', color: '#F97316', bg: '#FFF7ED' },
    { label: 'Scanned', value: user?.stats?.ingredientsScanned ?? 0, iconKey: 'scan', color: '#3B82F6', bg: '#EFF6FF' },
  ];

  const referralLabel = REFERRAL_LABELS[answers.referralSource] || 'Not set';
  const goalLabel = GOAL_LABELS[answers.goal] || 'Not set';
  const dietLabel = DIET_LABELS[answers.diet] || 'Not set';
  const skillLabel = SKILL_LABELS[answers.skill] || 'Not set';
  const timeLabel = TIME_LABELS[answers.time] || (answers.time ? `${answers.time} min` : 'Not set');
  const allergyLabel = formatAllergyList(answers.allergies);
  const mealsFocusLabel = formatMealsFocus(answers.mealsFocus);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient
          colors={PREMIUM_HERO_COMPACT}
          start={PREMIUM_HERO_COMPACT_START}
          end={PREMIUM_HERO_COMPACT_END}
          style={[styles.hero, { paddingTop: insets.top + SPACING.md }]}
        >
          <View style={styles.heroContent}>
            <LinearGradient
              colors={PREMIUM_AVATAR_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
            </LinearGradient>
            <Text style={styles.heroName}>{user?.name?.trim() || 'Chef'}</Text>
            <Text style={styles.heroEmail}>{user?.email ?? ''}</Text>

            <View style={styles.joinBadge}>
              <Calendar size={12} color="rgba(255,255,255,0.6)" strokeWidth={ICON_STROKE} />
              <Text style={styles.joinText}>
                Member since {user?.joinDate ?? '—'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsGrid}>
          {stats.map((s, i) => {
            const SIcon = STAT_ICONS[s.iconKey];
            return (
              <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
                {SIcon ? <SIcon size={18} color={s.color} strokeWidth={ICON_STROKE} /> : null}
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your preferences</Text>
          <View style={styles.card}>
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Heard about us</Text>
              <Text style={styles.prefValue} numberOfLines={2}>{referralLabel}</Text>
            </View>
            <View style={styles.prefDivider} />
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Goal</Text>
              <Text style={styles.prefValue}>{goalLabel}</Text>
            </View>
            <View style={styles.prefDivider} />
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Diet</Text>
              <Text style={styles.prefValue}>{dietLabel}</Text>
            </View>
            <View style={styles.prefDivider} />
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Allergies</Text>
              <Text style={styles.prefValue} numberOfLines={3}>{allergyLabel}</Text>
            </View>
            <View style={styles.prefDivider} />
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Skill</Text>
              <Text style={styles.prefValue}>{skillLabel}</Text>
            </View>
            <View style={styles.prefDivider} />
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Cook time</Text>
              <Text style={styles.prefValue}>{timeLabel}</Text>
            </View>
            <View style={styles.prefDivider} />
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Meals focus</Text>
              <Text style={styles.prefValue} numberOfLines={2}>{mealsFocusLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <MenuItem
              icon={Bell} label="Notifications"
              iconBg={colors.primaryFaint} iconColor={colors.primary}
              onPress={() => navigation.navigate(ROUTES.SETTINGS)}
              styles={styles} colors={colors}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={Crown} label="Go Premium"
              iconBg="rgba(250,204,21,0.15)" iconColor="#CA8A04"
              value="Free plan"
              onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
              styles={styles} colors={colors}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={Settings} label="Settings"
              iconBg={colors.surface2} iconColor={colors.textSecondary}
              onPress={() => navigation.navigate(ROUTES.SETTINGS)}
              styles={styles} colors={colors}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.card}>
            <MenuItem
              icon={HelpCircle} label="Help and support" iconBg={colors.surface2} iconColor={colors.textSecondary}
              onPress={() => navigation.navigate(ROUTES.HELP_SUPPORT)}
              styles={styles} colors={colors}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={FileText} label="Privacy Policy" iconBg={colors.surface2} iconColor={colors.textSecondary}
              onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)}
              styles={styles} colors={colors}
            />
            <View style={styles.divider} />
            <MenuItem
              icon={Star} label="Rate FRIDGR" iconBg={colors.primaryFaint} iconColor={colors.primary}
              onPress={() => navigation.navigate(ROUTES.RATE_APP)}
              styles={styles} colors={colors}
            />
          </View>
        </View>

        <View style={[styles.section, { paddingTop: 0 }]}>
          <View style={styles.card}>
            <MenuItem
              icon={LogOut} label="Sign Out" isDestructive onPress={handleLogout}
              styles={styles} colors={colors}
            />
          </View>
        </View>

        <Text style={styles.version}>FRIDGR v1.0.0 · Made with care</Text>
      </ScrollView>
    </View>
  );
}
