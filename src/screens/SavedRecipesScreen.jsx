// src/screens/SavedRecipesScreen.jsx
// Shows user's saved/bookmarked recipes

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import {
  colors,
  fontSize,
  fontFamily, fontWeight,
  radius,
  spacing,
  shadows,
  difficultyColors,
} from '../styles/theme';
import { formatPrepTime } from '../utils/helpers';
import { useRecipes } from '../context/RecipesContext';

function SavedCard({ recipe, onPress, onRemove }) {
  const palette = recipe.palette || { color: colors.green, bg: colors.greenLight };
  const diff = difficultyColors[recipe.difficulty] || difficultyColors.Easy;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.savedCard, shadows.sm]}>
      {/* Color strip */}
      <View style={[styles.colorStrip, { backgroundColor: palette.bg }]}>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{recipe.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={11} color={colors.textMuted} />
          <Text style={styles.metaText}>{formatPrepTime(recipe.prepTime)}</Text>
          <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
            <Text style={[styles.diffText, { color: diff.text }]}>{recipe.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.cardCalories}>{recipe.calories} cal · {recipe.macros.protein}g protein</Text>
      </View>

      {/* Remove button */}
      <TouchableOpacity
        onPress={() => onRemove(recipe)}
        style={styles.removeBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <Ionicons name="close-circle" size={22} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function SavedRecipesScreen({ navigation }) {
  const { savedRecipes, toggleSave } = useRecipes();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      {/* Header gradient */}
      <LinearGradient
        colors={['#052E16', '#0F3D22', '#166534']}
        style={[styles.headerGrad, { paddingTop: insets.top + spacing.lg }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Saved Recipes</Text>
            <Text style={styles.headerSub}>
              {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved
            </Text>
          </View>
          <View style={styles.heartIcon}>
            <Ionicons name="heart" size={22} color={colors.green} />
          </View>
        </View>
      </LinearGradient>

      {savedRecipes.length === 0 ? (
        // Empty state
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="heart-outline" size={42} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyDesc}>
            Heart any recipe to save it here for later.{'\n'}Your favorites will appear here.
          </Text>
          <PrimaryButton
            label="Find Recipes"
            icon="search-outline"
            onPress={() => navigation.navigate('Cook')}
            style={styles.emptyBtn}
          />
        </View>
      ) : (
        <FlatList
          data={savedRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SavedCard
              recipe={item}
              onPress={() => navigation.navigate('Detail', { recipe: item })}
              onRemove={toggleSave}
            />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + spacing.xxxl },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text style={styles.listHeader}>Your collection</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgCardAlt,
  },
  headerGrad: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: fontSize.xxl + 2,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: colors.textInverse,
    letterSpacing: -0.6,
  },
  headerSub: {
    fontSize: fontSize.sm + 1,
    color: 'rgba(255,255,255,0.55)',
    marginTop: spacing.xs,
  },
  heartIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md + 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md - 2,
  },
  listHeader: {
    fontSize: fontSize.xs,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.sm - 2,
  },
  colorStrip: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.xs + 1,
  },
  cardTitle: {
    fontSize: fontSize.md + 1,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
  },
  diffBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  diffText: {
    fontSize: fontSize.xs - 1,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cardCalories: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
  },
  removeBtn: {
    paddingRight: spacing.md,
    paddingLeft: spacing.sm,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    gap: spacing.md,
    marginTop: -spacing.xxl,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.xxl,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.xxl,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  emptyDesc: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyBtn: {
    marginTop: spacing.sm,
  },
});
