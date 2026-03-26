// src/screens/main/DashboardScreen.jsx
// Matches mockup screen3.png — cream bg, Detected Pantry chips, recipe list
import { useRef, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, ChevronRight, Plus, ArrowRight, Sparkles, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import { useThemeColors } from '../../context/ThemeContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { MOCK_RECIPES, DAILY_TIPS, TRENDING_IDS } from '../../data/mockData';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';
import {
  PREMIUM_BANNER, PREMIUM_BANNER_START, PREMIUM_BANNER_END,
  PREMIUM_AVATAR_GRADIENT,
} from '../../constants/premiumScreenTheme';

const { width } = Dimensions.get('window');

// ─── Demo pantry items shown when user hasn't scanned yet ─────────────────────
const DEMO_PANTRY = [
  { id: 'eggs',    name: 'Eggs',          count: '×9', emoji: '🥚', bg: '#FFF8D4', text: '#8A680A', border: '#F0E4A0', badge: null },
  { id: 'chicken', name: 'Chicken',        count: null, emoji: '🍗', bg: '#FFF0EB', text: '#8A3820', border: '#F5D4C4', badge: null },
  { id: 'spinach', name: 'Spinach',        count: null, emoji: '🌿', bg: '#EDF5EF', text: '#3E6B50', border: '#C8E0CE', badge: 'Veg' },
  { id: 'yogurt',  name: 'Greek Yogurt',   count: null, emoji: '🥛', bg: '#F9F7F2', text: '#4A4A46', border: '#E4DDD2', badge: null },
  { id: 'lemon',   name: 'Lemon',          count: null, emoji: '🍋', bg: '#FFFCE8', text: '#8A7010', border: '#F0E8A0', badge: null },
];

const CHIP_COLORS = [
  { bg: '#FFF8D4', text: '#8A680A', border: '#F0E4A0' },
  { bg: '#FFF0EB', text: '#8A3820', border: '#F5D4C4' },
  { bg: '#EDF5EF', text: '#3E6B50', border: '#C8E0CE' },
  { bg: '#F9F7F2', text: '#4A4A46', border: '#E4DDD2' },
  { bg: '#FFFCE8', text: '#8A7010', border: '#F0E8A0' },
  { bg: '#EEF5FA', text: '#1E4D78', border: '#C0D8EC' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Ingredient Chip ──────────────────────────────────────────────────────────
function IngredientChip({ item, style }) {
  return (
    <View style={[{
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 12, paddingVertical: 8,
      borderRadius: RADIUS.full,
      backgroundColor: item.bg,
      borderWidth: 1, borderColor: item.border,
      gap: 6, marginRight: 8,
    }, style]}>
      <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
      <View>
        <Text style={{ ...FONT.bodySmallMedium, color: item.text }}>{item.name}</Text>
        {item.count && (
          <Text style={{ fontSize: 10, color: item.text, opacity: 0.65 }}>{item.count}</Text>
        )}
      </View>
      {item.badge && (
        <View style={{ backgroundColor: item.text + '18', borderRadius: RADIUS.full, paddingHorizontal: 6, paddingVertical: 2 }}>
          <Text style={{ fontSize: 9, fontWeight: '700', color: item.text, letterSpacing: 0.4 }}>{item.badge}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Recipe Row (vertical list item) ─────────────────────────────────────────
function RecipeRow({ recipe, onPress, isSaved, C }) {
  const palettes = C.recipePalettes;
  const palette = palettes[parseInt(recipe.id.replace('r', ''), 10) % palettes.length] || palettes[0];
  return (
    <Pressable
      style={({ pressed }) => [row.wrap, pressed && { opacity: 0.88 }]}
      onPress={onPress}
    >
      {/* Thumbnail */}
      <View style={[row.thumb, { backgroundColor: palette.light }]}>
        <RecipeImage recipe={recipe} height={52} borderRadius={RADIUS.md} style={{ width: 52 }} />
        {isSaved && <View style={row.savedDot} />}
      </View>

      {/* Info */}
      <View style={row.info}>
        <Text style={row.name} numberOfLines={2}>{recipe.title}</Text>
        <View style={row.meta}>
          <Clock size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
          <Text style={[row.metaText, { color: C.textTertiary }]}>{recipe.prepTime} min</Text>
          <View style={[row.dot]} />
          <Text style={[row.metaText, { color: C.textTertiary }]}>{recipe.difficulty}</Text>
        </View>
      </View>

      {/* Arrow */}
      <View style={[row.arrow, { backgroundColor: C.primaryFaint }]}>
        <ChevronRight size={14} color={C.primary} strokeWidth={ICON_STROKE + 0.5} />
      </View>
    </Pressable>
  );
}

const row = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, gap: 12,
    borderBottomWidth: 1, borderBottomColor: '#EAE6DD',
  },
  thumb: {
    width: 52, height: 52, borderRadius: RADIUS.md, overflow: 'hidden', flexShrink: 0,
  },
  savedDot: {
    position: 'absolute', top: 4, right: 4,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#3E6B50', borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  info: { flex: 1, gap: 4 },
  name: { ...FONT.bodySemiBold, color: '#1E1E1C', lineHeight: 20 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { ...FONT.caption },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#C4C0B8' },
  arrow: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ─── Trending Horizontal Card ─────────────────────────────────────────────────
function TrendCard({ recipe, onPress, isSaved, C }) {
  const palettes = C.recipePalettes;
  const palette = palettes[parseInt(recipe.id.replace('r', ''), 10) % palettes.length] || palettes[0];
  const CARD_W = width * 0.58;
  return (
    <Pressable
      style={({ pressed }) => [card.wrap, { width: CARD_W }, pressed && { opacity: 0.9 }]}
      onPress={onPress}
    >
      <View style={[card.imgWrap, { backgroundColor: palette.light }]}>
        <RecipeImage recipe={recipe} height={110} borderRadius={0} style={{ width: '100%' }} />
        {isSaved && (
          <View style={[card.badge, { backgroundColor: C.primary }]}>
            <Text style={{ fontSize: 9, color: '#FFF', fontWeight: '700' }}>SAVED</Text>
          </View>
        )}
      </View>
      <View style={card.body}>
        <Text style={[card.name, { color: C.text }]} numberOfLines={2}>{recipe.title}</Text>
        <View style={card.meta}>
          <Clock size={10} color={C.textTertiary} strokeWidth={ICON_STROKE} />
          <Text style={[card.metaText, { color: C.textTertiary }]}>{recipe.prepTime} min</Text>
          <View style={[card.diffPill, { backgroundColor: palette.light }]}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: palette.color }}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl,
    overflow: 'hidden', borderWidth: 1, borderColor: '#EAE6DD',
    marginRight: SPACING.md, ...SHADOWS.sm,
  },
  imgWrap: { height: 110 },
  badge: { position: 'absolute', top: 8, right: 8, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  body: { padding: SPACING.md, gap: SPACING.xs },
  name: { ...FONT.bodySemiBold, lineHeight: 20 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { ...FONT.caption },
  diffPill: { borderRadius: RADIUS.full, paddingHorizontal: 7, paddingVertical: 2 },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { user } = useAuth();
  const { savedRecipes, isSaved, lastIngredients } = useRecipes();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start();
  }, []);

  const tipIndex  = new Date().getDate() % DAILY_TIPS.length;
  const tip       = DAILY_TIPS[tipIndex];
  const trending  = TRENDING_IDS.map(id => MOCK_RECIPES.find(r => r.id === id)).filter(Boolean);

  // Build pantry chips from last scan, fall back to demo
  const pantryItems = useMemo(() => {
    if (lastIngredients && lastIngredients.length > 0) {
      return lastIngredients.slice(0, 8).map((name, i) => ({
        id: `pi_${i}`,
        name,
        count: null,
        emoji: '🥬',
        badge: null,
        ...CHIP_COLORS[i % CHIP_COLORS.length],
      }));
    }
    return DEMO_PANTRY;
  }, [lastIngredients]);

  // Recipes to show in "What you can cook" — use saved or trending
  const suggestedRecipes = useMemo(() => {
    const pool = [...MOCK_RECIPES].sort(() => 0.5 - Math.random()).slice(0, 4);
    return pool;
  }, []);

  const hasPantry = pantryItems.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
        style={{ opacity: fadeAnim }}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <Text style={styles.logo}>Fridgr</Text>
          <Pressable
            onPress={() => navigation.navigate('ProfileTab')}
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <LinearGradient
              colors={PREMIUM_AVATAR_GRADIENT}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* ── Greeting strip ── */}
        <Animated.View style={[styles.greetingStrip, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.greetingLeft}>
            <Text style={[styles.greetingText, { color: C.textTertiary }]}>{getGreeting()},</Text>
            <Text style={[styles.greetingName, { color: C.text }]}>{user?.name ?? 'Chef'} 👋</Text>
          </View>
          <Pressable
            style={[styles.scanBtn, { backgroundColor: C.primary }]}
            onPress={() => navigation.navigate('ScanTab')}
          >
            <Zap size={13} color="#FFFFFF" strokeWidth={ICON_STROKE} />
            <Text style={styles.scanBtnText}>Scan</Text>
          </Pressable>
        </Animated.View>

        {/* ── Detected Pantry ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={[styles.inventoryLabel, { color: C.primary }]}>INVENTORY</Text>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Detected Pantry</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('ScanTab')}>
              <Text style={[styles.linkText, { color: C.primary }]}>Edit list</Text>
            </Pressable>
          </View>

          {/* Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: SPACING.md }}
            contentContainerStyle={{ paddingLeft: SPACING.xl, paddingRight: SPACING.xl }}
          >
            {pantryItems.map(item => (
              <IngredientChip key={item.id} item={item} />
            ))}
            {/* Add more chip */}
            <Pressable
              style={styles.addChip}
              onPress={() => navigation.navigate('ScanTab')}
            >
              <Plus size={14} color={C.primary} strokeWidth={ICON_STROKE + 0.5} />
            </Pressable>
          </ScrollView>
        </View>

        {/* ── Divider ── */}
        <View style={[styles.divider, { backgroundColor: C.borderLight }]} />

        {/* ── What you can cook ── */}
        <View style={[styles.section, { paddingHorizontal: SPACING.xl }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>What you can cook</Text>
            <Pressable onPress={() => navigation.navigate('RecipesTab')}>
              <Text style={[styles.linkText, { color: C.primary }]}>see all</Text>
            </Pressable>
          </View>

          <View style={{ marginTop: SPACING.md }}>
            {suggestedRecipes.map((recipe, i) => (
              <RecipeRow
                key={recipe.id}
                recipe={recipe}
                isSaved={isSaved(recipe.id)}
                C={C}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe })}
              />
            ))}
          </View>
        </View>

        {/* ── Trending ── */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionHeaderRow, { paddingHorizontal: SPACING.xl }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <Sparkles size={16} color={C.accent} strokeWidth={ICON_STROKE} />
              <Text style={[styles.sectionTitle, { color: C.text }]}>Trending Now</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('RecipesTab')}>
              <Text style={[styles.linkText, { color: C.primary }]}>see all</Text>
            </Pressable>
          </View>

          <FlatList
            data={trending}
            keyExtractor={r => r.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.xl, paddingTop: SPACING.md }}
            renderItem={({ item }) => (
              <TrendCard
                recipe={item}
                isSaved={isSaved(item.id)}
                C={C}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
              />
            )}
          />
        </View>

        {/* ── Chef's Tip ── */}
        <View style={[styles.section, { paddingHorizontal: SPACING.xl }]}>
          <View style={[styles.tipCard, { backgroundColor: C.primaryFaint, borderColor: C.primaryPale }]}>
            <View style={styles.tipHeader}>
              <Text style={{ fontSize: 18 }}>{tip.icon}</Text>
              <Text style={[styles.tipBadge, { color: C.primary }]}>Chef's Tip</Text>
            </View>
            <Text style={[styles.tipText, { color: C.text }]}>{tip.tip}</Text>
          </View>
        </View>

        {/* ── Premium Banner ── */}
        {savedRecipes.length < 3 && (
          <View style={[styles.section, { paddingHorizontal: SPACING.xl }]}>
            <Pressable
              onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
              style={({ pressed }) => [pressed && { opacity: 0.92 }]}
            >
              <LinearGradient
                colors={PREMIUM_BANNER}
                start={PREMIUM_BANNER_START}
                end={PREMIUM_BANNER_END}
                style={styles.premiumBanner}
              >
                <View style={{ flex: 1, gap: SPACING.sm }}>
                  <Text style={styles.premiumLabel}>✦ PREMIUM</Text>
                  <Text style={styles.premiumTitle}>Unlock unlimited{'\n'}scans & meal plans</Text>
                  <View style={styles.premiumCta}>
                    <Text style={styles.premiumCtaText}>Try free for 7 days</Text>
                    <ArrowRight size={13} color="#FFFFFF" strokeWidth={ICON_STROKE + 0.5} />
                  </View>
                </View>
                <Text style={{ fontSize: 44 }}>👑</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ─── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: '#EAE6DD',
  },
  logo: {
    fontSize: 26, fontWeight: '700', color: '#1E1E1C', letterSpacing: -0.5,
  },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  // ─── Greeting ─────────────────────────────────────────────────────────────
  greetingStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg,
  },
  greetingLeft: { gap: 2 },
  greetingText: { fontSize: 12, fontWeight: '500' },
  greetingName: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  scanBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  scanBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  // ─── Section ──────────────────────────────────────────────────────────────
  section: { paddingTop: SPACING.xl },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  inventoryLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 3,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  linkText: { fontSize: 13, fontWeight: '600' },

  // ─── Add Chip ─────────────────────────────────────────────────────────────
  addChip: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E4DDD2',
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
  },

  // ─── Divider ──────────────────────────────────────────────────────────────
  divider: { height: 1, marginTop: SPACING.xl, marginHorizontal: SPACING.xl },

  // ─── Tip ──────────────────────────────────────────────────────────────────
  tipCard: {
    borderRadius: RADIUS.xl, padding: SPACING.lg,
    borderWidth: 1, gap: SPACING.sm,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  tipBadge: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  tipText: { fontSize: 14, fontWeight: '400', lineHeight: 21, color: '#4A4A46' },

  // ─── Premium Banner ───────────────────────────────────────────────────────
  premiumBanner: {
    borderRadius: RADIUS.xl, padding: SPACING.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  premiumLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: 'rgba(255,255,255,0.65)' },
  premiumTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', lineHeight: 24 },
  premiumCta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  premiumCtaText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
});
