import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  ChevronRight,
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
    headerTitle: { ...FONT.h2, color: C.text, textAlign: 'center' },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      marginHorizontal: SPACING.xl,
      marginTop: SPACING.xl,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    searchIcon: { marginRight: SPACING.md },
    searchInput: { flex: 1, fontSize: 15, fontWeight: '400', textAlignVertical: 'center', paddingVertical: 0, color: C.text },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.primary,
      marginLeft: SPACING.md,
      ...SHADOWS.sm,
    },
    categorySection: { marginTop: SPACING.xl },
    categoryTitle: {
      ...FONT.h4,
      color: C.text,
      marginHorizontal: SPACING.xl,
      marginBottom: SPACING.md,
    },
    mealCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      marginHorizontal: SPACING.xl,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    mealHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
    mealTitle: { ...FONT.h4, color: C.text, flex: 1 },
    mealRating: { flexDirection: 'row', alignItems: 'center' },
    mealRatingText: { ...FONT.caption, color: C.textSecondary, marginLeft: 2 },
    mealImage: {
      height: 120,
      backgroundColor: C.primaryPale,
      borderRadius: RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: C.border,
    },
    mealPlaceholder: { fontSize: 32, color: C.primary },
    mealMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    mealMetaItem: { flexDirection: 'row', alignItems: 'center' },
    mealMetaText: { ...FONT.caption, color: C.textSecondary, marginLeft: 4 },
    mealCalories: { ...FONT.bodySemiBold, color: C.primary },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.sm,
      marginTop: SPACING.md,
    },
    seeAllText: { ...FONT.body, color: C.primary, marginRight: SPACING.sm },
  });
}

function MealCard({ meal, onPress, styles, C }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.mealCard, pressed && { opacity: 0.9 }]}
      onPress={onPress}
    >
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{meal.title}</Text>
        <View style={styles.mealRating}>
          <Star size={14} color={C.accent} fill={C.accent} strokeWidth={ICON_STROKE} />
          <Text style={styles.mealRatingText}>{meal.rating}</Text>
        </View>
      </View>

      <View style={styles.mealImage} />

      <View style={styles.mealMeta}>
        <View style={styles.mealMetaItem}>
          <Clock size={14} color={C.textSecondary} strokeWidth={ICON_STROKE} />
          <Text style={styles.mealMetaText}>{meal.time} min</Text>
        </View>
        <View style={styles.mealMetaItem}>
          <Users size={14} color={C.textSecondary} strokeWidth={ICON_STROKE} />
          <Text style={styles.mealMetaText}>{meal.servings} servings</Text>
        </View>
        <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
      </View>
    </Pressable>
  );
}

function CategorySection({ title, meals, onMealPress, onSeeAllPress, styles, C }) {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{title}</Text>
      {meals.slice(0, 3).map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onPress={() => onMealPress(meal)}
          styles={styles}
          C={C}
        />
      ))}
      {meals.length > 3 && (
        <Pressable
          style={({ pressed }) => [styles.seeAllButton, pressed && { opacity: 0.8 }]}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAllText}>See all {meals.length} meals</Text>
          <ChevronRight size={16} color={C.primary} strokeWidth={ICON_STROKE} />
        </Pressable>
      )}
    </View>
  );
}

export default function FoodListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = createStyles(C);

  // Mock data - in real app, this would come from API/context
  const categories = [
    {
      id: 'breakfast',
      title: 'Breakfast',
      meals: [
        {
          id: 1,
          title: 'Avocado Toast',
          emoji: '🥑',
          rating: 4.8,
          time: 10,
          servings: 1,
          calories: 280,
        },
        {
          id: 2,
          title: 'Greek Yogurt Bowl',
          emoji: '🥣',
          rating: 4.6,
          time: 5,
          servings: 1,
          calories: 220,
        },
        {
          id: 3,
          title: 'Smoothie Bowl',
          emoji: '🍓',
          rating: 4.7,
          time: 15,
          servings: 1,
          calories: 320,
        },
        {
          id: 4,
          title: 'Oatmeal with Berries',
          emoji: '🥤',
          rating: 4.5,
          time: 8,
          servings: 1,
          calories: 250,
        },
      ],
    },
    {
      id: 'lunch',
      title: 'Lunch',
      meals: [
        {
          id: 5,
          title: 'Grilled Chicken Salad',
          emoji: '🥗',
          rating: 4.9,
          time: 20,
          servings: 1,
          calories: 320,
        },
        {
          id: 6,
          title: 'Quinoa Buddha Bowl',
          emoji: '🍚',
          rating: 4.7,
          time: 25,
          servings: 1,
          calories: 380,
        },
        {
          id: 7,
          title: 'Turkey Wrap',
          emoji: '🌯',
          rating: 4.4,
          time: 15,
          servings: 1,
          calories: 290,
        },
        {
          id: 8,
          title: 'Lentil Soup',
          emoji: '🍲',
          rating: 4.6,
          time: 30,
          servings: 2,
          calories: 240,
        },
      ],
    },
    {
      id: 'dinner',
      title: 'Dinner',
      meals: [
        {
          id: 9,
          title: 'Baked Salmon',
          emoji: '🐟',
          rating: 4.8,
          time: 25,
          servings: 1,
          calories: 350,
        },
        {
          id: 10,
          title: 'Stir-Fry Vegetables',
          emoji: '🥦',
          rating: 4.5,
          time: 20,
          servings: 2,
          calories: 180,
        },
        {
          id: 11,
          title: 'Grilled Steak',
          emoji: '🥩',
          rating: 4.7,
          time: 15,
          servings: 1,
          calories: 420,
        },
        {
          id: 12,
          title: 'Pasta Primavera',
          emoji: '🍝',
          rating: 4.6,
          time: 30,
          servings: 2,
          calories: 380,
        },
      ],
    },
  ];

  const handleMealPress = (meal) => {
    navigation.navigate('MealDetail', { meal });
  };

  const handleSeeAllPress = (category) => {
    // In real app, navigate to category-specific list
    console.log('See all meals in category:', category);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xl }]}>
        <Text style={styles.headerTitle}>Food Library</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxl }}>
        <Pressable
          style={({ pressed }) => [styles.searchBar, pressed && { opacity: 0.9 }]}
          onPress={() => {}}
        >
          <Search size={20} color={C.textSecondary} strokeWidth={ICON_STROKE} style={styles.searchIcon} />
          <Text style={styles.searchInput}>Search meals...</Text>
          <Pressable
            style={({ pressed }) => [styles.filterButton, pressed && { opacity: 0.9 }]}
            onPress={() => {}}
          >
            <Filter size={16} color={C.white} strokeWidth={ICON_STROKE} />
          </Pressable>
        </Pressable>

        {categories.map((category) => (
          <CategorySection
            key={category.id}
            title={category.title}
            meals={category.meals}
            onMealPress={handleMealPress}
            onSeeAllPress={() => handleSeeAllPress(category)}
            styles={styles}
            C={C}
          />
        ))}
      </ScrollView>
    </View>
  );
}