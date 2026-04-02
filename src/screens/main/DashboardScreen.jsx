// src/screens/main/DashboardScreen.jsx
import { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList,
  Dimensions, Animated, Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Heart, Clock, Sparkles, ArrowRight, ChefHat } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';

import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { MOCK_RECIPES, TRENDING_IDS } from '../../data/mockData';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.58;
const CARD_H = 255;

// ─── Spring helpers ───────────────────────────────────────────────────────────
function useSpring(target = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() =>
    Animated.spring(scale, { toValue: target, useNativeDriver: true, speed: 120, bounciness: 0 }).start(),
  [scale, target]);
  const pressOut = useCallback(() =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 14 }).start(),
  [scale]);
  return { scale, pressIn, pressOut };
}

// ─── InspirationCard ──────────────────────────────────────────────────────────
function InspirationCard({ recipe, onPress, isSaved }) {
  const { scale, pressIn, pressOut } = useSpring(0.965);
  return (
    <Pressable 
      onPress={onPress} 
      onPressIn={pressIn} 
      onPressOut={pressOut}
      android_ripple={RIPPLE_LIGHT}
    >
      <Animated.View style={[ic.card, { transform: [{ scale }] }]}>
        <RecipeImage recipe={recipe} height={CARD_H} borderRadius={RADIUS.xl} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.78)']}
          start={{ x: 0, y: 0.35 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Top badges */}
        <View style={ic.topRow}>
          <View style={ic.timeBadge}>
            <Clock size={10} color="#fff" strokeWidth={2} />
            <Text style={ic.timeText}>{recipe.prepTime}m</Text>
          </View>
          {isSaved && (
            <View style={ic.heartBadge}>
              <Heart size={12} color="#F87171" fill="#F87171" strokeWidth={0} />
            </View>
          )}
        </View>
        {/* Bottom */}
        <View style={ic.bottom}>
          <Text style={ic.title} numberOfLines={2}>{recipe.title}</Text>
          <View style={ic.authorRow}>
            <View style={ic.authorDot} />
            <Text style={ic.authorName} numberOfLines={1}>{recipe.author || 'FRIDGR Chef'}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const ic = StyleSheet.create({
  card: { width: CARD_W, height: CARD_H, borderRadius: RADIUS.xl, overflow: 'hidden', marginRight: SPACING.md, ...SHADOWS.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: RADIUS.full },
  timeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  heartBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14, gap: 6 },
  title: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', lineHeight: 20 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  authorName: { fontSize: 12, color: 'rgba(255,255,255,0.75)', flex: 1 },
});

// ─── Touch Config ─────────────────────────────────────────────────────────────
const RIPPLE_LIGHT = { color: 'rgba(255,255,255,0.2)', borderless: false };
const RIPPLE_DARK  = { color: 'rgba(0,0,0,0.06)', borderless: false };

// ─── CategoryItem ─────────────────────────────────────────────────────────────
function CategoryItem({ item, onPress }) {
  const { scale, pressIn, pressOut } = useSpring(0.9);
  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[cat.wrap, { transform: [{ scale }] }]}>
        <View style={cat.circle}>
          <RecipeImage recipe={item.recipe} height={66} borderRadius={33} style={{ width: 66 }} />
        </View>
        <Text style={cat.label} numberOfLines={1}>{item.label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const cat = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 7, marginRight: 18, width: 72 },
  circle: { width: 66, height: 66, borderRadius: 33, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(62,107,80,0.12)', ...SHADOWS.xs },
  label: { fontSize: 12, fontWeight: '600', color: '#1E1E1C', textAlign: 'center' },
});

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, onSeeAll }) {
  const { scale, pressIn, pressOut } = useSpring(0.92);
  return (
    <View style={sh.row}>
      <Text style={sh.title}>{title}</Text>
      <Pressable 
        onPress={onSeeAll} 
        onPressIn={pressIn} 
        onPressOut={pressOut}
        android_ripple={{ color: 'rgba(62,107,80,0.08)', borderless: true, radius: 40 }}
      >
        <Animated.Text style={[sh.seeAll, { transform: [{ scale: scale }] }]}>See all</Animated.Text>
      </Pressable>
    </View>
  );
}

