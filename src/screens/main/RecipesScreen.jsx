// src/screens/main/RecipesScreen.jsx
import { useState, useMemo, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, ScrollView, Animated,
} from 'react-native';
import { Search, XCircle, Heart, Clock, Flame, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRecipes } from '../../context/RecipesContext';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { MOCK_RECIPES } from '../../data/mockData';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';
import {
  PREMIUM_HERO_COMPACT,
  PREMIUM_HERO_COMPACT_END,
  PREMIUM_HERO_COMPACT_START,
} from '../../constants/premiumScreenTheme';

const FILTERS = ['All', 'Quick', 'Vegetarian', 'High Protein', 'Easy'];

// ─── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() =>
    Animated.spring(scale, { toValue: 0.90, useNativeDriver: true, speed: 120, bounciness: 0 }).start(), [scale]);
  const pressOut = useCallback(() =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 18 }).start(), [scale]);

  return (
    <Pressable 
      onPress={onPress} 
      onPressIn={pressIn} 
      onPressOut={pressOut}
      android_ripple={{ color: 'rgba(62,107,80,0.1)', borderless: true, radius: 40 }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {active ? (
          <LinearGradient
            colors={['#3E6B50', '#2C4D38']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={chip.base}
          >
            <Text style={[chip.text, { color: '#FFFFFF' }]}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={chip.inactive}>
            <Text style={[chip.text, { color: '#4A4A46' }]}>{label}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const chip = StyleSheet.create({
  base: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  inactive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1, borderColor: 'rgba(62,107,80,0.15)' },
  text: { fontSize: 13, fontWeight: '600', letterSpacing: 0.1 },
});

// ─── Recipe Row Card ──────────────────────────────────────────────────────────
function RecipeCard({ recipe, onPress, isSaved, C }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 120, bounciness: 0 }).start(), [scale]);
  const pressOut = useCallback(() =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 14 }).start(), [scale]);

  const diffBg   = recipe.difficulty === 'Easy' ? '#EDF5F0' : recipe.difficulty === 'Medium' ? '#FAF0D0' : '#FCECEC';
  const diffColor = recipe.difficulty === 'Easy' ? '#3E6B50' : recipe.difficulty === 'Medium' ? '#8A6820' : '#8A2828';

  return (
    <Pressable 
      onPress={onPress} 
      onPressIn={pressIn} 
      onPressOut={pressOut}
      android_ripple={{ color: 'rgba(62,107,80,0.08)' }}
      style={({ pressed }) => [{ borderRadius: RADIUS.xl, overflow: 'hidden' }]}
    >
      <Animated.View style={[card.wrap, { transform: [{ scale }] }]}>
        {/* Thumb */}
        <View style={card.thumb}>
          <RecipeImage recipe={recipe} height={70} borderRadius={RADIUS.lg} style={{ width: 70 }} />
        </View>
        {/* Body */}
        <View style={card.body}>
          <View style={card.titleRow}>
            <Text style={[card.title, { color: C.text }]} numberOfLines={1}>{recipe.title}</Text>
            {isSaved && <Heart size={13} color="#DB2777" fill="#FBCFE8" strokeWidth={ICON_STROKE} />}
          </View>
          <Text style={card.desc} numberOfLines={1}>{recipe.description}</Text>
          <View style={card.meta}>
            <View style={card.metaPill}>
              <Clock size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={[card.metaText, { color: C.textTertiary }]}>{recipe.prepTime}m</Text>
            </View>
            <View style={card.metaPill}>
              <Flame size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={[card.metaText, { color: C.textTertiary }]}>{recipe.calories} cal</Text>
            </View>
            <View style={[card.diffBadge, { backgroundColor: diffBg }]}>
              <Text style={{ fontSize: 9, fontWeight: '700', color: diffColor }}>{recipe.difficulty}</Text>
            </View>
          </View>
        </View>
        {/* Arrow */}
        <View style={card.arrow}>
          <ChevronRight size={14} color="#3E6B50" strokeWidth={ICON_STROKE + 0.5} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const card = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: 'rgba(228,221,210,0.8)',
    ...SHADOWS.sm,
  },
  thumb: { width: 70, height: 70, borderRadius: RADIUS.lg, overflow: 'hidden', flexShrink: 0, backgroundColor: '#F4F1EA' },
  body: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 14, fontWeight: '700', flex: 1 },
  desc: { fontSize: 11, color: '#8A8A84' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, fontWeight: '500' },
  diffBadge: { borderRadius: RADIUS.full, paddingHorizontal: 7, paddingVertical: 2 },
  arrow: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#EDF5F0', alignItems: 'center', justifyContent: 'center' },
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
        if (activeFilter === 'Quick')        return r.prepTime <= 15;
        if (activeFilter === 'Vegetarian')   return r.tags?.includes('vegetarian');
        if (activeFilter === 'High Protein') return r.macros?.protein >= 20;
        if (activeFilter === 'Easy')         return r.difficulty === 'Easy';
        return true;
      });
    }
    return list;
  }, [search, activeFilter]);

  return (
    <View style={styles.root}>
      {/* Background */}
      <LinearGradient
        colors={['#F9F7F2', '#F4F1EA', '#EDE8DF']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Hero header */}
      <LinearGradient
        colors={PREMIUM_HERO_COMPACT}
        start={PREMIUM_HERO_COMPACT_START}
        end={PREMIUM_HERO_COMPACT_END}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <Text style={styles.headerTitle}>All Recipes</Text>
        <Text style={styles.headerSub}>{MOCK_RECIPES.length} recipes available</Text>

        {/* Search bar — plain View, no BlurView */}
        <View style={styles.searchWrap}>
          <Search size={17} color="rgba(62,107,80,0.55)" strokeWidth={ICON_STROKE} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search recipes or ingredients…"
            placeholderTextColor="rgba(62,107,80,0.4)"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <XCircle size={17} color="rgba(62,107,80,0.45)" strokeWidth={ICON_STROKE} />
            </Pressable>
          )}
        </View>
      </LinearGradient>

      {/* Filter chips */}
      <View style={styles.filtersBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
          keyboardShouldPersistTaps="handled"
        >
          {FILTERS.map(f => (
            <FilterChip
              key={f}
              label={f}
              active={activeFilter === f}
              onPress={() => setActiveFilter(f)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Recipe list */}
      <FlatList
        data={filtered}
        keyExtractor={r => r.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={(
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptySub}>Try a different search or filter</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <RecipeCard
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
  root: { flex: 1, backgroundColor: '#F4F1EA' },
  header: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl, gap: SPACING.xs },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 2 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: SPACING.md },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.md, height: 46,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.95)',
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1E1E1C', paddingVertical: 0 },
  filtersBar: { backgroundColor: 'rgba(255,255,255,0.7)', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(62,107,80,0.12)' },
  filtersRow: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, gap: SPACING.sm, flexDirection: 'row' },
  list: { padding: SPACING.xl, gap: SPACING.md, paddingBottom: 160 },
  empty: { alignItems: 'center', paddingTop: 80, gap: SPACING.sm },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1E1E1C' },
  emptySub: { fontSize: 14, color: '#8A8A84' },
});
