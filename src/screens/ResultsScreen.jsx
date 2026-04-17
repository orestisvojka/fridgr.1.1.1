// src/screens/ResultsScreen.jsx
// Shows matched recipe cards with save + shopping list support

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import ShoppingListModal from '../components/ShoppingListModal';
import PrimaryButton from '../components/PrimaryButton';
import {
  colors,
  fontSize,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  shadows,
} from '../styles/theme';
import { useRecipes } from '../context/RecipesContext';

export default function ResultsScreen({ route, navigation }) {
  const { recipes = [], ingredients = [] } = route.params || {};
  const { savedIds, toggleSave } = useRecipes();
  const [modalRecipe, setModalRecipe] = useState(null);
  const insets = useSafeAreaInsets();

  // Stagger fade-in cards
  const cardAnims = useRef(recipes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = cardAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 380,
        delay: i * 110,
        useNativeDriver: true,
      })
    );
    Animated.stagger(110, animations).start();
  }, []);

  const renderCard = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: cardAnims[index],
        transform: [
          {
            translateY: cardAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [24, 0],
            }),
          },
        ],
      }}
    >
      <RecipeCard
        recipe={item}
        isSaved={savedIds.includes(item.id)}
        onPress={() => navigation.navigate('Detail', { recipe: item })}
        onSave={toggleSave}
        onShoppingList={(r) => setModalRecipe(r)}
        style={styles.card}
      />
    </Animated.View>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Match summary banner */}
      <View style={styles.matchBanner}>
        <Ionicons name="flash" size={16} color={colors.green} />
        <Text style={styles.matchText}>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontWeight: '400', color: colors.textPrimary }}>
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </Text>
          {' '}matched your fridge
        </Text>
      </View>

      {/* Ingredient pills */}
      <View style={styles.pillRow}>
        {ingredients.map((ing) => (
          <View key={ing} style={styles.ingPill}>
            <Text style={styles.ingPillText}>{ing}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sortNote}>
        Sorted by best match · fastest prep time
      </Text>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyEmoji}>🥲</Text>
      <Text style={styles.emptyTitle}>No matches found</Text>
      <Text style={styles.emptyDesc}>
        Try adding more common ingredients like eggs, tomato, or pasta.
      </Text>
      <PrimaryButton
        label="Go Back"
        icon="arrow-back"
        variant="outline"
        onPress={() => navigation.goBack()}
        style={styles.emptyBtn}
      />
    </View>
  );

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <Header
        title="Your Recipes"
        subtitle={`${recipes.length} match${recipes.length !== 1 ? 'es' : ''}`}
        onBack={() => navigation.goBack()}
      />

      {recipes.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xxl }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Shopping list modal */}
      <ShoppingListModal
        visible={!!modalRecipe}
        recipe={modalRecipe}
        onClose={() => setModalRecipe(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgCardAlt,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    marginBottom: spacing.sm,
  },
  listHeader: {
    marginBottom: spacing.lg,
    gap: spacing.sm + 2,
  },
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.greenLight,
    borderRadius: radius.lg,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.green + '40',
  },
  matchText: {
    fontSize: fontSize.sm + 1,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm - 2,
  },
  ingPill: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.pill,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  ingPillText: {
    fontSize: fontSize.xs,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  sortNote: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontFamily: 'Poppins_400Regular',
    paddingLeft: spacing.xs,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.xxl,
    fontFamily: 'Poppins_400Regular',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  emptyDesc: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 260,
  },
  emptyBtn: {
    marginTop: spacing.sm,
  },
});
