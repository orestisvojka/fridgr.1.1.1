// src/screens/main/HistoryScreen.jsx
// Shows real scan history from RecipesContext (recentScans)

import { useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Animated, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, ChevronRight, Sparkles, ArrowLeft, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { useThemeColors } from '../../context/ThemeContext';
import { findMatchingRecipes } from '../../services/recipeService';
import { SPACING, RADIUS, SHADOWS, FONT } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ICON_STROKE } from '../../constants/icons';
import Icon3D from '../../components/Icon3D';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTimestamp(iso) {
  const date = new Date(iso);
  const now  = new Date();
  const diffMs   = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs  = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 2)   return 'Just now';
  if (diffMins < 60)  return `${diffMins}m ago`;
  if (diffHrs < 24)   return `${diffHrs}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)   return `${diffDays} days ago`;

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ C, onScan }) {
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: -8, duration: 2000, useNativeDriver: true }),
      Animated.timing(float, { toValue:  0, duration: 2000, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <View style={[es.wrap]}>
      <Animated.View style={{ transform: [{ translateY: float }], marginBottom: SPACING.xl }}>
        <Icon3D name="history" size="xl" card />
      </Animated.View>
      <Text style={[es.title, { color: C.text }]}>No scans yet</Text>
      <Text style={[es.sub, { color: C.textSecondary }]}>
        Your ingredient scan history will appear here after your first search.
      </Text>
      <Pressable
        onPress={onScan}
        style={({ pressed }) => [es.btn, { backgroundColor: C.primary, opacity: pressed ? 0.85 : 1 }]}
      >
        <Search size={16} color="#FFF" strokeWidth={ICON_STROKE} />
        <Text style={es.btnText}>Scan Ingredients</Text>
      </Pressable>
    </View>
  );
}

const es = StyleSheet.create({
  wrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxxl, gap: SPACING.md },
  title:   { ...FONT.h3, textAlign: 'center' },
  sub:     { ...FONT.body, textAlign: 'center', lineHeight: 24 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
    borderRadius: RADIUS.full, marginTop: SPACING.md,
  },
  btnText: { ...FONT.bodySemiBold, color: '#FFF' },
});

// ─── Scan card ────────────────────────────────────────────────────────────────
function ScanCard({ item, index, onPress, C }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scale     = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 320, delay: index * 60, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 320, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  const pressIn  = useCallback(() =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 120, bounciness: 0 }).start(), []);
  const pressOut = useCallback(() =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 12 }).start(), []);

  const ingredients = item.ingredients ?? [];
  const preview = ingredients.slice(0, 4);
  const extra   = ingredients.length - preview.length;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={({ pressed }) => [
          sc.card,
          { backgroundColor: C.surface, borderColor: C.borderLight },
          pressed && Platform.OS === 'ios' && { opacity: 0.95 },
          { overflow: 'hidden' },
        ]}
        android_ripple={{ color: 'rgba(62,107,80,0.06)' }}
      >
        {/* Left icon */}
        <Icon3D name="flash" size="sm" card cardPadding={4} />

        {/* Content */}
        <View style={sc.content}>
          {/* Chips row */}
          <View style={sc.chipsRow}>
            {preview.map(ing => (
              <View key={ing} style={[sc.chip, { backgroundColor: C.primaryFaint, borderColor: C.primaryPale }]}>
                <Text style={[sc.chipText, { color: C.primary }]} numberOfLines={1}>{ing}</Text>
              </View>
            ))}
            {extra > 0 && (
              <View style={[sc.chip, { backgroundColor: C.surface2, borderColor: C.border }]}>
                <Text style={[sc.chipText, { color: C.textSecondary }]}>+{extra}</Text>
              </View>
            )}
          </View>

          {/* Meta row */}
          <View style={sc.meta}>
            <Clock size={11} color={C.textTertiary} strokeWidth={ICON_STROKE} />
            <Text style={[sc.metaText, { color: C.textTertiary }]}>{formatTimestamp(item.timestamp)}</Text>
            {item.recipeCount > 0 && (
              <>
                <View style={[sc.dot, { backgroundColor: C.border }]} />
                <Sparkles size={11} color={C.primary} strokeWidth={ICON_STROKE} />
                <Text style={[sc.metaText, { color: C.primary }]}>
                  {item.recipeCount} recipe{item.recipeCount !== 1 ? 's' : ''}
                </Text>
              </>
            )}
          </View>
        </View>

        <ChevronRight size={16} color={C.textTertiary} strokeWidth={ICON_STROKE} />
      </Pressable>
    </Animated.View>
  );
}

const sc = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    padding: SPACING.lg, borderRadius: RADIUS.xxl,
    borderWidth: 1, ...SHADOWS.sm,
  },
  content:  { flex: 1, gap: SPACING.xs },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: {
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: RADIUS.full, borderWidth: 1,
  },
  chipText: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400' },
  meta:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400' },
  dot:      { width: 3, height: 3, borderRadius: 1.5 },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { recentScans } = useRecipes();

  const handleScanPress = useCallback((scan) => {
    const results = findMatchingRecipes(scan.ingredients);
    navigation.navigate(ROUTES.RESULTS, { ingredients: scan.ingredients, results });
  }, [navigation]);

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={C.isDark ? ['#1A2E22', '#0E1410'] : ['#3E6B50', '#2C4D38']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }, { overflow: 'hidden' }]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true, radius: 22 }}
        >
          <ArrowLeft size={20} color="#FFF" strokeWidth={ICON_STROKE} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Scan History</Text>
          <Text style={styles.headerSub}>
            {recentScans.length > 0
              ? `${recentScans.length} scan${recentScans.length !== 1 ? 's' : ''} total`
              : 'No scans yet'}
          </Text>
        </View>
      </LinearGradient>

      {recentScans.length === 0 ? (
        <EmptyState C={C} onScan={() => navigation.navigate('ScanTab')} />
      ) : (
        <FlatList
          data={recentScans}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
          renderItem={({ item, index }) => (
            <ScanCard
              item={item}
              index={index}
              C={C}
              onPress={() => handleScanPress(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerTitle: { ...FONT.h3, color: '#FFFFFF' },
  headerSub:   { ...FONT.bodySmall, color: 'rgba(255,255,255,0.60)', marginTop: 2 },

  list: { padding: SPACING.xl },
});
