// src/screens/main/DashboardScreen.jsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { MOCK_RECIPES, DAILY_TIPS, TRENDING_IDS, QUICK_ACTIONS } from '../../data/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.62;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({ label, value, icon, color, bg }) {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RecipeChip({ recipe, onPress, isSaved }) {
  const palette = COLORS.recipePalettes[parseInt(recipe.id.replace('r', ''), 10) % COLORS.recipePalettes.length] || COLORS.recipePalettes[0];
  return (
    <TouchableOpacity style={styles.recipeChip} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.recipeChipHero, { backgroundColor: palette.light }]}>
        <Text style={styles.recipeChipEmoji}>{recipe.emoji}</Text>
        {isSaved && (
          <View style={styles.savedDot}>
            <Ionicons name="heart" size={10} color={COLORS.white} />
          </View>
        )}
      </View>
      <View style={styles.recipeChipBody}>
        <Text style={styles.recipeChipTitle} numberOfLines={2}>{recipe.title}</Text>
        <View style={styles.recipeChipMeta}>
          <Ionicons name="time-outline" size={11} color={COLORS.textTertiary} />
          <Text style={styles.recipeChipMetaText}>{recipe.prepTime} min</Text>
          <View style={[styles.diffBadge, { backgroundColor: palette.light }]}>
            <Text style={[styles.diffText, { color: palette.color }]}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function QuickActionBtn({ action, onPress }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
        <Ionicons name={action.icon} size={22} color={action.color} />
      </View>
      <Text style={styles.quickActionLabel}>{action.label}</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { savedRecipes, isSaved } = useRecipes();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  const tipIndex = new Date().getDate() % DAILY_TIPS.length;
  const tip = DAILY_TIPS[tipIndex];

  const trending = TRENDING_IDS
    .map(id => MOCK_RECIPES.find(r => r.id === id))
    .filter(Boolean);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleQuickAction = (actionId) => {
    if (actionId === 'scan' || actionId === 'upload') {
      navigation.navigate('ScanTab');
    } else if (actionId === 'favorites') {
      navigation.navigate('FavoritesTab');
    }
  };

  const stats = [
    { label: 'Generated',  value: user?.stats?.recipesGenerated ?? 0,    icon: 'sparkles',  color: '#15803D', bg: '#F0FDF4' },
    { label: 'Saved',      value: savedRecipes.length,                    icon: 'heart',     color: '#DB2777', bg: '#FDF2F8' },
    { label: 'Day Streak', value: `${user?.stats?.cookingStreak ?? 0}🔥`, icon: 'flame',     color: '#EA580C', bg: '#FFF7ED' },
    { label: 'Scanned',    value: user?.stats?.ingredientsScanned ?? 0,   icon: 'scan',      color: '#7C3AED', bg: '#F5F3FF' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* ─── Hero Header ──────────────────────────────────────────────── */}
        <LinearGradient
          colors={['#0A1F0E', '#15803D']}
          style={[styles.heroHeader, { paddingTop: insets.top + SPACING.md }]}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.greeting}>{getGreeting()},</Text>
                <Text style={styles.userName}>{user?.name ?? 'Chef'} 👋</Text>
              </View>
              <TouchableOpacity
                style={styles.avatarBtn}
                onPress={() => navigation.navigate('ProfileTab')}
              >
                <LinearGradient colors={['#22C55E', '#15803D']} style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(user?.name ?? 'U')[0].toUpperCase()}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Hero CTA */}
            <TouchableOpacity
              style={styles.heroCta}
              onPress={() => navigation.navigate('ScanTab')}
              activeOpacity={0.85}
            >
              <View style={styles.heroCtaContent}>
                <View>
                  <Text style={styles.heroCtaLabel}>Ready to cook?</Text>
                  <Text style={styles.heroCtaTitle}>Scan your ingredients</Text>
                </View>
                <View style={styles.heroCtaIcon}>
                  <Ionicons name="camera" size={26} color={COLORS.primary} />
                </View>
              </View>
              <View style={styles.heroCtaFooter}>
                <Ionicons name="flash" size={12} color='rgba(255,255,255,0.5)' />
                <Text style={styles.heroCtaFooterText}>AI detects instantly · No manual input needed</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>

        {/* ─── Stats ────────────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </View>

        {/* ─── Quick Actions ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map(action => (
              <QuickActionBtn
                key={action.id}
                action={action}
                onPress={() => handleQuickAction(action.id)}
              />
            ))}
          </View>
        </View>

        {/* ─── Daily Tip ─────────────────────────────────────────────────── */}
        <View style={styles.px}>
          <LinearGradient
            colors={['#F0FDF4', '#DCFCE7']}
            style={styles.tipCard}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <View style={styles.tipHeader}>
              <Text style={styles.tipEmoji}>{tip.icon}</Text>
              <Text style={styles.tipBadge}>Chef's Tip</Text>
            </View>
            <Text style={styles.tipText}>{tip.tip}</Text>
          </LinearGradient>
        </View>

        {/* ─── Trending Recipes ──────────────────────────────────────────── */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionHeader, styles.px]}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RecipesTab')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trending}
            keyExtractor={r => r.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}
            renderItem={({ item }) => (
              <RecipeChip
                recipe={item}
                isSaved={isSaved(item.id)}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
              />
            )}
          />
        </View>

        {/* ─── Saved Recipes Preview ──────────────────────────────────────── */}
        {savedRecipes.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={[styles.sectionHeader, styles.px]}>
              <Text style={styles.sectionTitle}>Your Saved Recipes</Text>
              <TouchableOpacity onPress={() => navigation.navigate('FavoritesTab')}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={savedRecipes.slice(0, 6)}
              keyExtractor={r => r.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}
              renderItem={({ item }) => (
                <RecipeChip
                  recipe={item}
                  isSaved={true}
                  onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
                />
              )}
            />
          </View>
        )}

        {/* ─── Premium Banner ─────────────────────────────────────────────── */}
        <View style={styles.px}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
          >
            <LinearGradient
              colors={['#0A1F0E', '#15803D', '#22C55E']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.premiumBanner}
            >
              <View style={styles.premiumLeft}>
                <Text style={styles.premiumBadge}>✦ PREMIUM</Text>
                <Text style={styles.premiumTitle}>Unlock unlimited{'\n'}scans & meal plans</Text>
                <View style={styles.premiumCta}>
                  <Text style={styles.premiumCtaText}>Try free for 7 days →</Text>
                </View>
              </View>
              <Text style={styles.premiumEmoji}>👑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  px: { paddingHorizontal: SPACING.xl },

  // Hero
  heroHeader: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl + 8 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xxl },
  greeting: { ...FONT.bodySmall, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  userName:  { ...FONT.h2, color: '#FFFFFF' },
  avatarBtn: {},
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { ...FONT.h5, color: '#FFFFFF' },

  heroCta: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  heroCtaContent: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.lg,
  },
  heroCtaLabel: { ...FONT.caption, color: 'rgba(255,255,255,0.55)', marginBottom: 3 },
  heroCtaTitle: { ...FONT.h4, color: '#FFFFFF' },
  heroCtaIcon: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroCtaFooter: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
  },
  heroCtaFooterText: { ...FONT.caption, color: 'rgba(255,255,255,0.4)' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  statCard: {
    flex: 1, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: 'center',
    gap: SPACING.xs, ...SHADOWS.sm,
  },
  statIcon: {
    width: 32, height: 32, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: { ...FONT.h4, textAlign: 'center' },
  statLabel: { ...FONT.caption, color: COLORS.textTertiary, textAlign: 'center' },

  // Section
  section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: { ...FONT.h4, color: COLORS.text },
  seeAll: { ...FONT.bodySmallMedium, color: COLORS.primary },

  // Quick actions
  quickActionsGrid: { flexDirection: 'row', gap: SPACING.md },
  quickAction: { flex: 1, alignItems: 'center', gap: SPACING.sm },
  quickActionIcon: {
    width: 58, height: 58, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.sm,
  },
  quickActionLabel: { ...FONT.captionMedium, color: COLORS.textSecondary, textAlign: 'center' },

  // Tip
  tipCard: {
    borderRadius: RADIUS.xl, padding: SPACING.lg,
    marginTop: SPACING.xxl, gap: SPACING.sm,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  tipEmoji: { fontSize: 20 },
  tipBadge: { ...FONT.labelSmall, color: COLORS.primary },
  tipText: { ...FONT.bodyMedium, color: COLORS.text, lineHeight: 22 },

  // Recipe chip
  recipeChip: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  recipeChipHero: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeChipEmoji: { fontSize: 50 },
  savedDot: {
    position: 'absolute', top: SPACING.sm, right: SPACING.sm,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#DB2777',
    alignItems: 'center', justifyContent: 'center',
  },
  recipeChipBody: { padding: SPACING.md, gap: SPACING.xs },
  recipeChipTitle: { ...FONT.bodySemiBold, color: COLORS.text },
  recipeChipMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  recipeChipMetaText: { ...FONT.caption, color: COLORS.textTertiary, flex: 1 },
  diffBadge: { borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  diffText: { ...FONT.captionMedium, fontSize: 10 },

  // Premium
  premiumBanner: {
    borderRadius: RADIUS.xl, padding: SPACING.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: SPACING.xxl,
  },
  premiumLeft: { gap: SPACING.sm, flex: 1 },
  premiumBadge: { ...FONT.labelSmall, color: 'rgba(255,255,255,0.65)' },
  premiumTitle: { ...FONT.h3, color: '#FFFFFF' },
  premiumCta: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginTop: SPACING.xs,
  },
  premiumCtaText: { ...FONT.bodySmallMedium, color: '#FFFFFF' },
  premiumEmoji: { fontSize: 48 },
});
