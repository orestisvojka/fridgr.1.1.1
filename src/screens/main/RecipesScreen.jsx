// src/screens/main/RecipesScreen.jsx
import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, ScrollView, Animated,
} from 'react-native';
import {
  Search, XCircle, Heart, Clock, Flame, ChevronRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRecipes } from '../../context/RecipesContext';
import { FONT, SPACING, RADIUS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import {
  PREMIUM_HERO_COMPACT,
  PREMIUM_HERO_COMPACT_END,
  PREMIUM_HERO_COMPACT_START,
} from '../../constants/premiumScreenTheme';
import { MOCK_RECIPES } from '../../data/mockData';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';

const FILTERS = ['All', 'Quick', 'Vegetarian', 'High Protein', 'Easy'];

// ─── GlassPanel ───────────────────────────────────────────────────────────────
function GlassPanel({ style, children, shimmerColor = 'rgba(62,107,80,0.13)' }) {
  return (
    <View style={[glassS.panel, style]}>
      <BlurView intensity={75} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0.5)', 'rgba(249,247,242,0.2)']}
        start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill} pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.0)']}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.38 }}
        style={StyleSheet.absoluteFill} pointerEvents="none"
      />
      <LinearGradient
        colors={[shimmerColor, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 0.55, y: 1 }}
        style={StyleSheet.absoluteFill} pointerEvents="none"
      />
      {children}
    </View>
  );
}

const glassS = StyleSheet.create({
  panel: {
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.92)',
    borderRadius: RADIUS.xl,
  },
});

// ─── SpringCard ───────────────────────────────────────────────────────────────
function SpringCard({ onPress, style, children, scaleTarget = 0.955 }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleTarget,
      useNativeDriver: true,
      speed: 120,
      bounciness: 0,
    }).start();
  }, [scale, scaleTarget]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 14,
      bounciness: 14,
    }).start();
  }, [scale]);

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── SpringChip ───────────────────────────────────────────────────────────────
function SpringChip({ label, active, onPress, C }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, speed: 120, bounciness: 0 }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 20 }).start();
  }, [scale]);

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {active ? (
          // Active chip — solid green glass
          <LinearGradient
            colors={['#3E6B50', '#2C4D38']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={chip.base}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.18)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <Text style={[chip.text, { color: '#FFFFFF' }]}>{label}</Text>
          </LinearGradient>
        ) : (
          // Inactive chip — glass panel
          <GlassPanel style={chip.base} shimmerColor="rgba(62,107,80,0.10)">
            <Text style={[chip.text, { color: C.textSecondary }]}>{label}</Text>
          </GlassPanel>
        )}
      </Animated.View>
    </Pressable>
  );
}

const chip = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C4D38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});

