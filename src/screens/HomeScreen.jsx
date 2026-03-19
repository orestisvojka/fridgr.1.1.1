// src/screens/HomeScreen.jsx
// Landing screen: logo, tagline, ingredient input, CTA, footer

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import IngredientInput from '../components/IngredientInput';
import PrimaryButton from '../components/PrimaryButton';
import { findMatchingRecipes } from '../services/recipeService';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
  shadows,
} from '../styles/theme';
import { APP_NAME, APP_TAGLINE, APP_SUBTITLE } from '../utils/constants';
import { useRecipes } from '../context/RecipesContext';

const FEATURE_PILLS = [
  { icon: 'flash-outline', label: 'Instant Match', color: '#F59E0B' },
  { icon: 'leaf-outline', label: 'No Waste', color: colors.green },
  { icon: 'cart-outline', label: 'Shopping List', color: '#3B82F6' },
];

const STATS = [
  { value: '200+', label: 'Recipes', icon: 'restaurant-outline' },
  { value: '0 min', label: 'Setup', icon: 'flash-outline' },
  { value: '100%', label: 'Free', icon: 'star-outline' },
];

export default function HomeScreen({ navigation }) {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { preferences, savedRecipes } = useRecipes();
  const btnScale = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const handleSearch = () => {
    if (ingredients.length === 0) {
      setError('Add at least one ingredient to get started.');
      return;
    }
    setError('');
    pulse();
    setLoading(true);
    setTimeout(() => {
      const results = findMatchingRecipes(ingredients);
      setLoading(false);
      navigation.navigate('Results', { recipes: results, ingredients });
    }, 1400);
  };

  const skillLabel = { beginner: 'Beginner', home_cook: 'Home Cook', pro: 'Chef' }[preferences?.skill] || 'Home Cook';
  const timeLabel = { 15: '15-min', 30: '30-min', 99: 'anytime' }[preferences?.time] || '30-min';

  return (
    <View style={styles.root}>
      {/* Hero gradient */}
      <LinearGradient
        colors={['#031A0C', '#0A2E1A', '#1A5C2E']}
        locations={[0, 0.55, 1]}
        style={[styles.heroGradient, { paddingTop: insets.top + spacing.lg }]}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="nutrition" size={20} color="#fff" />
            </View>
            <Text style={styles.logoText}>{APP_NAME}</Text>
          </View>
          <View style={styles.topActions}>
            {savedRecipes.length > 0 && (
              <View style={styles.savedBadge}>
                <Text style={styles.savedBadgeText}>{savedRecipes.length}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate('Saved')}
              style={styles.iconBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="heart" size={17} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preference badge */}
        <View style={styles.greetRow}>
          <View style={styles.prefBadge}>
            <Ionicons name="person-outline" size={11} color={colors.green} />
            <Text style={styles.prefBadgeText}>{skillLabel} · {timeLabel} meals</Text>
          </View>
        </View>

        {/* Hero copy */}
        <View style={styles.heroCopy}>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
          <Text style={styles.subtitle}>{APP_SUBTITLE}</Text>
        </View>

        {/* Feature pills */}
        <View style={styles.featurePills}>
          {FEATURE_PILLS.map(({ icon, label, color }) => (
            <View key={label} style={[styles.featurePill, { backgroundColor: color + '20', borderColor: color + '40' }]}>
              <Ionicons name={icon} size={11} color={color} />
              <Text style={[styles.featurePillText, { color }]}>{label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Scrollable body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Input card */}
        <View style={[styles.card, shadows.lg]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={styles.cardTitleIcon}>
                <Ionicons name="nutrition-outline" size={16} color={colors.green} />
              </View>
              <Text style={styles.cardTitle}>What's in your fridge?</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              Type or tap the camera to scan your ingredients.
            </Text>
          </View>

          <IngredientInput
            ingredients={ingredients}
            onChange={(updated) => {
              setIngredients(updated);
              if (error) setError('');
            }}
          />

          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <PrimaryButton
              label={loading ? '' : `Find Recipes${ingredients.length > 0 ? ` · ${ingredients.length} items` : ''}`}
              icon={loading ? undefined : 'search-outline'}
              full
              size="lg"
              onPress={handleSearch}
              loading={loading}
            />
          </Animated.View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map(({ value, label, icon }) => (
            <View key={label} style={[styles.statCard, shadows.sm]}>
              <Ionicons name={icon} size={18} color={colors.green} />
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* How it works */}
        <View style={styles.howSection}>
          <Text style={styles.sectionTitle}>How FRIDGR works</Text>
          {[
            { step: '1', icon: 'camera-outline', text: "Scan or type what's in your fridge", color: '#8B5CF6' },
            { step: '2', icon: 'flash-outline', text: 'We match your ingredients to recipes instantly', color: '#F59E0B' },
            { step: '3', icon: 'restaurant-outline', text: 'Cook, save favorites, and build a shopping list', color: colors.green },
          ].map(({ step, icon, text, color }) => (
            <View key={step} style={[styles.howRow, shadows.sm]}>
              <View style={[styles.howStep, { backgroundColor: color + '18' }]}>
                <Ionicons name={icon} size={18} color={color} />
              </View>
              <View style={styles.howTextWrap}>
                <Text style={styles.howStepNum}>Step {step}</Text>
                <Text style={styles.howText}>{text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Ionicons name="nutrition" size={16} color={colors.green} />
            <Text style={styles.footerLogoText}>FRIDGR.</Text>
          </View>
          <Text style={styles.footerTagline}>Cook smarter. Waste less. Eat better.</Text>
          <View style={styles.footerDivider} />
          <View style={styles.footerLinks}>
            {[
              { icon: 'shield-checkmark-outline', label: 'Privacy' },
              { icon: 'document-text-outline', label: 'Terms' },
              { icon: 'mail-outline', label: 'Contact' },
            ].map(({ icon, label }) => (
              <TouchableOpacity key={label} style={styles.footerLink} activeOpacity={0.7}>
                <Ionicons name={icon} size={13} color={colors.textMuted} />
                <Text style={styles.footerLinkText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.footerVersion}>FRIDGR v1.0 · Made with care</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgCardAlt,
  },
  heroGradient: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.xl,
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedBadge: {
    backgroundColor: colors.green,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  savedBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    color: '#fff',
  },
  greetRow: {
    flexDirection: 'row',
  },
  prefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.md - 2,
    borderWidth: 1,
    borderColor: colors.green + '30',
  },
  prefBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.green,
  },
  heroCopy: {
    gap: spacing.sm - 2,
  },
  tagline: {
    fontSize: fontSize.xxxl + 4,
    fontWeight: fontWeight.extrabold,
    color: '#FFFFFF',
    letterSpacing: -1.2,
    lineHeight: fontSize.xxxl + 12,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 22,
  },
  featurePills: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 5,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  featurePillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  scroll: {
    flex: 1,
    marginTop: -(spacing.xxxl + spacing.xl),
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  cardHeader: {
    gap: spacing.xs + 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitleIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: fontSize.xl - 1,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: fontSize.sm + 1,
    color: colors.textMuted,
    lineHeight: 19,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.errorBg,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.error,
    fontWeight: fontWeight.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textMuted,
  },
  howSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
    paddingLeft: spacing.xs,
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.md + 2,
  },
  howStep: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  howTextWrap: {
    flex: 1,
    gap: 2,
  },
  howStepNum: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  howText: {
    fontSize: fontSize.sm + 1,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
  },
  footerLogoText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  footerTagline: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  footerDivider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerLinkText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: fontWeight.semibold,
  },
  footerVersion: {
    fontSize: fontSize.xs - 1,
    color: colors.border,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.3,
  },
});
