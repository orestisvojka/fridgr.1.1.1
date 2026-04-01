// src/screens/main/FavoritesScreen.jsx
import { useMemo, useRef, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  ActivityIndicator, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Clock, Flame, RefreshCw, Bookmark } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';
import { PREMIUM_HEADER_WIDE } from '../../constants/premiumScreenTheme';

// ─── Favorite Card ────────────────────────────────────────────────────────────
function FavoriteCard({ recipe, onPress, onRemove, C }) {
  const heartScale = useRef(new Animated.Value(1)).current;

  const diffBg    = recipe.difficulty === 'Easy' ? C.primaryFaint : recipe.difficulty === 'Medium' ? 'rgba(250,204,21,0.12)' : C.errorLight;
  const diffColor = recipe.difficulty === 'Easy' ? C.primary      : recipe.difficulty === 'Medium' ? C.accent               : C.error;

  const handleRemove = useCallback(() => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.25, friction: 4, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1,    friction: 5, useNativeDriver: true }),
    ]).start();
    onRemove();
  }, [heartScale, onRemove]);

  return (
    <Pressable style={({ pressed }) => [pressed && { opacity: 0.93 }]} onPress={onPress}>
      <View style={styles.card}>
        {/* Hero image */}
        <View style={styles.cardHero}>
          <RecipeImage recipe={recipe} height={130} borderRadius={0} style={{ width: '100%' }} />
          {/* Gradient overlay for title readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.35)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* Remove button */}
          <Pressable
            style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.85 }]}
            onPress={handleRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Heart size={16} color={C.primary} fill={C.primary} strokeWidth={ICON_STROKE} />
            </Animated.View>
          </Pressable>
        </View>
        {/* Body */}
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, { color: C.text }]} numberOfLines={2}>{recipe.title}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Clock size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={[styles.metaText, { color: C.textTertiary }]}>{recipe.prepTime}m</Text>
            </View>
            <View style={styles.metaItem}>
              <Flame size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
              <Text style={[styles.metaText, { color: C.textTertiary }]}>{recipe.calories} cal</Text>
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { savedRecipes, toggleSave, hydration, hydrationError, retryHydration, persistError } = useRecipes();

  const [focusEpoch, setFocusEpoch] = useState(0);
  useFocusEffect(useCallback(() => { setFocusEpoch(e => e + 1); }, []));

  const listKey    = `${hydration === 'ready' ? 'ready' : hydration}-${focusEpoch}`;
  const savedIdsKey = savedRecipes.map(r => r.id).join('|');
  const showLoading = hydration === 'loading' && savedRecipes.length === 0;

  let body;
  if (showLoading) {
    body = (
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>Loading your saved recipes…</Text>
      </View>
    );
  } else if (hydration === 'error') {
    body = (
      <View style={styles.centerFill}>
        <Text style={[styles.errorTitle, { color: C.text }]}>Could not load saved recipes</Text>
        <Text style={[styles.errorSub, { color: C.textSecondary }]}>{hydrationError || 'Something went wrong.'}</Text>
        <Pressable
          style={({ pressed }) => [styles.retryBtn, { borderColor: C.primaryPale, backgroundColor: C.primaryFaint }, pressed && { opacity: 0.85 }]}
          onPress={retryHydration}
        >
          <RefreshCw size={16} color={C.primary} strokeWidth={ICON_STROKE} />
          <Text style={[styles.retryText, { color: C.primary }]}>Try again</Text>
        </Pressable>
      </View>
    );
  } else if (savedRecipes.length === 0) {
    body = (
      <View style={[styles.centerFill, { paddingTop: SPACING.section }]}>
        <View style={[styles.emptyIconWrap, { backgroundColor: C.primaryFaint, borderColor: C.primaryPale }]}>
          <Bookmark size={34} color={C.primary} strokeWidth={ICON_STROKE} />
        </View>
        <Text style={[styles.emptyTitle, { color: C.text }]}>No saved recipes yet</Text>
        <Text style={[styles.emptySub, { color: C.textSecondary }]}>
          Tap the heart on any recipe to save it here. Your list stays after you restart the app.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.browseBtn, { backgroundColor: C.primary }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
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
            C={C}
            onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
            onRemove={() => toggleSave(item)}
          />
        )}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Hero header */}
      <LinearGradient
        colors={PREMIUM_HEADER_WIDE}
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
                : hydration === 'loading' ? 'Syncing your collection…' : ' '}
            </Text>
          </View>
          <View style={styles.heartIcon}>
            <Heart size={22} color="#FACC15" fill="rgba(250,204,21,0.3)" strokeWidth={ICON_STROKE} />
          </View>
        </View>
      </LinearGradient>

      {persistError ? (
        <Text style={[styles.persistNote, { color: C.textTertiary }]}>
          Could not sync last change. {persistError}
        </Text>
      ) : null}

      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#F9FAFB', marginBottom: SPACING.xs, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: 'rgba(249,250,251,0.55)' },
  heartIcon: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(250,204,21,0.13)',
    borderWidth: 1, borderColor: 'rgba(250,204,21,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },

  centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.xl },
  loadingText: { fontSize: 15, marginTop: SPACING.md },
  errorTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: SPACING.sm },
  errorSub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  retryBtn: {
    marginTop: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
    borderRadius: RADIUS.full, borderWidth: 1.5,
  },
  retryText: { fontSize: 15, fontWeight: '600' },

  emptyIconWrap: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginTop: SPACING.lg },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 24, marginTop: SPACING.sm, maxWidth: 280 },
  browseBtn: { borderRadius: RADIUS.full, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, marginTop: SPACING.lg, ...SHADOWS.green },
  browseBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  grid: { padding: SPACING.lg, paddingBottom: 120 },
  row: { gap: SPACING.md, justifyContent: 'space-between' },

  card: {
    flex: 1, maxWidth: '48%',
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(228,221,210,0.8)',
    marginBottom: SPACING.md, ...SHADOWS.sm,
  },
  cardHero: { height: 130, position: 'relative' },
  removeBtn: {
    position: 'absolute', top: SPACING.sm, right: SPACING.sm,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.xs,
  },
  cardBody: { padding: SPACING.md, gap: SPACING.xs },
  cardTitle: { fontSize: 13, fontWeight: '600', lineHeight: 18, minHeight: 36 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, fontWeight: '500' },
  diffBadge: { alignSelf: 'flex-start', borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  diffText: { fontSize: 10, fontWeight: '700' },
  persistNote: { fontSize: 11, textAlign: 'center', paddingHorizontal: SPACING.xl, marginTop: SPACING.sm },
});