// ─── Recipe List Card ─────────────────────────────────────────────────────────
function RecipeListCard({ recipe, onPress, isSaved, C }) {
  const palettes = C.recipePalettes;
  const palette = palettes[parseInt(recipe.id.replace('r', ''), 10) % palettes.length] || palettes[0];

  const diffBg =
    recipe.difficulty === 'Easy'   ? C.primaryFaint
    : recipe.difficulty === 'Medium' ? C.accentFaint
    : C.errorLight;
  const diffColor =
    recipe.difficulty === 'Easy'   ? C.primary
    : recipe.difficulty === 'Medium' ? C.accent
    : C.error;

  return (
    <SpringCard onPress={onPress} scaleTarget={0.960}>
      <GlassPanel style={cardS.wrap} shimmerColor={`${palette.color}14`}>
        {/* Thumb */}
        <View style={[cardS.thumb, { backgroundColor: palette.light }]}>
          <RecipeImage recipe={recipe} height={64} borderRadius={RADIUS.lg} style={{ width: 64 }} />
        </View>

        {/* Body */}
        <View style={cardS.body}>
          <View style={cardS.topRow}>
            <Text style={[cardS.title, { color: C.text }]} numberOfLines={1}>{recipe.title}</Text>
            {isSaved && <Heart size={13} color="#DB2777" fill="#FBCFE8" strokeWidth={ICON_STROKE} />}
          </View>
          <Text style={cardS.desc} numberOfLines={1}>{recipe.description}</Text>
          <View style={cardS.metaRow}>
            <View style={cardS.metaPill}>
              <Clock size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={[cardS.metaText, { color: C.textTertiary }]}>{recipe.prepTime}m</Text>
            </View>
            <View style={cardS.metaPill}>
              <Flame size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={[cardS.metaText, { color: C.textTertiary }]}>{recipe.calories} cal</Text>
            </View>
            <View style={[cardS.diffPill, { backgroundColor: diffBg }]}>
              <Text style={{ fontSize: 9, fontWeight: '700', color: diffColor }}>{recipe.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <View style={[cardS.arrow, { backgroundColor: `${C.primary}12` }]}>
          <ChevronRight size={14} color={C.primary} strokeWidth={ICON_STROKE + 0.5} />
        </View>
      </GlassPanel>
    </SpringCard>
  );
}

const cardS = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    shadowColor: '#2C4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 5,
  },
  thumb: { width: 64, height: 64, borderRadius: RADIUS.lg, overflow: 'hidden', flexShrink: 0 },
  body: { flex: 1, gap: 4 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { ...FONT.bodySemiBold, flex: 1, fontSize: 14 },
  desc: { ...FONT.bodySmall, color: '#8A8A84', fontSize: 11 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, fontWeight: '500' },
  diffPill: { borderRadius: RADIUS.full, paddingHorizontal: 7, paddingVertical: 2 },
  arrow: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function RecipesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { isSaved } = useRecipes();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    let list = MOCK_RECIPES;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q)),
      );
    }
    if (activeFilter !== 'All') {
      list = list.filter(r => {
        if (activeFilter === 'Quick')       return r.prepTime <= 15;
        if (activeFilter === 'Vegetarian')  return r.tags?.includes('vegetarian');
        if (activeFilter === 'High Protein') return r.macros.protein >= 20;
        if (activeFilter === 'Easy')        return r.difficulty === 'Easy';
        return true;
      });
    }
    return list;
  }, [search, activeFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F1EA' }}>
      {/* Warm cream gradient backdrop */}
      <LinearGradient
        colors={['#F9F7F2', '#F4F1EA', '#EDE8DF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* ── Green hero header ── */}
      <LinearGradient
        colors={PREMIUM_HERO_COMPACT}
        start={PREMIUM_HERO_COMPACT_START}
        end={PREMIUM_HERO_COMPACT_END}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <Text style={styles.headerTitle}>All Recipes</Text>
        <Text style={styles.headerSub}>{MOCK_RECIPES.length} recipes available</Text>

        {/* Glass search bar */}
        <GlassPanel style={styles.searchWrap} shimmerColor="rgba(255,255,255,0.22)">
          <Search size={17} color="rgba(62,107,80,0.55)" strokeWidth={ICON_STROKE} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search recipes or ingredients…"
            placeholderTextColor="rgba(62,107,80,0.38)"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <XCircle size={17} color="rgba(62,107,80,0.45)" strokeWidth={ICON_STROKE} />
            </Pressable>
          )}
        </GlassPanel>
      </LinearGradient>

      {/* ── Filter chips row ── */}
      <View style={styles.filtersBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map(f => (
            <SpringChip
              key={f}
              label={f}
              active={activeFilter === f}
              onPress={() => setActiveFilter(f)}
              C={C}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── Recipe list ── */}
      <FlatList
        data={filtered}
        keyExtractor={r => r.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptySub}>Try a different search or filter</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <RecipeListCard
            recipe={item}
            isSaved={isSaved(item.id)}
            C={C}
            onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.xs,
  },
  headerTitle: { ...FONT.h2, color: '#FFFFFF', marginBottom: 2 },
  headerSub: { ...FONT.bodySmall, color: 'rgba(255,255,255,0.55)', marginBottom: SPACING.md },

  // Glass search bar
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    height: 46,
    borderColor: 'rgba(255,255,255,0.88)',
    shadowColor: '#2C4D38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1E1E1C',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },

  // Filter chips
  filtersBar: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(62,107,80,0.08)',
  },
  filtersRow: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    flexDirection: 'row',
  },

  // List
  list: {
    padding: SPACING.xl,
    gap: SPACING.sm,
    paddingBottom: 160, // Extends list to scroll natively under absolute tab bar
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: SPACING.sm,
  },
  emptyTitle: { ...FONT.h4, color: '#1E1E1C' },
  emptySub: { ...FONT.body, color: '#8A8A84' },
});
