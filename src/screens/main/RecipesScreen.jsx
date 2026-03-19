// src/screens/main/RecipesScreen.jsx
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRecipes } from '../../context/RecipesContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { MOCK_RECIPES } from '../../data/mockData';

const FILTERS = ['All', 'Quick', 'Vegetarian', 'High Protein', 'Easy'];
const CUISINES = ['All', 'Italian', 'Asian', 'Middle Eastern', 'Greek', 'Mexican'];

function RecipeListCard({ recipe, onPress, isSaved }) {
  const palette = COLORS.recipePalettes[parseInt(recipe.id.replace('r', ''), 10) % COLORS.recipePalettes.length];
  return (
    <TouchableOpacity style={styles.listCard} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.listCardEmoji, { backgroundColor: palette.light }]}>
        <Text style={styles.listCardEmojiText}>{recipe.emoji}</Text>
      </View>
      <View style={styles.listCardBody}>
        <View style={styles.listCardTop}>
          <Text style={styles.listCardTitle} numberOfLines={1}>{recipe.title}</Text>
          {isSaved && <Ionicons name="heart" size={14} color="#DB2777" />}
        </View>
        <Text style={styles.listCardDesc} numberOfLines={1}>{recipe.description}</Text>
        <View style={styles.listCardMeta}>
          <View style={styles.metaPill}>
            <Ionicons name="time-outline" size={12} color={COLORS.textTertiary} />
            <Text style={styles.metaText}>{recipe.prepTime}m</Text>
          </View>
          <View style={styles.metaPill}>
            <Ionicons name="flame-outline" size={12} color={COLORS.textTertiary} />
            <Text style={styles.metaText}>{recipe.calories} cal</Text>
          </View>
          <View style={[styles.diffPill, {
            backgroundColor:
              recipe.difficulty === 'Easy' ? COLORS.primaryFaint
              : recipe.difficulty === 'Medium' ? COLORS.accentFaint
              : COLORS.errorLight,
          }]}>
            <Text style={[styles.diffPillText, {
              color: recipe.difficulty === 'Easy' ? COLORS.primary
                : recipe.difficulty === 'Medium' ? COLORS.accent
                : COLORS.error,
            }]}>
              {recipe.difficulty}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );
}

export default function RecipesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isSaved } = useRecipes();

  const [search,        setSearch]        = useState('');
  const [activeFilter,  setActiveFilter]  = useState('All');
  const [activeCuisine, setActiveCuisine] = useState('All');

  const filtered = useMemo(() => {
    let list = MOCK_RECIPES;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q))
      );
    }
    if (activeFilter !== 'All') {
      list = list.filter(r => {
        if (activeFilter === 'Quick')        return r.prepTime <= 15;
        if (activeFilter === 'Vegetarian')   return r.tags?.includes('vegetarian');
        if (activeFilter === 'High Protein') return r.macros.protein >= 20;
        if (activeFilter === 'Easy')         return r.difficulty === 'Easy';
        return true;
      });
    }
    if (activeCuisine !== 'All') {
      list = list.filter(r => r.cuisine === activeCuisine);
    }
    return list;
  }, [search, activeFilter, activeCuisine]);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#0A1F0E', '#15803D']}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <Text style={styles.headerTitle}>All Recipes</Text>
        <Text style={styles.headerSub}>{MOCK_RECIPES.length} recipes available</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={COLORS.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search recipes or ingredients…"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={r => r.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptySub}>Try a different search or filter</Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecipeListCard
            recipe={item}
            isSaved={isSaved(item.id)}
            onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  filtersSection: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  filters: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, gap: SPACING.sm },
  filterChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full, backgroundColor: COLORS.surface2,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primaryFaint, borderColor: COLORS.primary },
  filterChipText: { ...FONT.bodySmallMedium, color: COLORS.textSecondary },
  filterChipTextActive: { color: COLORS.primary },
  list: { padding: SPACING.xl, gap: SPACING.sm, paddingBottom: 30 },
  listCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.borderLight,
    padding: SPACING.md, gap: SPACING.md,
    ...SHADOWS.xs,
  },
  listCardEmoji: {
    width: 60, height: 60, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  listCardEmojiText: { fontSize: 28 },
  listCardBody: { flex: 1, gap: SPACING.xs },
  listCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listCardTitle: { ...FONT.bodySemiBold, color: COLORS.text, flex: 1 },
  listCardDesc: { ...FONT.bodySmall, color: COLORS.textSecondary },
  listCardMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { ...FONT.caption, color: COLORS.textTertiary },
  diffPill: { borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  diffPillText: { fontSize: 10, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: SPACING.section * 2, gap: SPACING.md },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { ...FONT.h4, color: COLORS.text },
  emptySub: { ...FONT.body, color: COLORS.textSecondary },
});
