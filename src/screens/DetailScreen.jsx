// src/screens/DetailScreen.jsx
// Full recipe detail: hero, macros, ingredients, instructions

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MacroBadge from '../components/MacroBadge';
import ShoppingListModal from '../components/ShoppingListModal';
import PrimaryButton from '../components/PrimaryButton';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
  shadows,
  difficultyColors,
} from '../styles/theme';
import { formatPrepTime } from '../utils/helpers';
import { useRecipes } from '../context/RecipesContext';

function SectionTitle({ icon, label, color }) {
  return (
    <View style={sStyles.row}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={sStyles.label}>{label}</Text>
    </View>
  );
}

const sStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  label: { fontSize: fontSize.lg - 1, fontWeight: fontWeight.extrabold, color: colors.textPrimary, letterSpacing: -0.2 },
});

export default function DetailScreen({ route, navigation }) {
  const { recipe } = route.params || {};
  const { savedIds, toggleSave } = useRecipes();
  const [showShopping, setShowShopping] = useState(false);
  const insets = useSafeAreaInsets();

  if (!recipe) return null;

  const palette = recipe.palette || { color: colors.green, bg: colors.greenLight };
  const isSaved = savedIds.includes(recipe.id);
  const diff = difficultyColors[recipe.difficulty] || difficultyColors.Easy;

  return (
    <View style={[styles.root]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Hero */}
        <LinearGradient
          colors={[palette.color + '40', palette.bg, '#FFFFFF']}
          locations={[0, 0.5, 1]}
          style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
        >
          {/* Nav row */}
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleSave(recipe)} style={styles.navBtn} activeOpacity={0.8}>
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={20}
                color={isSaved ? palette.color : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Emoji */}

          {/* Title + meta */}
          <Text style={styles.heroTitle}>{recipe.title}</Text>
          <Text style={styles.heroDesc}>{recipe.description}</Text>

          {/* Pill row */}
          <View style={styles.pillRow}>
            <View style={[styles.pill, { backgroundColor: palette.color }]}>
              <Ionicons name="time-outline" size={12} color="#fff" />
              <Text style={[styles.pillText, { color: '#fff' }]}>{formatPrepTime(recipe.prepTime)}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: diff.bg }]}>
              <Text style={[styles.pillText, { color: diff.text }]}>{recipe.difficulty}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="star" size={11} color={colors.star} />
              <Text style={[styles.pillText, { color: colors.textSecondary }]}>{recipe.rating}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: '#F3F4F6' }]}>
              <Text style={[styles.pillText, { color: colors.textSecondary }]}>{recipe.cuisine}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Body content */}
        <View style={styles.body}>
          {/* Macros */}
          <View style={styles.section}>
            <SectionTitle icon="bar-chart-outline" label="Nutrition" color="#8B5CF6" />
            <MacroBadge
              calories={recipe.calories}
              protein={recipe.macros.protein}
              carbs={recipe.macros.carbs}
              fat={recipe.macros.fat}
              accentColor={palette.color}
            />
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <SectionTitle icon="leaf-outline" label="Ingredients" color={colors.green} />
            <View style={styles.ingredientList}>
              {recipe.ingredients.map((ing) => {
                const isMissing = recipe.missing?.includes(ing);
                return (
                  <View key={ing} style={styles.ingredientRow}>
                    <View style={[styles.ingDot, { backgroundColor: isMissing ? colors.warning : palette.color }]} />
                    <Text style={[styles.ingredientText, isMissing && styles.ingredientMissing]}>
                      {ing}
                    </Text>
                    {!isMissing && <Ionicons name="checkmark" size={14} color={colors.green} strokeWidth={3} />}
                    {isMissing && (
                      <View style={styles.missingTag}>
                        <Text style={styles.missingTagText}>missing</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Missing ingredients CTA */}
          {recipe.missing?.length > 0 && (
            <View style={[styles.section, styles.missingCard]}>
              <View style={styles.missingHeader}>
                <Ionicons name="cart-outline" size={18} color="#D97706" />
                <Text style={styles.missingTitle}>
                  {recipe.missing.length} ingredient{recipe.missing.length > 1 ? 's' : ''} to buy
                </Text>
              </View>
              <Text style={styles.missingSubtitle}>
                {recipe.missing.join(', ')}
              </Text>
              <PrimaryButton
                label="Open Shopping List"
                icon="cart-outline"
                full
                color="#D97706"
                onPress={() => setShowShopping(true)}
                style={{ marginTop: spacing.md }}
              />
            </View>
          )}

          {/* Instructions */}
          <View style={styles.section}>
            <SectionTitle icon="restaurant-outline" label="Instructions" color={palette.color} />
            <View style={styles.stepList}>
              {recipe.instructions.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={[styles.stepNumber, { backgroundColor: palette.color }]}>
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating save button */}
      <View style={[styles.floatingBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <PrimaryButton
          label={isSaved ? 'Saved ♥' : 'Save Recipe'}
          icon={isSaved ? 'heart' : 'heart-outline'}
          full
          size="lg"
          color={isSaved ? '#D1D5DB' : palette.color}
          onPress={() => toggleSave(recipe)}
        />
      </View>

      <ShoppingListModal
        visible={showShopping}
        recipe={recipe}
        onClose={() => setShowShopping(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hero: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md - 2,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  heroEmoji: {
    fontSize: 72,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: fontSize.xxl + 2,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm - 2,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radius.pill,
  },
  pillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  body: {
    padding: spacing.xl,
    gap: spacing.xxl,
    marginTop: -spacing.xl,
    backgroundColor: '#fff',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    ...shadows.sm,
  },
  section: {},
  ingredientList: {
    gap: spacing.sm - 2,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgCardAlt,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    paddingHorizontal: spacing.md,
  },
  ingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  ingredientText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    textTransform: 'capitalize',
    fontWeight: fontWeight.medium,
  },
  ingredientMissing: {
    color: colors.textSecondary,
  },
  missingTag: {
    backgroundColor: colors.warningBg,
    borderRadius: radius.sm,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
  },
  missingTagText: {
    fontSize: fontSize.xs - 1,
    fontWeight: fontWeight.bold,
    color: '#D97706',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  missingCard: {
    backgroundColor: colors.warningBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  missingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  missingTitle: {
    fontSize: fontSize.lg - 1,
    fontWeight: fontWeight.extrabold,
    color: '#92400E',
  },
  missingSubtitle: {
    fontSize: fontSize.sm + 1,
    color: colors.warningText,
    textTransform: 'capitalize',
    marginTop: spacing.xs,
    lineHeight: 19,
  },
  stepList: {
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.extrabold,
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: fontSize.md - 1,
    color: colors.textSecondary,
    lineHeight: 22,
    paddingTop: 4,
  },
  floatingBar: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.sm,
  },
});
