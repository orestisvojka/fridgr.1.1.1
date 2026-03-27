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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// Inventory feature has been removed as per user request

// ─── Recipe Row (vertical detailed card) ──────────────────────────────────
function RecipeRow({ recipe, onPress, isSaved, C }) {
  const palettes = C.recipePalettes;
  const palette = palettes[parseInt(recipe.id.replace('r', ''), 10) % palettes.length] || palettes[0];
  const ROW_W = width * 0.85;
  return (
    <Pressable
      style={({ pressed }) => [row.wrap, { width: ROW_W }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
      onPress={onPress}
    >
      <View style={[row.thumb, { backgroundColor: palette.light }]}>
        <RecipeImage recipe={recipe} height={85} borderRadius={RADIUS.lg} style={{ width: 85 }} />
        {isSaved && (
          <View style={row.savedBadge}>
            <Text style={{ fontSize: 10, color: '#FFF', fontWeight: '800' }}>SAVED</Text>
          </View>
        )}
      </View>

      <View style={row.info}>
        <View style={{ gap: 2 }}>
          <Text style={[row.name, { color: C.text }]} numberOfLines={1}>{recipe.title}</Text>
          <Text style={row.desc} numberOfLines={1}>{recipe.description}</Text>
        </View>
        
        <View style={row.metaRow}>
          <View style={row.metaItem}>
            <Clock size={12} color={C.textTertiary} strokeWidth={ICON_STROKE} />
            <Text style={[row.metaText, { color: C.textTertiary }]}>{recipe.prepTime} min</Text>
          </View>
          <View style={row.dot} />
          <Text style={[row.metaText, { color: C.textTertiary }]}>{recipe.calories} kcal</Text>
          <View style={row.dot} />
          <Text style={[row.metaText, { color: palette.color, fontWeight: '700' }]}>{recipe.macros?.protein}g protein</Text>
        </View>
      </View>
      
      <View style={[row.arrow, { backgroundColor: C.primaryFaint }]}>
        <ChevronRight size={16} color={C.primary} strokeWidth={ICON_STROKE + 0.5} />
      </View>
    </Pressable>
  );
}

const row = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 12, gap: 14,
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl,
    marginRight: SPACING.md, borderWidth: 1, borderColor: '#EAE6DD',
    ...SHADOWS.sm,
  },
  thumb: {
    width: 85, height: 85, borderRadius: RADIUS.lg, overflow: 'hidden', flexShrink: 0,
  },
  savedBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: '#111827', borderRadius: RADIUS.full,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  info: { flex: 1, gap: 8, justifyContent: 'center' },
  name: { ...FONT.bodySemiBold, fontSize: 16, lineHeight: 22 },
  desc: { ...FONT.caption, color: '#8A8A84', lineHeight: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontWeight: '500' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D4D0C8' },
  arrow: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ─── Trending Horizontal Card (Rich Premium Layout) ───────────────────────
function TrendCard({ recipe, onPress, isSaved, C }) {
  const palettes = C.recipePalettes;
  const palette = palettes[parseInt(recipe.id.replace('r', ''), 10) % palettes.length] || palettes[0];
  const CARD_W = width * 0.75;
  return (
    <Pressable
      style={({ pressed }) => [card.wrap, { width: CARD_W }, pressed && { opacity: 0.95 }]}
      onPress={onPress}
    >
      <View style={[card.imgWrap, { backgroundColor: palette.light }]}>
        <RecipeImage recipe={recipe} height={140} borderRadius={0} style={{ width: '100%' }} />
        {isSaved && (
          <View style={[card.badge, { backgroundColor: '#111827' }]}>
            <Text style={{ fontSize: 10, color: '#FFF', fontWeight: '800', letterSpacing: 0.5 }}>SAVED</Text>
          </View>
        )}
        <View style={card.calorieBadge}>
           <Text style={card.calorieText}>{recipe.calories} kcal</Text>
        </View>
      </View>
      <View style={card.body}>
        <View style={card.headerRow}>
          <Text style={[card.name, { color: C.text }]} numberOfLines={1}>{recipe.title}</Text>
          <View style={[card.diffPill, { backgroundColor: palette.light }]}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: palette.color }}>{recipe.difficulty}</Text>
          </View>
        </View>
        <Text style={card.desc} numberOfLines={2}>{recipe.description}</Text>
        
        <View style={card.footer}>
          <View style={card.meta}>
            <Clock size={12} color={C.textTertiary} strokeWidth={ICON_STROKE} />
            <Text style={[card.metaText, { color: C.textTertiary }]}>{recipe.prepTime} min</Text>
          </View>
          <Text style={[card.actionText, { color: C.primary }]}>View details</Text>
        </View>
      </View>
    </Pressable>
  );
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl,
    overflow: 'hidden', borderWidth: 1, borderColor: '#EAE6DD',
    marginRight: SPACING.lg, ...SHADOWS.md,
  },
  imgWrap: { height: 140 },
  badge: { position: 'absolute', top: 12, right: 12, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
  calorieBadge: {
    position: 'absolute', bottom: 12, left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: RADIUS.md,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  calorieText: { fontSize: 11, fontWeight: '800', color: '#1E1E1C' },
  body: { padding: SPACING.lg, gap: SPACING.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.md },
  name: { ...FONT.bodySemiBold, fontSize: 17, flex: 1 },
  diffPill: { borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  desc: { ...FONT.caption, color: '#8A8A84', lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, fontWeight: '600' },
  actionText: { fontSize: 13, fontWeight: '700' },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { user } = useAuth();
  const { savedRecipes, isSaved } = useRecipes();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start();
  }, []);

  const trending  = TRENDING_IDS.map(id => MOCK_RECIPES.find(r => r.id === id)).filter(Boolean);

  // Recipes to show in "What you can cook"
  const suggestedRecipes = useMemo(() => {
    const pool = [...MOCK_RECIPES].sort(() => 0.5 - Math.random()).slice(0, 4);
    return pool;
  }, []);

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

        {/* Inventory feature removed */}

        {/* ── What you can cook ── */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionHeaderRow, { paddingHorizontal: SPACING.xl }]}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>What you can cook</Text>
            <Pressable onPress={() => navigation.navigate('RecipesTab')}>
              <Text style={[styles.linkText, { color: C.primary }]}>see all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.xl, paddingTop: SPACING.md, paddingBottom: SPACING.xs }}
          >
            {suggestedRecipes.map((recipe, i) => (
              <RecipeRow
                key={recipe.id}
                recipe={recipe}
                isSaved={isSaved(recipe.id)}
                C={C}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Trending ── */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionHeaderRow, { paddingHorizontal: SPACING.xl }]}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Trending Now</Text>
            <Pressable onPress={() => navigation.navigate('RecipesTab')}>
              <Text style={[styles.linkText, { color: C.textSecondary }]}>see all</Text>
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

        {/* ── Premium Banner ── */}
        {savedRecipes.length < 3 && (
          <View style={[styles.section, { paddingHorizontal: SPACING.xl, marginTop: SPACING.lg }]}>
            <Pressable
              onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
              style={({ pressed }) => [styles.premiumCard, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <LinearGradient
                colors={['#06402B', '#022C1A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumBanner}
              >
                <View style={styles.premiumTop}>
                  <Text style={styles.premiumLabel}>FRIDGR PREMIUM</Text>
                  <Sparkles size={14} color="#FBBF24" strokeWidth={2} />
                </View>
                <Text style={styles.premiumTitle}>Unlock unlimited scans & meal plans</Text>
                <View style={styles.premiumCtaBox}>
                  <Text style={styles.premiumCtaText}>Try free for 7 days</Text>
                </View>
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
    marginBottom: SPACING.xs,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  linkText: { fontSize: 13, fontWeight: '600' },

  // ─── Add Chip ─────────────────────────────────────────────────────────────
  addChip: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E4DDD2',
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
  },

  // ─── Divider ──────────────────────────────────────────────────────────────
  divider: { height: 1, marginTop: SPACING.xxl, marginHorizontal: SPACING.xl },

  // ─── Premium Banner ───────────────────────────────────────────────────────
  premiumCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  premiumBanner: {
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  premiumTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  premiumLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#D1FAE5',
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: SPACING.xs,
  },
  premiumCtaBox: {
    backgroundColor: '#FFFFFF',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  premiumCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#06402B',
  },
});