const sh = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.xl, marginBottom: 14 },
  title: { fontSize: 17, fontWeight: '800', color: '#1E1E1C', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontWeight: '700', color: '#3E6B50' },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { savedRecipes, isSaved } = useRecipes();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, []);

  const { scale: bellScale, pressIn: bellIn, pressOut: bellOut } = useSpring(0.88);

  const trending = useMemo(() =>
    TRENDING_IDS.map(id => MOCK_RECIPES.find(r => r.id === id)).filter(Boolean),
  []);

  const dailyInspiration = useMemo(
    () => [...MOCK_RECIPES].sort(() => 0.5 - Math.random()).slice(0, 6),
    [],
  );

  const CATEGORIES = [
    { label: 'Pasta',   recipe: MOCK_RECIPES[0] },
    { label: 'Pizza',   recipe: MOCK_RECIPES[1] },
    { label: 'Biryani', recipe: MOCK_RECIPES[2] },
    { label: 'Coffee',  recipe: MOCK_RECIPES[3] },
    { label: 'Dessert', recipe: MOCK_RECIPES[4] },
    { label: 'Salads',  recipe: MOCK_RECIPES[5] },
  ];

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const firstName = (user?.name ?? '').split(' ')[0] || 'Chef';

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Header ── */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={[styles.header, { paddingTop: insets.top + 18 }]}>
            <View style={styles.headerLeft}>
              <Pressable onPress={() => navigation.navigate('ProfileTab')}>
                <View style={styles.avatarWrap}>
                  <Text style={styles.avatarText}>{firstName[0].toUpperCase()}</Text>
                </View>
              </Pressable>
              <View style={styles.greetingCol}>
                <Text style={styles.greetingText}>{greeting},</Text>
                <Text style={styles.nameText}>{firstName} 👋</Text>
              </View>
            </View>
            <Pressable 
              onPressIn={bellIn} 
              onPressOut={bellOut} 
              onPress={() => Alert.alert('Notifications', 'No new notifications.')}
              android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true, radius: 24 }}
            >
              <Animated.View style={[styles.bellBtn, { transform: [{ scale: bellScale }] }]}>
                <Bell size={18} color="#1E1E1C" strokeWidth={ICON_STROKE} />
              </Animated.View>
            </Pressable>
          </View>

          {/* ── What to cook card ── */}
          <View style={styles.cookCardWrap}>
            <Pressable
              style={({ pressed }) => [styles.cookCard, pressed && Platform.OS === 'ios' && { opacity: 0.92 }]}
              onPress={() => navigation.navigate('ScanTab')}
              android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: false }}
            >
              <LinearGradient
                colors={['#2C4D38', '#3E6B50', '#4A7C5E']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.cookGradient}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.10)', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.6 }}
                  style={StyleSheet.absoluteFill} pointerEvents="none"
                />
                <View style={styles.cookLeft}>
                  <Text style={styles.cookQuestion}>What can I cook today?</Text>
                  <Text style={styles.cookSub}>Scan your fridge & get recipes</Text>
                  <View style={styles.cookCta}>
                    <Text style={styles.cookCtaText}>Scan now</Text>
                    <ArrowRight size={14} color="#D1FAE5" strokeWidth={2.5} />
                  </View>
                </View>
                <View style={styles.cookIconWrap}>
                  <ChefHat size={36} color="rgba(255,255,255,0.9)" strokeWidth={ICON_STROKE} />
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>

        {/* ── Daily Inspiration ── */}
        <View style={styles.section}>
          <SectionHeader title="Daily Inspiration" onSeeAll={() => navigation.navigate('RecipesTab')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {dailyInspiration.map(recipe => (
              <InspirationCard
                key={recipe.id}
                recipe={recipe}
                isSaved={isSaved(recipe.id)}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Categories ── */}
        <View style={styles.section}>
          <SectionHeader title="Categories" onSeeAll={() => navigation.navigate('RecipesTab')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {CATEGORIES.map(item => (
              <CategoryItem
                key={item.label}
                item={item}
                onPress={() => navigation.navigate('RecipesTab', { category: item.label })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Trending ── */}
        <View style={styles.section}>
          <SectionHeader title="Trending recipes" onSeeAll={() => navigation.navigate('RecipesTab')} />
          <FlatList
            data={trending}
            keyExtractor={r => r.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <InspirationCard
                recipe={item}
                isSaved={isSaved(item.id)}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
              />
            )}
          />
        </View>

        {/* ── Premium banner ── */}
        {savedRecipes.length < 3 && (
          <View style={styles.premiumWrap}>
            <Pressable
              style={({ pressed }) => [styles.premiumCard, pressed && Platform.OS === 'ios' && { opacity: 0.92, transform: [{ scale: 0.985 }] }]}
              onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
              android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
            >
              <LinearGradient
                colors={['#0D3B26', '#1A5C3A', '#0D3B26']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.premiumGradient}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.10)', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}
                  style={StyleSheet.absoluteFill} pointerEvents="none"
                />
                <View style={styles.premiumChip}>
                  <Sparkles size={11} color="#FBD96A" strokeWidth={2} />
                  <Text style={styles.premiumChipText}>FRIDGR PREMIUM</Text>
                </View>
                <Text style={styles.premiumTitle}>Unlimited scans & meal plans</Text>
                <View style={styles.premiumCta}>
                  <Text style={styles.premiumCtaText}>Try free for 7 days</Text>
                  <ArrowRight size={14} color="#D1FAE5" strokeWidth={2.5} />
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#3E6B50', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  greetingCol: { gap: 1 },
  greetingText: { fontSize: 12, color: '#8A8A84', fontWeight: '500' },
  nameText: { fontSize: 16, fontWeight: '800', color: '#1E1E1C' },
  bellBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F4F1EA', alignItems: 'center', justifyContent: 'center' },

  // Cook card
  cookCardWrap: { paddingHorizontal: SPACING.xl, marginTop: 4, marginBottom: 6 },
  cookCard: { borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.green },
  cookGradient: { flexDirection: 'row', alignItems: 'center', padding: SPACING.xl, overflow: 'hidden' },
  cookLeft: { flex: 1, gap: 4 },
  cookQuestion: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  cookSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  cookCta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  cookCtaText: { fontSize: 13, fontWeight: '700', color: '#D1FAE5' },
  cookIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },

  // Sections
  section: { paddingTop: 26 },
  hList: { paddingHorizontal: SPACING.xl, paddingBottom: 4 },

  // Premium
  premiumWrap: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  premiumCard: { borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.lg },
  premiumGradient: { padding: SPACING.xl, gap: SPACING.md, overflow: 'hidden' },
  premiumChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)',
  },
  premiumChipText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1, color: '#D1FAE5' },
  premiumTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', lineHeight: 26 },
  premiumCta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  premiumCtaText: { fontSize: 14, fontWeight: '700', color: '#D1FAE5' },
});
