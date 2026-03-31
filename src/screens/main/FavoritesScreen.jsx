// src/screens/main/FavoritesScreen.jsx
import React, { useMemo, useRef, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Clock, Flame, RefreshCw, Bookmark } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';

import { PREMIUM_HEADER_WIDE } from '../../constants/premiumScreenTheme';

const HEADER_GRADIENT = PREMIUM_HEADER_WIDE;

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    header: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerTitle: { ...FONT.h2, color: '#F9FAFB', marginBottom: SPACING.xs },
    headerSub: { ...FONT.bodySmall, color: 'rgba(249,250,251,0.55)' },
    heartIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(250,204,21,0.15)',
      borderWidth: 1,
      borderColor: 'rgba(250,204,21,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.xl },
    loadingText: { ...FONT.body, color: C.textSecondary, marginTop: SPACING.md },
    errorTitle: { ...FONT.h4, color: C.text, textAlign: 'center', marginBottom: SPACING.sm },
    errorSub: { ...FONT.bodySmall, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
    retryBtn: {
      marginTop: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      backgroundColor: C.primaryFaint,
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      borderRadius: RADIUS.full,
      borderWidth: 1.5,
      borderColor: C.primaryPale,
    },
    retryText: { ...FONT.bodySemiBold, color: C.primary },
    grid: { padding: SPACING.lg, paddingBottom: 160 },
    row: { gap: SPACING.md, justifyContent: 'space-between' },
    card: {
      flex: 1,
      maxWidth: '48%',
      backgroundColor: C.surface,
      borderRadius: RADIUS.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: C.borderLight,
      marginBottom: SPACING.md,
      ...SHADOWS.md,
    },
    cardHero: {
      height: 132,
      position: 'relative',
    },
    removeBtn: {
      position: 'absolute',
      top: SPACING.sm,
      right: SPACING.sm,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.96)',
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.sm,
    },
    cardBody: { padding: SPACING.md, gap: SPACING.xs },
    cardTitle: { ...FONT.bodySmallMedium, color: C.text, minHeight: 36 },
    cardMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    metaText: { ...FONT.caption, color: C.textTertiary },
    diffBadge: {
      alignSelf: 'flex-start',
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
    },
    diffText: { fontSize: 10, fontWeight: '600' },
    emptyIconWrap: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: C.primaryFaint,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: C.primaryPale,
    },
    emptyTitle: { ...FONT.h4, color: C.text, textAlign: 'center', marginTop: SPACING.lg },
    emptySub: {
      ...FONT.body,
      color: C.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginTop: SPACING.sm,
    },
    browseBtn: {
      backgroundColor: C.primary,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      marginTop: SPACING.lg,
      ...SHADOWS.green,
    },
    browseBtnText: { ...FONT.bodySemiBold, color: '#FFFFFF' },
    persistNote: {
      ...FONT.caption,
      color: C.textTertiary,
      textAlign: 'center',
      marginTop: SPACING.md,
      paddingHorizontal: SPACING.xl,
    },
  });
}

function FavoriteCard({ recipe, onPress, onRemove, styles, C }) {
  const heartScale = useRef(new Animated.Value(1)).current;
  const diffBg =
    recipe.difficulty === 'Easy'
      ? C.primaryFaint
      : recipe.difficulty === 'Medium'
        ? 'rgba(250,204,21,0.12)'
        : C.errorLight;
  const diffColor =
    recipe.difficulty === 'Easy'
      ? C.primary
      : recipe.difficulty === 'Medium'
        ? C.accent
        : C.error;

  const handleRemove = useCallback(() => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.2,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    onRemove();
  }, [heartScale, onRemove]);

  return (
    <Pressable style={({ pressed }) => [pressed && { opacity: 0.92 }]} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.cardHero}>
          <RecipeImage recipe={recipe} height={132} borderRadius={0} style={{ width: '100%' }} />
          <Pressable
            style={({ pressed: p }) => [styles.removeBtn, p && { opacity: 0.92 }]}
            onPress={handleRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Heart size={18} color={C.primary} fill={C.primary} strokeWidth={ICON_STROKE} />
            </Animated.View>
          </Pressable>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {recipe.title}
          </Text>
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Clock size={12} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={styles.metaText}>{recipe.prepTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Flame size={12} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={styles.metaText}>{recipe.calories} cal</Text>
            </View>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: diffBg }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const {
    savedRecipes,
    toggleSave,
    hydration,
    hydrationError,
    retryHydration,
    persistError,
  } = useRecipes();

  const [focusEpoch, setFocusEpoch] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setFocusEpoch((e) => e + 1);
    }, []),
  );

  const listKey = `${hydration === 'ready' ? 'ready' : hydration}-${focusEpoch}`;
  const savedIdsKey = savedRecipes.map((r) => r.id).join('|');
  const showLoading = hydration === 'loading' && savedRecipes.length === 0;

  let body;
  if (showLoading) {
    body = (
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={styles.loadingText}>Loading your saved recipes…</Text>
      </View>
    );
  } else if (hydration === 'error') {
    body = (
      <View style={styles.centerFill}>
        <Text style={styles.errorTitle}>Could not load saved recipes</Text>
        <Text style={styles.errorSub}>{hydrationError || 'Something went wrong.'}</Text>
        <Pressable
          style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.88 }]}
          onPress={retryHydration}
        >
          <RefreshCw size={18} color={C.primary} strokeWidth={ICON_STROKE} />
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  } else if (savedRecipes.length === 0) {
    body = (
      <View style={[styles.centerFill, { paddingTop: SPACING.section }]}>
        <View style={styles.emptyIconWrap}>
          <Bookmark size={36} color={C.primary} strokeWidth={ICON_STROKE} />
        </View>
        <Text style={styles.emptyTitle}>No saved recipes yet</Text>
        <Text style={styles.emptySub}>
          Tap the heart on any recipe to save it here. Your list syncs to this account and stays
          after you restart the app.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.browseBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={() => navigation.navigate('RecipesTab')}
        >
          <Text style={styles.browseBtnText}>Browse recipes</Text>
        </Pressable>
      </View>
    );
  } else {
    body = (
      <FlatList
        key={listKey}
        data={savedRecipes}
        extraData={savedIdsKey}
        keyExtractor={r => r.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <FavoriteCard
            recipe={item}
            styles={styles}
            C={C}
            onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
            onRemove={() => toggleSave(item)}
          />
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={HEADER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Saved</Text>
            <Text style={styles.headerSub}>
              {savedRecipes.length > 0
                ? `${savedRecipes.length} recipe${savedRecipes.length !== 1 ? 's' : ''} in your collection`
                : hydration === 'loading'
                  ? 'Syncing your collection…'
                  : ' '}
            </Text>
          </View>
          <View style={styles.heartIcon}>
            <Heart size={24} color="#FACC15" fill="rgba(250,204,21,0.35)" strokeWidth={ICON_STROKE} />
          </View>
        </View>
      </LinearGradient>

      {persistError ? (
        <Text style={styles.persistNote}>
          Could not sync last change. {persistError}
        </Text>
      ) : null}

      {body}
    </View>
  );
}
