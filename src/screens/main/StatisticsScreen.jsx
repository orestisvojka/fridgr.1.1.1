// src/screens/main/StatisticsScreen.jsx
// Real stats computed from RecipesContext (recentScans + savedRecipes)

import { useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, Bookmark, Zap, Flame } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { useThemeColors } from '../../context/ThemeContext';
import { SPACING, RADIUS, SHADOWS, FONT } from '../../constants/theme';
import { ICON_STROKE } from '../../constants/icons';
import Icon3D from '../../components/Icon3D';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeTopIngredients(recentScans, limit = 5) {
  const freq = {};
  recentScans.forEach(scan => {
    (scan.ingredients ?? []).forEach(ing => {
      freq[ing] = (freq[ing] ?? 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function computeActivityGrid(recentScans, days = 28) {
  const scanDays = new Set(
    recentScans.map(s => new Date(s.timestamp).toISOString().split('T')[0]),
  );
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return scanDays.has(d.toISOString().split('T')[0]);
  });
}

function computeStreak(recentScans) {
  const scanDays = new Set(
    recentScans.map(s => new Date(s.timestamp).toISOString().split('T')[0]),
  );
  let streak = 0;
  const d = new Date();
  while (scanDays.has(d.toISOString().split('T')[0])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ─── Animated stat card ───────────────────────────────────────────────────────
function StatCard({ icon, label, value, gradient, index }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 380, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 380, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[card.wrap, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={card.gradient}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.18)', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.6 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={card.iconWrap}>
          {icon}
        </View>
        <Text style={card.value}>{value}</Text>
        <Text style={card.label}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const card = StyleSheet.create({
  wrap:     { flex: 1, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.md },
  gradient: { padding: SPACING.lg, gap: SPACING.sm, minHeight: 110, overflow: 'hidden' },
  iconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center', justifyContent: 'center',
  },
  value: { fontSize: 26, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFF', letterSpacing: -0.5 },
  label: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: 'rgba(255,255,255,0.75)', letterSpacing: 0.2 },
});

// ─── Animated ingredient bar ──────────────────────────────────────────────────
function IngredientBar({ name, count, max, index, C }) {
  const pct       = max > 0 ? count / max : 0;
  const widthAnim = useRef(new Animated.Value(0)).current;
  const fade      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 300, delay: index * 60, useNativeDriver: true }),
      Animated.timing(widthAnim, { toValue: pct, duration: 600, delay: index * 60 + 150, useNativeDriver: false }),
    ]).start();
  }, [pct]);

  const barWidth = widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View style={[ib.row, { opacity: fade }]}>
      <Text style={[ib.name, { color: C.text }]} numberOfLines={1}>{name}</Text>
      <View style={[ib.track, { backgroundColor: C.surface2 }]}>
        <Animated.View style={[ib.fill, { width: barWidth, backgroundColor: C.primary }]} />
      </View>
      <Text style={[ib.count, { color: C.primary }]}>{count}×</Text>
    </Animated.View>
  );
}

const ib = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  name:  { width: 72, ...FONT.bodySmallMedium },
  track: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 4 },
  count: { width: 28, ...FONT.captionMedium, textAlign: 'right', fontFamily: 'Poppins_400Regular', fontWeight: '400' },
});

// ─── Activity grid ────────────────────────────────────────────────────────────
function ActivityGrid({ grid, C }) {
  return (
    <View style={ag.grid}>
      {grid.map((active, i) => (
        <View
          key={i}
          style={[
            ag.cell,
            { backgroundColor: active ? C.primary : C.surface2 },
          ]}
        />
      ))}
    </View>
  );
}

const ag = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: { width: 24, height: 24, borderRadius: 5 },
});

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children, C }) {
  return (
    <View style={sec.wrap}>
      <Text style={[sec.title, { color: C.textSecondary }]}>{title}</Text>
      <View style={[sec.card, { backgroundColor: C.surface, borderColor: C.borderLight }]}>
        {children}
      </View>
    </View>
  );
}

