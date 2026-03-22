// src/screens/main/RecipesScreen.jsx
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, ScrollView,
} from 'react-native';
import {
  Search,
  XCircle,
  Heart,
  Clock,
  Flame,
  ChevronRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRecipes } from '../../context/RecipesContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
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

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    header: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl },
    headerTitle: { ...FONT.h2, color: '#FFFFFF', marginBottom: SPACING.xs },
    headerSub: { ...FONT.bodySmall, color: 'rgba(255,255,255,0.55)', marginBottom: SPACING.lg },
    searchWrap: {
      flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 46,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    },
    searchInput: { flex: 1, ...FONT.body, color: '#FFFFFF' },
    filtersSection: { backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.borderLight },
    filters: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, gap: SPACING.sm },
    filterChip: {
      paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
      borderRadius: RADIUS.full, backgroundColor: C.surface2,
      borderWidth: 1.5, borderColor: C.border,
    },
    filterChipActive: { backgroundColor: C.primaryFaint, borderColor: C.primary },
    filterChipText: { ...FONT.bodySmallMedium, color: C.textSecondary },
    filterChipTextActive: { color: C.primary },
    list: { padding: SPACING.xl, gap: SPACING.sm, paddingBottom: 30 },
    listCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: C.surface, borderRadius: RADIUS.xl,
      borderWidth: 1, borderColor: C.borderLight,
      padding: SPACING.md, gap: SPACING.md,
      ...SHADOWS.xs,
    },
    listCardThumb: {
      width: 60, height: 60, borderRadius: RADIUS.lg,
      overflow: 'hidden',
    },
    listCardBody: { flex: 1, gap: SPACING.xs },
    listCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    listCardTitle: { ...FONT.bodySemiBold, color: C.text, flex: 1 },
    listCardDesc: { ...FONT.bodySmall, color: C.textSecondary },
    listCardMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
    metaPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    metaText: { ...FONT.caption, color: C.textTertiary },
    diffPill: { borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
    diffPillText: { fontSize: 10, fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingTop: SPACING.section * 2, gap: SPACING.md },
    emptyEmoji: { fontSize: 48 },
    emptyTitle: { ...FONT.h4, color: C.text },
    emptySub: { ...FONT.body, color: C.textSecondary },
  });
}

function RecipeListCard({ recipe, onPress, isSaved, styles, C }) {
  const diffBg =
    recipe.difficulty === 'Easy' ? C.primaryFaint
      : recipe.difficulty === 'Medium' ? C.accentFaint
        : C.errorLight;
  const diffColor =
    recipe.difficulty === 'Easy' ? C.primary
      : recipe.difficulty === 'Medium' ? C.accent
        : C.error;

  return (
    <Pressable
      style={({ pressed }) => [styles.listCard, pressed && { opacity: 0.9 }]}
      onPress={onPress}
    >
      <View style={styles.listCardThumb}>
        <RecipeImage recipe={recipe} height={60} borderRadius={RADIUS.lg} style={{ width: 60 }} />
      </View>
      <View style={styles.listCardBody}>
        <View style={styles.listCardTop}>
          <Text style={styles.listCardTitle} numberOfLines={1}>{recipe.title}</Text>
          {isSaved && <Heart size={14} color="#DB2777" fill="#FBCFE8" strokeWidth={ICON_STROKE} />}
        </View>
        <Text style={styles.listCardDesc} numberOfLines={1}>{recipe.description}</Text>
        <View style={styles.listCardMeta}>
          <View style={styles.metaPill}>
            <Clock size={12} color={C.textTertiary} strokeWidth={ICON_STROKE} />
            <Text style={styles.metaText}>{recipe.prepTime}m</Text>
          </View>
          <View style={styles.metaPill}>
            <Flame size={12} color={C.textTertiary} strokeWidth={ICON_STROKE} />
            <Text style={styles.metaText}>{recipe.calories} cal</Text>
          </View>
          <View style={[styles.diffPill, { backgroundColor: diffBg }]}>
            <Text style={[styles.diffPillText, { color: diffColor }]}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
      <ChevronRight size={16} color={C.textTertiary} strokeWidth={ICON_STROKE} />
    </Pressable>
  );
}

export default function RecipesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
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
        if (activeFilter === 'Quick') return r.prepTime <= 15;
        if (activeFilter === 'Vegetarian') return r.tags?.includes('vegetarian');
        if (activeFilter === 'High Protein') return r.macros.protein >= 20;
        if (activeFilter === 'Easy') return r.difficulty === 'Easy';
        return true;
      });
    }
    return list;
  }, [search, activeFilter]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={PREMIUM_HERO_COMPACT}
        start={PREMIUM_HERO_COMPACT_START}
        end={PREMIUM_HERO_COMPACT_END}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <Text style={styles.headerTitle}>All Recipes</Text>
        <Text style={styles.headerSub}>{MOCK_RECIPES.length} recipes available</Text>

        <View style={styles.searchWrap}>
          <Search size={18} color="rgba(255,255,255,0.55)" strokeWidth={ICON_STROKE} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search recipes or ingredients…"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <XCircle size={18} color="rgba(255,255,255,0.5)" strokeWidth={ICON_STROKE} />
            </Pressable>
          )}
        </View>
      </LinearGradient>

      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map(f => (
            <Pressable
              key={f}
              style={({ pressed }) => [
                styles.filterChip,
                activeFilter === f && styles.filterChipActive,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={r => r.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptySub}>Try a different search or filter</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <RecipeListCard
            recipe={item}
            isSaved={isSaved(item.id)}
            styles={styles}
            C={C}
            onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
          />
        )}
      />
    </View>
  );
}
