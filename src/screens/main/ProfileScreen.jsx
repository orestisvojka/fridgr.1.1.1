// src/screens/main/ProfileScreen.jsx
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';

function MenuItem({ icon, label, value, onPress, iconBg, iconColor, isDestructive }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: iconBg || COLORS.surface2 }]}>
        <Ionicons name={icon} size={18} color={iconColor || COLORS.textSecondary} />
      </View>
      <Text style={[styles.menuLabel, isDestructive && { color: COLORS.error }]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {!isDestructive && <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { savedRecipes } = useRecipes();
  const { answers, resetOnboarding } = useOnboarding();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const stats = [
    { label: 'Saved',     value: savedRecipes.length,                    icon: 'heart',     color: '#DB2777', bg: '#FDF2F8' },
    { label: 'Generated', value: user?.stats?.recipesGenerated ?? 0,     icon: 'sparkles',  color: '#15803D', bg: '#F0FDF4' },
    { label: 'Streak',    value: `${user?.stats?.cookingStreak ?? 0}d`,  icon: 'flame',     color: '#EA580C', bg: '#FFF7ED' },
    { label: 'Scanned',   value: user?.stats?.ingredientsScanned ?? 0,   icon: 'scan',      color: '#7C3AED', bg: '#F5F3FF' },
  ];

  const dietLabel = {
    none: 'No preference', vegetarian: 'Vegetarian', vegan: 'Vegan',
    high_protein: 'High Protein', low_carb: 'Low Carb', gluten_free: 'Gluten Free',
  }[answers.diet] || 'Not set';

  const skillLabel = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }[answers.skill] || 'Not set';

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero header */}
        <LinearGradient
          colors={['#0A1F0E', '#15803D']}
          style={[styles.hero, { paddingTop: insets.top + SPACING.md }]}
        >
          <View style={styles.heroContent}>
            {/* Avatar */}
            <LinearGradient colors={['#22C55E', '#15803D']} style={styles.avatar}>
              <Text style={styles.avatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
            </LinearGradient>
            <Text style={styles.heroName}>{user?.name ?? 'Chef'}</Text>
            <Text style={styles.heroEmail}>{user?.email ?? ''}</Text>

            <View style={styles.joinBadge}>
              <Ionicons name="leaf" size={12} color="rgba(255,255,255,0.6)" />
              <Text style={styles.joinText}>Member since {user?.joinDate ?? '2024'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <Ionicons name={s.icon} size={18} color={s.color} />
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Preferences</Text>
          <View style={styles.card}>
            <View style={styles.prefRow}>
              <View style={styles.prefItem}>
                <Text style={styles.prefLabel}>Diet</Text>
                <Text style={styles.prefValue}>{dietLabel}</Text>
              </View>
              <View style={styles.prefDivider} />
              <View style={styles.prefItem}>
                <Text style={styles.prefLabel}>Skill</Text>
                <Text style={styles.prefValue}>{skillLabel}</Text>
              </View>
              <View style={styles.prefDivider} />
              <View style={styles.prefItem}>
                <Text style={styles.prefLabel}>Time</Text>
                <Text style={styles.prefValue}>{answers.time ? `${answers.time}m` : 'Any'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <MenuItem
              icon="notifications-outline" label="Notifications"
              iconBg="#EDE9FE" iconColor="#7C3AED"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="star-outline" label="Go Premium"
              iconBg="#FEF3C7" iconColor="#D97706"
              value="Free plan"
              onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="settings-outline" label="Settings"
              iconBg={COLORS.surface2} iconColor={COLORS.textSecondary}
              onPress={() => navigation.navigate(ROUTES.SETTINGS)}
            />
          </View>
        </View>

        {/* More */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.card}>
            <MenuItem icon="help-circle-outline" label="Help & Support" iconBg="#E0F2FE" iconColor="#0284C7" onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="document-text-outline" label="Privacy Policy" iconBg={COLORS.surface2} iconColor={COLORS.textSecondary} onPress={() => {}} />
            <View style={styles.divider} />
            <MenuItem icon="star-half-outline" label="Rate FRIDGR" iconBg="#FDF2F8" iconColor="#DB2777" onPress={() => {}} />
          </View>
        </View>

        {/* Sign out */}
        <View style={[styles.section, { paddingTop: 0 }]}>
          <View style={styles.card}>
            <MenuItem icon="log-out-outline" label="Sign Out" isDestructive onPress={handleLogout} />
          </View>
        </View>

        <Text style={styles.version}>FRIDGR v1.0.0 · Made with ❤️</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  statLabel: { ...FONT.caption, color: COLORS.textTertiary, textAlign: 'center' },

  section: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, gap: SPACING.sm },
  sectionTitle: { ...FONT.h5, color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.borderLight, overflow: 'hidden',
    ...SHADOWS.xs,
  },
  prefRow: { flexDirection: 'row', padding: SPACING.lg },
  prefItem: { flex: 1, alignItems: 'center', gap: SPACING.xs },
  prefLabel: { ...FONT.caption, color: COLORS.textTertiary },
  prefValue: { ...FONT.bodyMedium, color: COLORS.text },
  prefDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },

  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { ...FONT.bodyMedium, color: COLORS.text, flex: 1 },
  menuValue: { ...FONT.bodySmall, color: COLORS.textTertiary },
  divider: { height: 1, backgroundColor: COLORS.borderLight, marginLeft: SPACING.lg + 36 + SPACING.md },

  version: { ...FONT.caption, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.xl },
});
