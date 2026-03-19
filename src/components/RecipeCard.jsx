// src/components/RecipeCard.jsx
// Full recipe card shown in results and browse lists

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
  shadows,
  difficultyColors,
} from '../styles/theme';
import MacroBadge from './MacroBadge';
import PrimaryButton from './PrimaryButton';
import { formatPrepTime } from '../utils/helpers';

export default function RecipeCard({
  recipe,
  isSaved = false,
  onPress,
  onSave,
  onShoppingList,
  style,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const { palette = { color: colors.green, bg: colors.greenLight } } = recipe;
  const diff = difficultyColors[recipe.difficulty] || difficultyColors.Easy;
  const missingCount = recipe.missing?.length || 0;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[styles.card, shadows.md, { backgroundColor: palette.bg }]}
      >
        {/* Emoji hero */}
        <View style={[styles.emojiWrap, { backgroundColor: palette.color + '18' }]}>
          <Text style={styles.emoji}>{recipe.emoji}</Text>

          {/* Save button */}
          <TouchableOpacity
            onPress={() => onSave?.(recipe)}
            style={[styles.saveBtn, { backgroundColor: isSaved ? palette.color + '20' : '#fff' }]}
            activeOpacity={0.75}
          >
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={18}
              color={isSaved ? palette.color : '#D1D5DB'}
            />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Title + rating row */}
          <View style={styles.titleRow}>
            <View style={styles.titleGroup}>
              <Text style={styles.title}>{recipe.title}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={11} color={colors.star} />
                <Text style={styles.ratingText}>{recipe.rating}</Text>
                <Text style={styles.cuisine}> · {recipe.cuisine}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.desc} numberOfLines={2}>{recipe.description}</Text>

          {/* Pill row */}
          <View style={styles.pillRow}>
            <View style={[styles.pill, { backgroundColor: palette.color + '18' }]}>
              <Ionicons name="time-outline" size={11} color={palette.color} />
              <Text style={[styles.pillText, { color: palette.color }]}>
                {formatPrepTime(recipe.prepTime)}
              </Text>
            </View>
            <View style={[styles.pill, { backgroundColor: diff.bg }]}>
              <Text style={[styles.pillText, { color: diff.text }]}>{recipe.difficulty}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: '#F3F4F6' }]}>
              <Text style={[styles.pillText, { color: colors.textSecondary }]}>
                {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* Macros */}
          <MacroBadge
            calories={recipe.calories}
            protein={recipe.macros.protein}
            carbs={recipe.macros.carbs}
            fat={recipe.macros.fat}
            accentColor={palette.color}
          />

          {/* Missing ingredients warning */}
          {missingCount > 0 && (
            <View style={styles.missingBanner}>
              <Ionicons name="warning-outline" size={14} color="#D97706" />
              <Text style={styles.missingText}>
                Missing: {recipe.missing.join(', ')}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {missingCount > 0 && (
              <PrimaryButton
                label="Shopping List"
                icon="cart-outline"
                variant="secondary"
                size="sm"
                onPress={() => onShoppingList?.(recipe)}
                style={styles.actionBtn}
              />
            )}
            <PrimaryButton
              label="View Recipe"
              icon="arrow-forward"
              iconPosition="right"
              size="sm"
              color={palette.color}
              onPress={onPress}
              style={[styles.actionBtn, { flex: 1 }]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
  },
  emojiWrap: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 52,
  },
  saveBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md - 2,
    backgroundColor: '#FFFFFF',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleGroup: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: fontSize.xl - 1,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  cuisine: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  desc: {
    fontSize: fontSize.sm + 1,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm - 2,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radius.pill,
  },
  pillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  missingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm - 2,
    backgroundColor: colors.warningBg,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    padding: spacing.sm + 2,
  },
  missingText: {
    flex: 1,
    fontSize: fontSize.xs + 1,
    color: colors.warningText,
    fontWeight: fontWeight.semibold,
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionBtn: {
    flex: 1,
  },
});
