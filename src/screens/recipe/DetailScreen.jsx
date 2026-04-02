// src/screens/recipe/DetailScreen.jsx
import React, { useState, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Heart,
  Check,
  Clock,
  Users,
  Star,
  UtensilsCrossed,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { useThemeColors } from '../../context/ThemeContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

function MacroCard({ label, value, unit, color, bg, styles }) {
  return (
    <View style={[styles.macroCard, { backgroundColor: bg }]}>
      <Text style={[styles.macroValue, { color }]}>{value}</Text>
      <Text style={styles.macroUnit}>{unit}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
    errorText: { ...FONT.h4, color: C.text },
    errorBack: { ...FONT.bodyMedium, color: C.primary },
    floatingHeader: {
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
      backgroundColor: C.surface,
      borderBottomWidth: 1, borderBottomColor: C.borderLight,
      gap: SPACING.md,
      ...SHADOWS.sm,
    },
    floatBack: {
      width: 44, height: 44, borderRadius: RADIUS.md,
      backgroundColor: C.surface2,
      alignItems: 'center', justifyContent: 'center',
    },
    floatTitle: { ...FONT.h5, color: C.text, flex: 1, fontSize: 13 },
    floatHeart: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: C.primaryFaint,
      alignItems: 'center', justifyContent: 'center',
    },
    floatHeartActive: { backgroundColor: C.primary },
    hero: {
      height: 260,
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    },
    navBtn: {
      position: 'absolute',
      width: 44, height: 44, borderRadius: RADIUS.md,
      backgroundColor: 'rgba(255,255,255,0.85)',
      alignItems: 'center', justifyContent: 'center',
      ...SHADOWS.sm,
    },
    navBtnHeartActive: { backgroundColor: C.primary },
    card: {
      backgroundColor: C.surface,
      borderTopLeftRadius: RADIUS.xxl,
      borderTopRightRadius: RADIUS.xxl,
      marginTop: -RADIUS.xxl,
      paddingTop: SPACING.xxl,
      minHeight: 600,
    },
    titleBlock: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
    title: { ...FONT.h2, color: C.text, flex: 1 },
    desc: { ...FONT.body, color: C.textSecondary, lineHeight: 24, marginBottom: SPACING.md },
    pills: { marginTop: SPACING.xs },
    pill: {
      flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
      backgroundColor: C.primaryFaint, borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
      marginRight: SPACING.sm, borderWidth: 1, borderColor: C.primaryPale,
    },
    pillText: { ...FONT.bodySmallMedium, color: C.primary },
    section: {
      paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.xs,
      borderTopWidth: 1, borderTopColor: C.borderLight,
    },
    sectionTitle: { ...FONT.h4, color: C.text, marginBottom: SPACING.md },
    macrosGrid: { flexDirection: 'row', gap: SPACING.sm },
    macroCard: {
      flex: 1, borderRadius: RADIUS.lg, padding: SPACING.md,
      alignItems: 'center', gap: 2,
    },
    macroValue: { ...FONT.h4, fontSize: 20 },
    macroUnit: { ...FONT.caption, color: C.textTertiary },
    macroLabel: { ...FONT.captionMedium, color: C.textSecondary, textAlign: 'center' },
    ingredientsList: { gap: SPACING.sm },
    ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    ingredientDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
    ingredientText: { ...FONT.body, color: C.text, flex: 1 },
    steps: { gap: SPACING.sm },
    step: {
      flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md,
      backgroundColor: C.background, borderRadius: RADIUS.lg, padding: SPACING.md,
      borderWidth: 1, borderColor: C.borderLight,
    },
    stepDone: { backgroundColor: C.primaryFaint, borderColor: C.primaryPale },
    stepNum: {
      width: 28, height: 28, borderRadius: 14,
      backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },
    stepNumDone: { backgroundColor: C.primary },
    stepNumText: { ...FONT.bodySmallMedium, color: '#FFFFFF' },
    stepText: { ...FONT.body, color: C.text, flex: 1, lineHeight: 22 },
    stepTextDone: { color: C.textTertiary, textDecorationLine: 'line-through' },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingVertical: SPACING.md },
    tag: {
      backgroundColor: C.surface2, borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    },
    tagText: { ...FONT.bodySmall, color: C.textSecondary },
    saveBtnWrap: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
      backgroundColor: C.surface,
      borderTopWidth: 1, borderTopColor: C.borderLight,
      ...SHADOWS.md,
    },
    saveBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.green },
    saveBtnSaved: { ...SHADOWS.accent },
    saveBtnGradient: {
      height: 54, flexDirection: 'row',
      alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    },
    saveBtnText: { ...FONT.h5, color: '#FFFFFF' },
    saveBtnTextOnAccent: { color: '#1F2937' },
  });
}

const PILL_ICONS = [Clock, Users, Star, UtensilsCrossed];

function Step({ number, text, styles }) {
  const [done, setDone] = useState(false);
  return (
    <Pressable
      style={({ pressed }) => [styles.step, done && styles.stepDone, pressed && Platform.OS === 'ios' && { opacity: 0.92 }, { overflow: 'hidden' }]}
      onPress={() => setDone(v => !v)}
      android_ripple={{ color: 'rgba(62,107,80,0.06)' }}
    >
      <View style={[styles.stepNum, done && styles.stepNumDone]}>
        {done
          ? <Check size={14} color="#FFFFFF" strokeWidth={ICON_STROKE + 0.5} />
          : <Text style={styles.stepNumText}>{number}</Text>}
      </View>
      <Text style={[styles.stepText, done && styles.stepTextDone]}>{text}</Text>
    </Pressable>
  );
}

