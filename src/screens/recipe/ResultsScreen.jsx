// src/screens/recipe/ResultsScreen.jsx
import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';

const { width } = Dimensions.get('window');

function MatchBar({ score }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? COLORS.primary : pct >= 50 ? COLORS.accent : COLORS.error;
  return (
    <View style={styles.matchBar}>
      <View style={styles.matchBg}>
        <View style={[styles.matchFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.matchLabel, { color }]}>{pct}% match</Text>
    </View>
  );
}

function RecipeResultCard({ item, index, navigation }) {
  const { toggleSave, isSaved } = useRecipes();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const saved = isSaved(item.recipe.id);

  const palette = COLORS.recipePalettes[parseInt(item.recipe.id.replace('r', ''), 10) % COLORS.recipePalettes.length];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item.recipe })}
        activeOpacity={0.88}
      >
        {/* Hero */}
        <View style={[styles.cardHero, { backgroundColor: palette.light }]}>
          <Text style={styles.cardEmoji}>{item.recipe.emoji}</Text>
          <TouchableOpacity
            style={[styles.heartBtn, saved && styles.heartBtnActive]}
            onPress={() => toggleSave(item.recipe)}
          >
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={saved ? '#FFFFFF' : COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.recipe.title}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={COLORS.star} />
              <Text style={styles.ratingText}>{item.recipe.rating}</Text>
            </View>
          </View>

          <Text style={styles.cardDesc} numberOfLines={2}>{item.recipe.description}</Text>

          {/* Match bar */}
          <MatchBar score={item.matchScore} />

          {/* Macros row */}
          <View style={styles.macrosRow}>
            {[
              { label: 'Cal',  value: item.recipe.calories },
              { label: 'Pro',  value: `${item.recipe.macros.protein}g` },
              { label: 'Carbs', value: `${item.recipe.macros.carbs}g` },
              { label: 'Fat',  value: `${item.recipe.macros.fat}g` },
            ].map(m => (
              <View key={m.label} style={styles.macroItem}>
                <Text style={styles.macroValue}>{m.value}</Text>
                <Text style={styles.macroLabel}>{m.label}</Text>
              </View>
            ))}
          </View>

          {/* Meta pills */}
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={12} color={COLORS.textTertiary} />
              <Text style={styles.metaText}>{item.recipe.prepTime} min</Text>
            </View>
            <View style={[styles.metaPill, {
              backgroundColor: item.recipe.difficulty === 'Easy' ? COLORS.primaryFaint
                : item.recipe.difficulty === 'Medium' ? COLORS.accentFaint
                : COLORS.errorLight,
            }]}>
              <Text style={[styles.diffText, {
                color: item.recipe.difficulty === 'Easy' ? COLORS.primary
                  : item.recipe.difficulty === 'Medium' ? COLORS.accent
                  : COLORS.error,
              }]}>{item.recipe.difficulty}</Text>
            </View>
            {item.missingIngredients.length > 0 && (
              <View style={styles.missingPill}>
                <Ionicons name="alert-circle-outline" size={12} color={COLORS.accent} />
                <Text style={styles.missingText}>
                  {item.missingIngredients.length} missing
                </Text>
              </View>
            )}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item.recipe })}
          >
            <Text style={styles.viewBtnText}>View Recipe</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ResultsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { ingredients = [], results = [] } = route.params ?? {};

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#0A1F0E', '#15803D']}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>
            {results.length} Recipe{results.length !== 1 ? 's' : ''} Found
          </Text>
          <Text style={styles.headerSub}>Based on {ingredients.length} ingredients</Text>
        </View>
      </LinearGradient>

      {/* Ingredient chips */}
      <View style={styles.ingredientStrip}>
        <FlatList
          data={ingredients}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, i) => `${item}${i}`}
          contentContainerStyle={styles.ingredientChips}
          renderItem={({ item }) => (
            <View style={styles.ingredientChip}>
              <Text style={styles.ingredientChipText}>{item}</Text>
            </View>
          )}
        />
      </View>

      {/* Results */}
      {results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🥺</Text>
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptySub}>Try adding more ingredients or changing your filters</Text>
          <TouchableOpacity style={styles.tryAgainBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.tryAgainText}>← Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.recipe.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RecipeResultCard item={item} index={index} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { ...FONT.h3, color: '#FFFFFF' },
  headerSub: { ...FONT.bodySmall, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  ingredientStrip: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
    paddingVertical: SPACING.sm,
  },
  ingredientChips: { paddingHorizontal: SPACING.xl, gap: SPACING.sm },
  ingredientChip: {
    backgroundColor: COLORS.primaryFaint,
    borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    borderWidth: 1, borderColor: COLORS.primaryPale,
  },
  ingredientChipText: { ...FONT.bodySmallMedium, color: COLORS.primary },

  list: { padding: SPACING.xl, gap: SPACING.lg, paddingBottom: 30 },
  recipeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  cardHero: { height: 150, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 64 },
  heartBtn: {
    position: 'absolute', top: SPACING.md, right: SPACING.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.sm,
  },
  heartBtnActive: { backgroundColor: '#DB2777' },
  cardBody: { padding: SPACING.lg, gap: SPACING.md },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...FONT.h4, color: COLORS.text, flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { ...FONT.bodySmallMedium, color: COLORS.text },
  cardDesc: { ...FONT.bodySmall, color: COLORS.textSecondary, lineHeight: 20 },

  matchBar: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  matchBg: { flex: 1, height: 6, backgroundColor: COLORS.surface2, borderRadius: 3, overflow: 'hidden' },
  matchFill: { height: '100%', borderRadius: 3 },
  matchLabel: { ...FONT.captionMedium, minWidth: 60, textAlign: 'right' },

  macrosRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.md, padding: SPACING.sm,
  },
  macroItem: { flex: 1, alignItems: 'center', gap: 2 },
  macroValue: { ...FONT.bodySemiBold, color: COLORS.text, fontSize: 14 },
  macroLabel: { ...FONT.caption, color: COLORS.textTertiary },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.surface2, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm, paddingVertical: 4,
  },
  metaText: { ...FONT.caption, color: COLORS.textTertiary },
  diffText: { fontSize: 11, fontWeight: '600' },
  missingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accentFaint, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm, paddingVertical: 4,
  },
  missingText: { ...FONT.caption, color: COLORS.accent },

  viewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.xs, backgroundColor: COLORS.primaryFaint,
    borderRadius: RADIUS.lg, paddingVertical: SPACING.md,
    borderWidth: 1.5, borderColor: COLORS.primaryPale,
  },
  viewBtnText: { ...FONT.bodySemiBold, color: COLORS.primary },

  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.xxl,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { ...FONT.h4, color: COLORS.text },
  emptySub: { ...FONT.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },
  tryAgainBtn: { marginTop: SPACING.md },
  tryAgainText: { ...FONT.bodyMedium, color: COLORS.primary },
});
