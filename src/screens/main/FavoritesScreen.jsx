// src/screens/main/FavoritesScreen.jsx
import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';

function FavoriteCard({ recipe, onPress, onRemove }) {
  const palette = COLORS.recipePalettes[parseInt(recipe.id.replace('r', ''), 10) % COLORS.recipePalettes.length];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.cardHero, { backgroundColor: palette.light }]}>
        <Text style={styles.cardEmoji}>{recipe.emoji}</Text>
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="heart" size={18} color="#DB2777" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{recipe.title}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={COLORS.textTertiary} />
            <Text style={styles.metaText}>{recipe.prepTime} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={12} color={COLORS.textTertiary} />
            <Text style={styles.metaText}>{recipe.calories} cal</Text>
          </View>
        </View>
        <View style={[styles.diffBadge, {
          backgroundColor: recipe.difficulty === 'Easy' ? COLORS.primaryFaint
            : recipe.difficulty === 'Medium' ? COLORS.accentFaint
            : COLORS.errorLight,
        }]}>
          <Text style={[styles.diffText, {
            color: recipe.difficulty === 'Easy' ? COLORS.primary
              : recipe.difficulty === 'Medium' ? COLORS.accent
              : COLORS.error,
          }]}>
            {recipe.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { savedRecipes, toggleSave } = useRecipes();

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <LinearGradient
        colors={['#0A1F0E', '#15803D']}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Saved Recipes</Text>
            <Text style={styles.headerSub}>
              {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved
            </Text>
          </View>
          <View style={styles.heartIcon}>
            <Ionicons name="heart" size={22} color="#DB2777" />
          </View>
        </View>
      </LinearGradient>

      {savedRecipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>No saved recipes yet</Text>
          <Text style={styles.emptySub}>
            Tap the heart on any recipe to save it here for quick access
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('RecipesTab')}
          >
            <Text style={styles.browseBtnText}>Browse Recipes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedRecipes}
          keyExtractor={r => r.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FavoriteCard
              recipe={item}
              onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
              onRemove={() => toggleSave(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { ...FONT.h2, color: '#FFFFFF', marginBottom: SPACING.xs },
  headerSub: { ...FONT.bodySmall, color: 'rgba(255,255,255,0.55)' },
  heartIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  grid: { padding: SPACING.lg, paddingBottom: 30 },
  row: { gap: SPACING.md, justifyContent: 'space-between' },
  card: {
    flex: 1, maxWidth: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardHero: {
    height: 110, alignItems: 'center', justifyContent: 'center',
  },
  cardEmoji: { fontSize: 40 },
  removeBtn: {
    position: 'absolute', top: SPACING.sm, right: SPACING.sm,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.xs,
  },
  cardBody: { padding: SPACING.md, gap: SPACING.xs },
  cardTitle: { ...FONT.bodySmallMedium, color: COLORS.text },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { ...FONT.caption, color: COLORS.textTertiary },
  diffBadge: {
    alignSelf: 'flex-start', borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm, paddingVertical: 2,
  },
  diffText: { fontSize: 10, fontWeight: '600' },
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: SPACING.xl * 2, gap: SPACING.md,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { ...FONT.h4, color: COLORS.text, textAlign: 'center' },
  emptySub: { ...FONT.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },
  browseBtn: {
    backgroundColor: COLORS.primaryFaint,
    borderRadius: RADIUS.full, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
    borderWidth: 1.5, borderColor: COLORS.primaryPale,
    marginTop: SPACING.md,
  },
  browseBtnText: { ...FONT.bodySemiBold, color: COLORS.primary },
});
