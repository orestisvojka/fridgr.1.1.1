// src/screens/auth/WelcomeScreen.jsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { emoji: '📸', text: 'Snap ingredients' },
  { emoji: '🤖', text: 'AI identifies them' },
  { emoji: '🍽️', text: 'Get instant recipes' },
];

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const ctaAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.timing(ctaAnim, { toValue: 1, duration: 400, useNativeDriver: true, delay: 100 }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Hero gradient */}
      <LinearGradient
        colors={['#0A1F0E', '#0F3320', '#15803D']}
        style={styles.hero}
      >
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <Animated.View
          style={[
            styles.heroContent,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✦ AI-Powered Cooking</Text>
          </View>

          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>FRIDGR</Text>
          </View>

          <Text style={styles.heroTitle}>Cook with what{'\n'}you already have</Text>
          <Text style={styles.heroSubtitle}>
            Turn any ingredients into delicious recipes in seconds
          </Text>

          {/* Feature pills */}
          <View style={styles.features}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featurePill}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Bottom CTA card */}
      <Animated.View style={[styles.bottomCard, { opacity: ctaAnim }]}>
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate(ROUTES.SIGN_UP)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#16A34A', '#15803D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnText}>Get Started — It's Free</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>
              Already have an account?{' '}
              <Text style={styles.secondaryBtnLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.legal, { paddingBottom: insets.bottom + SPACING.sm }]}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Hero
  hero: { flex: 1, overflow: 'hidden' },
  heroContent: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xxxl,
    paddingTop: 80,
  },
  circle1: {
    position: 'absolute', top: -80, right: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circle2: {
    position: 'absolute', top: -30, right: 40,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: SPACING.lg,
  },
  badgeText: { ...FONT.labelSmall, color: 'rgba(255,255,255,0.8)' },

  logoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.lg, gap: 4 },
  logoDot:  { width: 10, height: 10, borderRadius: 5, backgroundColor: '#86EFAC', marginTop: 6 },
  logoText: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.8 },

  heroTitle: {
    ...FONT.hero,
    color: '#FFFFFF',
    marginBottom: SPACING.md,
  },
  heroSubtitle: {
    ...FONT.body,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: SPACING.xxl,
    lineHeight: 24,
  },

  features: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  featureEmoji: { fontSize: 14 },
  featureText:  { ...FONT.bodySmallMedium, color: 'rgba(255,255,255,0.85)' },

  // Bottom card
  bottomCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    ...SHADOWS.lg,
  },
  ctaSection: { gap: SPACING.md, marginBottom: SPACING.md },

  primaryBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.green },
  primaryBtnGradient: {
    paddingVertical: SPACING.lg + 2,
    alignItems: 'center',
  },
  primaryBtnText: { ...FONT.bodySemiBold, color: COLORS.white, fontSize: 16 },

  secondaryBtn: { alignItems: 'center', paddingVertical: SPACING.sm },
  secondaryBtnText: { ...FONT.body, color: COLORS.textSecondary },
  secondaryBtnLink: { color: COLORS.primary, fontWeight: '600' },

  legal: { ...FONT.caption, color: COLORS.textTertiary, textAlign: 'center' },
});
