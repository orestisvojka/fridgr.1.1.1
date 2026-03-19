// src/screens/recipe/DetailScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

function MacroCard({ label, value, unit, color, bg }) {
  return (
    <View style={[styles.macroCard, { backgroundColor: bg }]}>
      <Text style={[styles.macroValue, { color }]}>{value}</Text>
      <Text style={styles.macroUnit}>{unit}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

function Step({ number, text }) {
  const [done, setDone] = useState(false);
  return (
    <TouchableOpacity style={[styles.step, done && styles.stepDone]} onPress={() => setDone(v => !v)} activeOpacity={0.7}>
      <View style={[styles.stepNum, done && styles.stepNumDone]}>
        {done
          ? <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          : <Text style={styles.stepNumText}>{number}</Text>
        }
      </View>
      <Text style={[styles.stepText, done && styles.stepTextDone]}>{text}</Text>
    </TouchableOpacity>
  );
}

export default function DetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { recipe } = route.params ?? {};
  const { toggleSave, isSaved } = useRecipes();

  const saved = recipe ? isSaved(recipe.id) : false;
  const palette = COLORS.recipePalettes[parseInt((recipe?.id ?? 'r0').replace('r', ''), 10) % COLORS.recipePalettes.length];

  const scrollY  = useRef(new Animated.Value(0)).current;
  const headerOp = scrollY.interpolate({ inputRange: [80, 160], outputRange: [0, 1], extrapolate: 'clamp' });
  const heroScale = scrollY.interpolate({ inputRange: [-100, 0], outputRange: [1.15, 1], extrapolate: 'clamp' });

  if (!recipe) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorText}>Recipe not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.errorBack}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating header (appears on scroll) */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOp, paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity style={styles.floatBack} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.floatTitle} numberOfLines={1}>{recipe.title}</Text>
        <TouchableOpacity style={[styles.floatHeart, saved && styles.floatHeartActive]} onPress={() => toggleSave(recipe)}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={saved ? '#FFFFFF' : COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, { backgroundColor: palette.light, transform: [{ scale: heroScale }] }]}>
          <Text style={styles.heroEmoji}>{recipe.emoji}</Text>
          {/* Nav overlays */}
          <TouchableOpacity
            style={[styles.navBtn, { top: insets.top + SPACING.md, left: SPACING.lg }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnHeart, { top: insets.top + SPACING.md, right: SPACING.lg }, saved && styles.navBtnHeartActive]}
            onPress={() => toggleSave(recipe)}
          >
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#FFFFFF' : COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Card */}
        <View style={styles.card}>
          {/* Title block */}
          <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{recipe.title}</Text>
            </View>
            <Text style={styles.desc}>{recipe.description}</Text>

            {/* Meta pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pills}>
              {[
                { icon: 'time-outline', label: `${recipe.prepTime} min` },
                { icon: 'people-outline', label: `${recipe.servings} servings` },
                { icon: 'star', label: `${recipe.rating}` },
                { icon: 'restaurant-outline', label: recipe.cuisine },
              ].map((p, i) => (
                <View key={i} style={styles.pill}>
                  <Ionicons name={p.icon} size={13} color={COLORS.primary} />
                  <Text style={styles.pillText}>{p.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Nutrition */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutrition per serving</Text>
            <View style={styles.macrosGrid}>
              <MacroCard label="Calories" value={recipe.calories} unit="kcal" color="#EA580C" bg="#FFF7ED" />
              <MacroCard label="Protein"  value={recipe.macros.protein}  unit="g" color={COLORS.primary} bg={COLORS.primaryFaint} />
              <MacroCard label="Carbs"    value={recipe.macros.carbs}    unit="g" color="#D97706" bg="#FFFBEB" />
              <MacroCard label="Fat"      value={recipe.macros.fat}      unit="g" color="#0284C7" bg="#F0F9FF" />
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, i) => (
                <View key={i} style={styles.ingredientRow}>
                  <View style={styles.ingredientDot} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.steps}>
              {recipe.instructions.map((step, i) => (
                <Step key={i} number={i + 1} text={step} />
              ))}
            </View>
          </View>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <View style={[styles.section, { paddingBottom: 0 }]}>
              <View style={styles.tags}>
                {recipe.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Save button */}
      <View style={[styles.saveBtnWrap, { paddingBottom: insets.bottom + SPACING.sm }]}>
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSaved]}
          onPress={() => toggleSave(recipe)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={saved ? ['#DB2777', '#BE185D'] : ['#16A34A', '#15803D']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.saveBtnGradient}
          >
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>{saved ? 'Saved to Favorites' : 'Save Recipe'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  errorText: { ...FONT.h4, color: COLORS.text },
  errorBack: { ...FONT.bodyMedium, color: COLORS.primary },

  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  floatBack: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  floatTitle: { ...FONT.h5, color: COLORS.text, flex: 1 },
  floatHeart: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primaryFaint,
    alignItems: 'center', justifyContent: 'center',
  },
  floatHeartActive: { backgroundColor: '#DB2777' },

  hero: {
    height: 260,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  heroEmoji: { fontSize: 90 },
  navBtn: {
    position: 'absolute',
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.sm,
  },
  navBtnHeart: { backgroundColor: 'rgba(255,255,255,0.85)' },
  navBtnHeartActive: { backgroundColor: '#DB2777' },

  card: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -RADIUS.xxl,
    paddingTop: SPACING.xxl,
    minHeight: 600,
  },

  titleBlock: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  title: { ...FONT.h2, color: COLORS.text, flex: 1 },
  desc: { ...FONT.body, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.md },
  pills: { marginTop: SPACING.xs },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    backgroundColor: COLORS.primaryFaint, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
    marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.primaryPale,
  },
  pillText: { ...FONT.bodySmallMedium, color: COLORS.primary },

  section: {
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.xs,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
  },
  sectionTitle: { ...FONT.h4, color: COLORS.text, marginBottom: SPACING.md },

  macrosGrid: { flexDirection: 'row', gap: SPACING.sm },
  macroCard: {
    flex: 1, borderRadius: RADIUS.lg, padding: SPACING.md,
    alignItems: 'center', gap: 2,
  },
  macroValue: { ...FONT.h4, fontSize: 20 },
  macroUnit: { ...FONT.caption, color: COLORS.textTertiary },
  macroLabel: { ...FONT.captionMedium, color: COLORS.textSecondary, textAlign: 'center' },

  ingredientsList: { gap: SPACING.sm },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  ingredientDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  ingredientText: { ...FONT.body, color: COLORS.text, flex: 1 },

  steps: { gap: SPACING.sm },
  step: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md,
    backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  stepDone: { backgroundColor: COLORS.primaryFaint, borderColor: COLORS.primaryPale },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumDone: { backgroundColor: COLORS.primary },
  stepNumText: { ...FONT.bodySmallMedium, color: '#FFFFFF' },
  stepText: { ...FONT.body, color: COLORS.text, flex: 1, lineHeight: 22 },
  stepTextDone: { color: COLORS.textTertiary, textDecorationLine: 'line-through' },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingVertical: SPACING.md },
  tag: {
    backgroundColor: COLORS.surface2, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
  },
  tagText: { ...FONT.bodySmall, color: COLORS.textSecondary },

  saveBtnWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  saveBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.green },
  saveBtnSaved: { ...SHADOWS.accent },
  saveBtnGradient: {
    height: 54, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
  },
  saveBtnText: { ...FONT.h5, color: '#FFFFFF' },
});
