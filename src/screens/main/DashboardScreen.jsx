// src/screens/main/DashboardScreen.jsx
import React, { useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  FlatList, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Heart,
  Flame,
  ScanLine,
  Camera,
  Image as ImageIcon,
  Calendar,
  Clock,
  Zap,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import { useThemeColors } from '../../context/ThemeContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import {
  PREMIUM_HERO_COMPACT,
  PREMIUM_HERO_COMPACT_END,
  PREMIUM_HERO_COMPACT_START,
  PREMIUM_AVATAR_GRADIENT,
  PREMIUM_BANNER,
  PREMIUM_BANNER_END,
  PREMIUM_BANNER_START,
} from '../../constants/premiumScreenTheme';
import { MOCK_RECIPES, DAILY_TIPS, TRENDING_IDS, QUICK_ACTIONS } from '../../data/mockData';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.62;

const STAT_ICONS = {
  sparkles: Sparkles,
  heart: Heart,
  flame: Flame,
  scan: ScanLine,
};

const QUICK_ICONS = {
  camera: Camera,
  image: ImageIcon,
  heart: Heart,
  calendar: Calendar,
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    px: { paddingHorizontal: SPACING.xl },
    heroHeader: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl + 8 },
    headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xxl },
    greeting: { ...FONT.bodySmall, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
    userName: { ...FONT.h2, color: '#FFFFFF' },
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
    statLabel: { ...FONT.caption, color: C.textTertiary, textAlign: 'center' },
    section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl },
    sectionHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: SPACING.md,
    },
    sectionTitle: { ...FONT.h4, color: C.text },
    seeAll: { ...FONT.bodySmallMedium, color: C.primary },
    quickActionsGrid: { flexDirection: 'row', gap: SPACING.md },
    quickAction: { flex: 1, alignItems: 'center', gap: SPACING.sm },
    quickActionIcon: {
      width: 58, height: 58, borderRadius: RADIUS.lg,
      alignItems: 'center', justifyContent: 'center',
      ...SHADOWS.sm,
    },
    quickActionLabel: { ...FONT.captionMedium, color: C.textSecondary, textAlign: 'center' },
    tipCard: {
      borderRadius: RADIUS.xl, padding: SPACING.lg,
      marginTop: SPACING.xxl, gap: SPACING.sm,
    },
    tipHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    tipEmoji: { fontSize: 20 },
    tipBadge: { ...FONT.labelSmall, color: C.primary },
    tipText: { ...FONT.bodyMedium, color: C.text, lineHeight: 22 },
    recipeChip: {
      width: CARD_WIDTH,
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: C.borderLight,
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
      backgroundColor: C.primary,
      alignItems: 'center', justifyContent: 'center',
    },
    recipeChipBody: { padding: SPACING.md, gap: SPACING.xs },
    recipeChipTitle: { ...FONT.bodySemiBold, color: C.text },
    recipeChipMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
    recipeChipMetaText: { ...FONT.caption, color: C.textTertiary, flex: 1 },
    diffBadge: { borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
    diffText: { ...FONT.captionMedium, fontSize: 10 },
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
}

