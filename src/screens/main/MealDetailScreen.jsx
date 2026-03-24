import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Heart,
  Clock,
  Users,
  Apple,
  Zap,
  Droplets,
  Target,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    header: {
      backgroundColor: C.surface,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.border,
    },
    favoriteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.border,
    },
    headerTitle: { ...FONT.h2, color: C.text, flex: 1, textAlign: 'center' },
    heroImage: {
      height: 200,
      backgroundColor: C.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: SPACING.xl,
      marginTop: SPACING.xl,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    heroPlaceholder: { fontSize: 48, color: C.primary },
    nutritionCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      marginHorizontal: SPACING.xl,
      marginTop: SPACING.xl,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    nutritionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
    nutritionTitle: { ...FONT.h4, color: C.text },
    caloriesValue: { ...FONT.h3, color: C.primary },
    macroGrid: { flexDirection: 'row', gap: SPACING.md },
    macroItem: {
      flex: 1,
      alignItems: 'center',
      padding: SPACING.md,
      backgroundColor: C.surface,
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: C.border,
    },
    macroIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm,
    },
    macroValue: { ...FONT.h4, color: C.text, marginBottom: 2 },
    macroLabel: { ...FONT.caption, color: C.textSecondary },
    section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl },
    sectionTitle: { ...FONT.h4, color: C.text, marginBottom: SPACING.md },
    infoGrid: { flexDirection: 'row', gap: SPACING.md },
    infoCard: {
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    infoIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm,
    },
    infoValue: { ...FONT.bodySemiBold, color: C.text, marginBottom: 2 },
    infoLabel: { ...FONT.caption, color: C.textSecondary },
    chartPlaceholder: {
      height: 200,
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    chartText: { ...FONT.body, color: C.textSecondary },
    addButton: {
      backgroundColor: C.primary,
      borderRadius: RADIUS.xl,
      paddingVertical: SPACING.lg,
      alignItems: 'center',
      marginTop: SPACING.xxl,
      marginHorizontal: SPACING.xl,
      marginBottom: SPACING.xl,
      ...SHADOWS.md,
    },
    addButtonText: { ...FONT.bodySemiBold, color: C.white },
  });
}

function MacroItem({ icon: Icon, value, label, color, bg, styles }) {
  return (
    <View style={styles.macroItem}>
      <View style={[styles.macroIcon, { backgroundColor: bg }]}>
        <Icon size={16} color={color} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={styles.macroValue}>{value}g</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

function InfoCard({ icon: Icon, value, label, color, bg, styles }) {
  return (
    <View style={styles.infoCard}>
      <View style={[styles.infoIcon, { backgroundColor: bg }]}>
        <Icon size={14} color={color} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

export default function MealDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = createStyles(C);

  // Mock data - in real app, this would come from route params
  const meal = {
    title: 'Grilled Chicken Salad',
    calories: 320,
    protein: 35,
    carbs: 12,
    fat: 18,
    time: 15,
    servings: 1,
  };

  const macros = [
    { icon: Apple, value: meal.protein, label: 'Protein', color: C.primary, bg: C.primaryPale },
    { icon: Zap, value: meal.carbs, label: 'Carbs', color: C.accent, bg: C.accentPale },
    { icon: Droplets, value: meal.fat, label: 'Fat', color: C.primary, bg: C.primaryPale },
  ];

  const info = [
    { icon: Clock, value: `${meal.time} min`, label: 'Prep Time', color: C.primary, bg: C.primaryPale },
    { icon: Users, value: `${meal.servings}`, label: 'Servings', color: C.accent, bg: C.accentPale },
    { icon: Target, value: 'Healthy', label: 'Category', color: C.primary, bg: C.primaryPale },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxl }}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.xl }]}>
          <View style={styles.headerTop}>
            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={20} color={C.text} strokeWidth={ICON_STROKE} />
            </Pressable>
            <Text style={styles.headerTitle}>{meal.title}</Text>
            <Pressable
              style={({ pressed }) => [styles.favoriteButton, pressed && { opacity: 0.8 }]}
              onPress={() => {}}
            >
              <Heart size={20} color={C.text} strokeWidth={ICON_STROKE} />
            </Pressable>
          </View>
        </View>

        <View style={styles.heroImage}>
          <Text style={styles.heroPlaceholder}>🥗</Text>
        </View>

        <View style={styles.nutritionCard}>
          <View style={styles.nutritionHeader}>
            <Text style={styles.nutritionTitle}>Nutrition Facts</Text>
            <Text style={styles.caloriesValue}>{meal.calories} kcal</Text>
          </View>
          <View style={styles.macroGrid}>
            {macros.map((macro, index) => (
              <MacroItem key={index} {...macro} styles={styles} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Info</Text>
          <View style={styles.infoGrid}>
            {info.map((item, index) => (
              <InfoCard key={index} {...item} styles={styles} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutritional Breakdown</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>Macro distribution chart</Text>
            <Text style={styles.chartText}>Coming soon</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.9 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.addButtonText}>Add to Today's Meals</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}