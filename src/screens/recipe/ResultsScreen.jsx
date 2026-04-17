// src/screens/recipe/ResultsScreen.jsx
import React, { useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, Animated, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { useThemeColors } from '../../context/ThemeContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import {
  PREMIUM_HERO_COMPACT,
  PREMIUM_HERO_COMPACT_END,
  PREMIUM_HERO_COMPACT_START,
} from '../../constants/premiumScreenTheme';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl,
      gap: SPACING.md,
    },
    backBtn: {
      width: 44, height: 44, borderRadius: RADIUS.md,
      backgroundColor: 'rgba(255,255,255,0.12)',
      alignItems: 'center', justifyContent: 'center',
    },
    headerTextWrap: { flex: 1 },
    headerTitle: { ...FONT.h3, color: '#FFFFFF' },
    headerSub: { ...FONT.bodySmall, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
    ingredientStrip: {
      backgroundColor: C.surface,
      borderBottomWidth: 1, borderBottomColor: C.borderLight,
      paddingVertical: SPACING.sm,
    },
    ingredientChips: { paddingHorizontal: SPACING.xl, gap: SPACING.sm },
    ingredientChip: {
      backgroundColor: C.primaryFaint,
      borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
      borderWidth: 1, borderColor: C.primaryPale,
    },
    ingredientChipText: { ...FONT.bodySmallMedium, color: C.primary },
    list: { padding: SPACING.xl, gap: SPACING.lg, paddingBottom: 30 },
    recipeCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.xxl,
      overflow: 'hidden',
      borderWidth: 1, borderColor: C.borderLight,
      ...SHADOWS.md,
    },
    cardHero: { height: 160, position: 'relative' },
    heartBtn: {
      position: 'absolute', top: SPACING.md, right: SPACING.md,
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: C.surface,
      alignItems: 'center', justifyContent: 'center',
      ...SHADOWS.sm,
    },
    heartBtnActive: { backgroundColor: C.primary },
    cardBody: { padding: SPACING.lg, gap: SPACING.md },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { ...FONT.h4, color: C.text, flex: 1 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    ratingText: { ...FONT.bodySmallMedium, color: C.text },
    cardDesc: { ...FONT.bodySmall, color: C.textSecondary, lineHeight: 20 },
    matchBar: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    matchBg: { flex: 1, height: 6, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' },
    matchFill: { height: '100%', borderRadius: 3 },
    matchLabel: { ...FONT.captionMedium, minWidth: 60, textAlign: 'right' },
    macrosRow: {
      flexDirection: 'row', backgroundColor: C.surface2,
      borderRadius: RADIUS.md, padding: SPACING.sm,
    },
    macroItem: { flex: 1, alignItems: 'center', gap: 2 },
    macroValue: { ...FONT.bodySemiBold, color: C.text, fontSize: 14 },
    macroLabel: { ...FONT.caption, color: C.textTertiary },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
    metaPill: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: C.surface2, borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm, paddingVertical: 4,
    },
    metaText: { ...FONT.caption, color: C.textTertiary },
    diffText: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400' },
    missingPill: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: C.accentFaint, borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm, paddingVertical: 4,
    },
    missingText: { ...FONT.caption, color: C.accent },
    viewBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: SPACING.xs, backgroundColor: C.primaryFaint,
      borderRadius: RADIUS.lg, height: 48,
      borderWidth: 1.5, borderColor: C.primaryPale,
    },
    viewBtnText: { ...FONT.bodySemiBold, color: C.primary, fontSize: 13 },
    emptyState: {
      flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md,
      paddingHorizontal: SPACING.xxl,
    },
    emptyEmoji: { fontSize: 56 },
    emptyTitle: { ...FONT.h4, color: C.text },
    emptySub: { ...FONT.body, color: C.textSecondary, textAlign: 'center', lineHeight: 24 },
    tryAgainBtn: { marginTop: SPACING.md },
    tryAgainText: { ...FONT.bodyMedium, color: C.primary },
  });
}

function MatchBar({ score, styles, C }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? C.primary : pct >= 50 ? C.accent : C.error;
  return (
    <View style={styles.matchBar}>
      <View style={styles.matchBg}>
        <View style={[styles.matchFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.matchLabel, { color }]}>{pct}% match</Text>
    </View>
  );
}