const sec = StyleSheet.create({
  wrap:  { gap: SPACING.sm },
  title: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400', textTransform: 'uppercase', letterSpacing: 0.9, marginLeft: 4 },
  card:  { borderRadius: RADIUS.xl, padding: SPACING.lg, borderWidth: 1, ...SHADOWS.sm },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StatisticsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C      = useThemeColors();
  const { recentScans, savedRecipes } = useRecipes();

  const topIngredients = useMemo(() => computeTopIngredients(recentScans), [recentScans]);
  const activityGrid   = useMemo(() => computeActivityGrid(recentScans),   [recentScans]);
  const streak         = useMemo(() => computeStreak(recentScans),          [recentScans]);
  const maxCount       = topIngredients[0]?.count ?? 1;

  const STAT_CARDS = [
    {
      icon:     <Zap size={18} color="#FFF" strokeWidth={ICON_STROKE + 0.5} />,
      label:    'Total Scans',
      value:    recentScans.length,
      gradient: ['#FF9F1C', '#FF6B35'],
    },
    {
      icon:     <Bookmark size={18} color="#FFF" strokeWidth={ICON_STROKE} />,
      label:    'Saved Recipes',
      value:    savedRecipes.length,
      gradient: ['#7B2FBE', '#5A189A'],
    },
    {
      icon:     <Flame size={18} color="#FFF" strokeWidth={ICON_STROKE} />,
      label:    'Day Streak',
      value:    `${streak}d`,
      gradient: ['#3E6B50', '#2C4D38'],
    },
    {
      icon:     <TrendingUp size={18} color="#FFF" strokeWidth={ICON_STROKE} />,
      label:    'Ingredients Used',
      value:    recentScans.reduce((acc, s) => acc + (s.ingredients?.length ?? 0), 0),
      gradient: ['#4361EE', '#3A0CA3'],
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={C.isDark ? ['#1A2E22', '#0E1410'] : ['#3E6B50', '#2C4D38']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }, { overflow: 'hidden' }]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true, radius: 22 }}
        >
          <ArrowLeft size={20} color="#FFF" strokeWidth={ICON_STROKE} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Your Statistics</Text>
          <Text style={styles.headerSub}>Food habits & cooking insights</Text>
        </View>
        <Icon3D name="statistics" size="sm" />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
      >
        {/* ── Stat cards grid ── */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            {STAT_CARDS.slice(0, 2).map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </View>
          <View style={styles.statsRow}>
            {STAT_CARDS.slice(2, 4).map((s, i) => (
              <StatCard key={s.label} {...s} index={i + 2} C={C} />
            ))}
          </View>
        </View>

        {/* ── Top ingredients ── */}
        {topIngredients.length > 0 ? (
          <Section title="Most Used Ingredients" C={C}>
            <View style={{ gap: SPACING.md }}>
              {topIngredients.map((item, i) => (
                <IngredientBar
                  key={item.name}
                  name={item.name}
                  count={item.count}
                  max={maxCount}
                  index={i}
                  C={C}
                />
              ))}
            </View>
          </Section>
        ) : (
          <Section title="Most Used Ingredients" C={C}>
            <Text style={[styles.emptyText, { color: C.textTertiary }]}>
              Scan your fridge a few times to see your top ingredients here.
            </Text>
          </Section>
        )}

        {/* ── Activity grid ── */}
        <Section title="28-Day Activity" C={C}>
          <ActivityGrid grid={activityGrid} C={C} />
          <Text style={[styles.gridCaption, { color: C.textTertiary }]}>
            {streak > 0
              ? `🔥 ${streak}-day streak — keep it up!`
              : 'Each filled cell = a day you scanned ingredients.'}
          </Text>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerText:  { flex: 1 },
  headerTitle: { ...FONT.h3, color: '#FFFFFF' },
  headerSub:   { ...FONT.bodySmall, color: 'rgba(255,255,255,0.60)', marginTop: 2 },

  scroll:    { padding: SPACING.xl, gap: SPACING.xl },
  statsGrid: { gap: SPACING.md },
  statsRow:  { flexDirection: 'row', gap: SPACING.md },

  emptyText:   { ...FONT.body, textAlign: 'center', paddingVertical: SPACING.md },
  gridCaption: { ...FONT.caption, marginTop: SPACING.md, textAlign: 'center' },
});
