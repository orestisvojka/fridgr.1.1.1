import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Search,
  Clock,
  Users,
  ChefHat,
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
    headerTitle: { ...FONT.h2, color: C.text, marginBottom: SPACING.sm },
    headerSubtitle: { ...FONT.body, color: C.textSecondary },
    section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl },
    sectionTitle: { ...FONT.h4, color: C.text, marginBottom: SPACING.md },
    searchBar: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderWidth: 1,
      borderColor: C.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      ...SHADOWS.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontWeight: '400',
      textAlignVertical: 'center',
      paddingVertical: 0,
      color: C.text,
    },
    quickAddGrid: { flexDirection: 'row', gap: SPACING.md },
    quickAddCard: {
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    quickAddIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm,
    },
    quickAddLabel: { ...FONT.bodySemiBold, color: C.text, textAlign: 'center' },
    recentMeals: { gap: SPACING.md },
    mealCard: {
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: C.border,
      ...SHADOWS.sm,
    },
    mealHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    mealTitle: { ...FONT.bodySemiBold, color: C.text },
    mealCalories: { ...FONT.bodySemiBold, color: C.primary },
    mealMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
    },
    mealMetaText: { ...FONT.caption, color: C.textSecondary },
    addButton: {
      backgroundColor: C.primary,
      borderRadius: RADIUS.xl,
      paddingVertical: SPACING.lg,
      alignItems: 'center',
      marginTop: SPACING.xxl,
      marginHorizontal: SPACING.xl,
      ...SHADOWS.md,
    },
    addButtonText: { ...FONT.bodySemiBold, color: C.white },
  });
}

function QuickAddCard({ icon: Icon, label, color, bg, onPress, styles }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.quickAddCard, pressed && { opacity: 0.9 }]}
      onPress={onPress}
    >
      <View style={[styles.quickAddIcon, { backgroundColor: bg }]}>
        <Icon size={24} color={color} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={styles.quickAddLabel}>{label}</Text>
    </Pressable>
  );
}

function MealCard({ title, calories, time, servings, onPress, styles }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.mealCard, pressed && { opacity: 0.9 }]}
      onPress={onPress}
    >
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{title}</Text>
        <Text style={styles.mealCalories}>{calories} kcal</Text>
      </View>
      <View style={styles.mealMeta}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
          <Clock size={14} color={styles.mealMetaText.color} strokeWidth={ICON_STROKE} />
          <Text style={styles.mealMetaText}>{time} min</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
          <Users size={14} color={styles.mealMetaText.color} strokeWidth={ICON_STROKE} />
          <Text style={styles.mealMetaText}>{servings} servings</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function AddMealScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = createStyles(C);
  const [searchQuery, setSearchQuery] = useState('');

  const quickAdds = [
    { icon: ChefHat, label: 'Custom Meal', color: C.primary, bg: C.primaryPale },
    { icon: Plus, label: 'Quick Add', color: C.accent, bg: C.accentPale },
  ];

  const recentMeals = [
    { title: 'Grilled Chicken Salad', calories: 320, time: 15, servings: 1 },
    { title: 'Quinoa Bowl', calories: 450, time: 20, servings: 1 },
    { title: 'Smoothie Bowl', calories: 280, time: 10, servings: 1 },
  ];

  const handleQuickAdd = (type) => {
    // Handle quick add logic
    console.log('Quick add:', type);
  };

  const handleMealSelect = (meal) => {
    // Handle meal selection
    console.log('Selected meal:', meal);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxl }}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.xl }]}>
          <Text style={styles.headerTitle}>Add Meal</Text>
          <Text style={styles.headerSubtitle}>Log your food intake</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.searchBar}>
            <Search size={20} color={C.textSecondary} strokeWidth={ICON_STROKE} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food..."
              placeholderTextColor={C.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            {quickAdds.map((item, index) => (
              <QuickAddCard
                key={index}
                {...item}
                onPress={() => handleQuickAdd(item.label)}
                styles={styles}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          <View style={styles.recentMeals}>
            {recentMeals.map((meal, index) => (
              <MealCard
                key={index}
                {...meal}
                onPress={() => handleMealSelect(meal)}
                styles={styles}
              />
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.9 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.addButtonText}>Done</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}