function RecipeResultCard({ item, index, navigation, styles, C }) {
  const { toggleSave, isSaved } = useRecipes();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const saved = isSaved(item.recipe.id);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const diffBg =
    item.recipe.difficulty === 'Easy' ? C.primaryFaint
      : item.recipe.difficulty === 'Medium' ? C.accentFaint
        : C.errorLight;
  const diffColor =
    item.recipe.difficulty === 'Easy' ? C.primary
      : item.recipe.difficulty === 'Medium' ? C.accent
        : C.error;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <Pressable
        style={({ pressed }) => [styles.recipeCard, pressed && { opacity: 0.95 }]}
        onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item.recipe })}
      >
        <View style={styles.cardHero}>
          <RecipeImage recipe={item.recipe} height={160} borderRadius={0} style={{ width: '100%' }} />
          <Pressable
            style={({ pressed }) => [styles.heartBtn, saved && styles.heartBtnActive, pressed && Platform.OS === 'ios' && { opacity: 0.85 }, { overflow: 'hidden' }]}
            onPress={() => toggleSave(item.recipe)}
            android_ripple={{ color: saved ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)' }}
          >
            <Heart
              size={20}
              color={saved ? '#FFFFFF' : C.primary}
              fill={saved ? '#FFFFFF' : 'transparent'}
              strokeWidth={ICON_STROKE}
            />
          </Pressable>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.recipe.title}</Text>
            <View style={styles.ratingRow}>
              <Star size={12} color={C.star} fill={C.star} strokeWidth={0} />
              <Text style={styles.ratingText}>{item.recipe.rating}</Text>
            </View>
          </View>

          <Text style={styles.cardDesc} numberOfLines={2}>{item.recipe.description}</Text>

          <MatchBar score={item.matchScore} styles={styles} C={C} />

          <View style={styles.macrosRow}>
            {[
              { label: 'Cal', value: item.recipe.calories },
              { label: 'Pro', value: `${item.recipe.macros.protein}g` },
              { label: 'Carbs', value: `${item.recipe.macros.carbs}g` },
              { label: 'Fat', value: `${item.recipe.macros.fat}g` },
            ].map(m => (
              <View key={m.label} style={styles.macroItem}>
                <Text style={styles.macroValue}>{m.value}</Text>
                <Text style={styles.macroLabel}>{m.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Clock size={12} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={styles.metaText}>{item.recipe.prepTime} min</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: diffBg }]}>
              <Text style={[styles.diffText, { color: diffColor }]}>{item.recipe.difficulty}</Text>
            </View>
            {item.missingIngredients.length > 0 && (
              <View style={styles.missingPill}>
                <AlertCircle size={12} color={C.accent} strokeWidth={ICON_STROKE} />
                <Text style={styles.missingText}>
                  {item.missingIngredients.length} missing
                </Text>
              </View>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [styles.viewBtn, pressed && Platform.OS === 'ios' && { opacity: 0.88 }, { overflow: 'hidden' }]}
            onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item.recipe })}
            android_ripple={{ color: 'rgba(62,107,80,0.08)' }}
          >
            <Text style={styles.viewBtnText}>View Recipe</Text>
            <ArrowRight size={16} color={C.primary} strokeWidth={ICON_STROKE} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ResultsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { ingredients = [], results = [] } = route.params ?? {};

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={PREMIUM_HERO_COMPACT}
        start={PREMIUM_HERO_COMPACT_START}
        end={PREMIUM_HERO_COMPACT_END}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && Platform.OS === 'ios' && { opacity: 0.8 }, { overflow: 'hidden' }]}
          onPress={() => navigation.goBack()}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true, radius: 22 }}
        >
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={ICON_STROKE} />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>
            {results.length} Recipe{results.length !== 1 ? 's' : ''} Found
          </Text>
          <Text style={styles.headerSub}>Based on {ingredients.length} ingredients</Text>
        </View>
      </LinearGradient>

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

      {results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🥺</Text>
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptySub}>Try adding more ingredients or changing your filters</Text>
          <Pressable style={styles.tryAgainBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.tryAgainText}>← Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.recipe.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RecipeResultCard item={item} index={index} navigation={navigation} styles={styles} C={C} />
          )}
        />
      )}
    </View>
  );
}