function StatCard({ label, value, iconKey, color, bg, styles }) {
  const Icon = STAT_ICONS[iconKey];
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {Icon ? <Icon size={18} color={color} strokeWidth={ICON_STROKE} /> : null}
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RecipeChip({ recipe, onPress, isSaved, styles, C }) {
  const palettes = C.recipePalettes;
  const palette = palettes[parseInt(recipe.id.replace('r', ''), 10) % palettes.length] || palettes[0];
  return (
    <Pressable
      style={({ pressed }) => [styles.recipeChip, pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}
      onPress={onPress}
    >
      <View style={[styles.recipeChipHero, { backgroundColor: palette.light }]}>
        <RecipeImage recipe={recipe} height={120} borderRadius={0} style={{ width: '100%' }} />
        {isSaved && (
          <View style={styles.savedDot}>
            <Heart size={10} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
          </View>
        )}
      </View>
      <View style={styles.recipeChipBody}>
        <Text style={styles.recipeChipTitle} numberOfLines={2}>{recipe.title}</Text>
        <View style={styles.recipeChipMeta}>
          <Clock size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
          <Text style={styles.recipeChipMetaText}>{recipe.prepTime} min</Text>
          <View style={[styles.diffBadge, { backgroundColor: palette.light }]}>
            <Text style={[styles.diffText, { color: palette.color }]}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function QuickActionBtn({ action, onPress, styles }) {
  const Icon = QUICK_ICONS[action.icon] || Camera;
  return (
    <Pressable
      style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.85 }]}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
        <Icon size={22} color={action.color} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={styles.quickActionLabel}>{action.label}</Text>
    </Pressable>
  );
}

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { user } = useAuth();
  const { savedRecipes, isSaved } = useRecipes();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  const tipIndex = new Date().getDate() % DAILY_TIPS.length;
  const tip = DAILY_TIPS[tipIndex];

  const trending = TRENDING_IDS
    .map(id => MOCK_RECIPES.find(r => r.id === id))
    .filter(Boolean);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleQuickAction = (actionId) => {
    if (actionId === 'scan' || actionId === 'upload') {
      navigation.navigate('ScanTab');
    } else if (actionId === 'favorites') {
      navigation.navigate('FavoritesTab');
    } else if (actionId === 'planner') {
      navigation.navigate('RecipesTab');
    }
  };

  const stats = [
    { label: 'Generated', value: user?.stats?.recipesGenerated ?? 0, iconKey: 'sparkles', color: '#15803D', bg: '#F0FDF4' },
    { label: 'Saved', value: savedRecipes.length, iconKey: 'heart', color: '#22C55E', bg: '#F0FDF4' },
    { label: 'Day Streak', value: `${user?.stats?.cookingStreak ?? 0}🔥`, iconKey: 'flame', color: '#EA580C', bg: '#FFF7ED' },
    { label: 'Scanned', value: user?.stats?.ingredientsScanned ?? 0, iconKey: 'scan', color: '#7C3AED', bg: '#F5F3FF' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <LinearGradient
          colors={PREMIUM_HERO_COMPACT}
          start={PREMIUM_HERO_COMPACT_START}
          end={PREMIUM_HERO_COMPACT_END}
          style={[styles.heroHeader, { paddingTop: insets.top + SPACING.md }]}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.greeting}>{getGreeting()},</Text>
                <Text style={styles.userName}>{user?.name ?? 'Chef'} 👋</Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('ProfileTab')}
                style={({ pressed }) => [pressed && { opacity: 0.85 }]}
              >
                <LinearGradient
                  colors={PREMIUM_AVATAR_GRADIENT}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {(user?.name ?? 'U')[0].toUpperCase()}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [styles.heroCta, pressed && { opacity: 0.92 }]}
              onPress={() => navigation.navigate('ScanTab')}
            >
              <View style={styles.heroCtaContent}>
                <View>
                  <Text style={styles.heroCtaLabel}>Ready to cook?</Text>
                  <Text style={styles.heroCtaTitle}>Scan your ingredients</Text>
                </View>
                <View style={styles.heroCtaIcon}>
                  <Camera size={26} color={C.primary} strokeWidth={ICON_STROKE + 0.25} />
                </View>
              </View>
              <View style={styles.heroCtaFooter}>
                <Zap size={12} color="rgba(255,255,255,0.5)" strokeWidth={ICON_STROKE} />
                <Text style={styles.heroCtaFooterText}>AI detects instantly · No manual input needed</Text>
              </View>
            </Pressable>
          </Animated.View>
        </LinearGradient>

        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <StatCard key={i} {...s} styles={styles} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map(action => (
              <QuickActionBtn
                key={action.id}
                action={action}
                styles={styles}
                onPress={() => handleQuickAction(action.id)}
              />
            ))}
          </View>
        </View>

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

        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionHeader, styles.px]}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <Pressable onPress={() => navigation.navigate('RecipesTab')}>
              <Text style={styles.seeAll}>See all →</Text>
            </Pressable>
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
                styles={styles}
                C={C}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
              />
            )}
          />
        </View>

        {savedRecipes.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={[styles.sectionHeader, styles.px]}>
              <Text style={styles.sectionTitle}>Your Saved Recipes</Text>
              <Pressable onPress={() => navigation.navigate('FavoritesTab')}>
                <Text style={styles.seeAll}>See all →</Text>
              </Pressable>
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
                  isSaved
                  styles={styles}
                  C={C}
                  onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
                />
              )}
            />
          </View>
        )}

        <View style={styles.px}>
          <Pressable
            onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
            style={({ pressed }) => [pressed && { opacity: 0.9 }]}
          >
            <LinearGradient
              colors={PREMIUM_BANNER}
              start={PREMIUM_BANNER_START}
              end={PREMIUM_BANNER_END}
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
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