export default function DetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const { recipe } = route.params ?? {};
  const { toggleSave, isSaved } = useRecipes();

  const saved = recipe ? isSaved(recipe.id) : false;

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOp = scrollY.interpolate({ inputRange: [80, 160], outputRange: [0, 1], extrapolate: 'clamp' });
  const heroScale = scrollY.interpolate({ inputRange: [-100, 0], outputRange: [1.15, 1], extrapolate: 'clamp' });

  if (!recipe) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorText}>Recipe not found.</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.errorBack}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const pillData = [
    { Icon: PILL_ICONS[0], label: `${recipe.prepTime} min` },
    { Icon: PILL_ICONS[1], label: `${recipe.servings} servings` },
    { Icon: PILL_ICONS[2], label: `${recipe.rating}` },
    { Icon: PILL_ICONS[3], label: recipe.cuisine },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.floatingHeader, { opacity: headerOp, paddingTop: insets.top + SPACING.sm }]}>
        <Pressable 
          style={({ pressed }) => [styles.floatBack, pressed && Platform.OS === 'ios' && { opacity: 0.8 }, { overflow: 'hidden' }]} 
          onPress={() => navigation.goBack()}
          android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true, radius: 22 }}
        >
          <ArrowLeft size={20} color={C.text} strokeWidth={ICON_STROKE} />
        </Pressable>
        <Text style={styles.floatTitle} numberOfLines={1}>{recipe.title}</Text>
        <Pressable
          style={({ pressed }) => [styles.floatHeart, saved && styles.floatHeartActive, pressed && Platform.OS === 'ios' && { opacity: 0.85 }, { overflow: 'hidden' }]}
          onPress={() => toggleSave(recipe)}
          android_ripple={{ color: saved ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)', borderless: true, radius: 22 }}
        >
          <Heart size={18} color={saved ? '#FFFFFF' : C.primary} fill={saved ? '#FFFFFF' : 'transparent'} strokeWidth={ICON_STROKE} />
        </Pressable>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.hero, { transform: [{ scale: heroScale }] }]}>
          <RecipeImage recipe={recipe} height={260} borderRadius={0} style={{ width: '100%' }} />
          <Pressable
            style={({ pressed }) => [styles.navBtn, { top: insets.top + SPACING.md, left: SPACING.lg }, { overflow: 'hidden' }]}
            onPress={() => navigation.goBack()}
            android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true, radius: 22 }}
          >
            <ArrowLeft size={20} color={C.text} strokeWidth={ICON_STROKE} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.navBtn,
              { top: insets.top + SPACING.md, right: SPACING.lg },
              saved && styles.navBtnHeartActive,
              pressed && Platform.OS === 'ios' && { opacity: 0.9 },
              { overflow: 'hidden' }
            ]}
            onPress={() => toggleSave(recipe)}
            android_ripple={{ color: saved ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)', borderless: true, radius: 22 }}
          >
            <Heart size={20} color={saved ? '#FFFFFF' : C.primary} fill={saved ? '#FFFFFF' : 'transparent'} strokeWidth={ICON_STROKE} />
          </Pressable>
        </Animated.View>

        <View style={styles.card}>
          <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{recipe.title}</Text>
            </View>
            <Text style={styles.desc}>{recipe.description}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pills}>
              {pillData.map((p, i) => {
                const RowIcon = p.Icon;
                return (
                  <View key={i} style={styles.pill}>
                    <RowIcon size={13} color={C.primary} strokeWidth={ICON_STROKE} />
                    <Text style={styles.pillText}>{p.label}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutrition per serving</Text>
            <View style={styles.macrosGrid}>
              <MacroCard label="Calories" value={recipe.calories} unit="kcal" color="#EA580C" bg="#FFF7ED" styles={styles} />
              <MacroCard label="Protein" value={recipe.macros.protein} unit="g" color={C.primary} bg={C.primaryFaint} styles={styles} />
              <MacroCard label="Carbs" value={recipe.macros.carbs} unit="g" color="#D97706" bg="#FFFBEB" styles={styles} />
              <MacroCard label="Fat" value={recipe.macros.fat} unit="g" color="#0284C7" bg="#F0F9FF" styles={styles} />
            </View>
          </View>

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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.steps}>
              {recipe.instructions.map((step, i) => (
                <Step key={i} number={i + 1} text={step} styles={styles} />
              ))}
            </View>
          </View>

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

      <View style={[styles.saveBtnWrap, { paddingBottom: Math.max(insets.bottom, SPACING.md) + SPACING.xs }]}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, saved && styles.saveBtnSaved, pressed && Platform.OS === 'ios' && { opacity: 0.9 }, { overflow: 'hidden' }]}
          onPress={() => toggleSave(recipe)}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
        >
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={styles.saveBtnGradient}
          >
            <UtensilsCrossed size={20} color="#FFFFFF" strokeWidth={ICON_STROKE} />
            <Text style={styles.saveBtnText}>Start Cooking</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
