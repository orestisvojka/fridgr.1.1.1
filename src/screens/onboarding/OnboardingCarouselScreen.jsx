// src/screens/onboarding/OnboardingCarouselScreen.jsx
// Premium welcome screen — glass morphism + staggered animations (iOS & Android safe)

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS, SHADOWS, FONT } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const { width, height } = Dimensions.get('window');

// ─── Glass card helper ─────────────────────────────────────────────────────────
// React Native can't blur, so we simulate glass with a translucent
// white/light-green fill + light border + subtle inner highlight.
function GlassCard({ style, children }) {
  return (
    <View style={[glass.card, style]}>
      {/* Inner top highlight line */}
      <View style={glass.highlight} />
      {children}
    </View>
  );
}

// ─── Feature pill ─────────────────────────────────────────────────────────────
function FeaturePill({ label, anim }) {
  return (
    <Animated.View style={[pill.wrap, { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
      <View style={pill.dot} />
      <Text style={pill.text}>{label}</Text>
    </Animated.View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OnboardingCarouselScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // — Animations (all useNativeDriver: true except none needed) —
  const bgOp       = useRef(new Animated.Value(0)).current;
  const orb1Scale  = useRef(new Animated.Value(0.6)).current;
  const orb2Scale  = useRef(new Animated.Value(0.5)).current;

  const logoOp     = useRef(new Animated.Value(0)).current;
  const logoY      = useRef(new Animated.Value(-20)).current;

  const cardOp     = useRef(new Animated.Value(0)).current;
  const cardScale  = useRef(new Animated.Value(0.94)).current;

  const pill1Anim  = useRef(new Animated.Value(0)).current;
  const pill2Anim  = useRef(new Animated.Value(0)).current;
  const pill3Anim  = useRef(new Animated.Value(0)).current;

  const ctaOp      = useRef(new Animated.Value(0)).current;
  const ctaY       = useRef(new Animated.Value(16)).current;

  // Continuous floating for orbs
  const orb1Float  = useRef(new Animated.Value(0)).current;
  const orb2Float  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Orb float loops ───────────────────────────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Float, { toValue: -14, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(orb1Float, { toValue:   0, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb2Float, { toValue: 12, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(orb2Float, { toValue: 0,  duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // ── Entrance stagger ─────────────────────────────────────────────────────
    Animated.sequence([
      // 1. Fade bg + expand orbs
      Animated.parallel([
        Animated.timing(bgOp,      { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(orb1Scale, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
        Animated.spring(orb2Scale, { toValue: 1, tension: 35, friction: 8, useNativeDriver: true }),
      ]),

      // 2. Logo drops in
      Animated.parallel([
        Animated.timing(logoOp, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(logoY,  { toValue: 0, tension: 60, friction: 7, useNativeDriver: true }),
      ]),

      // 3. Glass card scales in
      Animated.parallel([
        Animated.timing(cardOp,    { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.spring(cardScale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
      ]),

      // 4. Pills stagger in
      Animated.stagger(120, [
        Animated.timing(pill1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(pill2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(pill3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),

      // 5. CTA rises
      Animated.parallel([
        Animated.timing(ctaOp, { toValue: 1, duration: 340, useNativeDriver: true }),
        Animated.spring(ctaY,  { toValue: 0, tension: 55, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleStart = () => navigation.navigate(ROUTES.QUESTIONNAIRE);

  return (
    <Animated.View style={[styles.root, { opacity: bgOp }]}>
      <StatusBar style="light" />

      {/* Deep forest gradient background */}
      <LinearGradient
        colors={['#0A1F14', '#143322', '#1E4D32', '#2C6645']}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Floating orbs ──────────────────────────────────────────────────── */}
      <Animated.View style={[
        styles.orb1,
        { transform: [{ scale: orb1Scale }, { translateY: orb1Float }] }
      ]} />
      <Animated.View style={[
        styles.orb2,
        { transform: [{ scale: orb2Scale }, { translateY: orb2Float }] }
      ]} />
      <View style={styles.orb3} />

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <View style={[styles.content, {
        paddingTop: insets.top + SPACING.xl,
        paddingBottom: insets.bottom + SPACING.xxl,
      }]}>

        {/* Logo */}
        <Animated.View style={[styles.logoRow, { opacity: logoOp, transform: [{ translateY: logoY }] }]}>
          <View style={styles.logoMark}>
            <View style={styles.logoMarkDot} />
          </View>
          <Text style={styles.wordmark}>FRIDGR</Text>
        </Animated.View>

        {/* Glass headline card */}
        <Animated.View style={{ opacity: cardOp, transform: [{ scale: cardScale }], flex: 1, marginBottom: SPACING.lg }}>
          <GlassCard style={styles.mainCard}>
            <Text style={styles.headline}>Your kitchen,{'\n'}elevated.</Text>
            <Text style={styles.subhead}>
              Tell us about your taste and we'll handle the rest.
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Feature pills */}
            <View style={styles.pillsRow}>
              <FeaturePill label="Smart Recipes"  anim={pill1Anim} />
              <FeaturePill label="Zero Waste"     anim={pill2Anim} />
              <FeaturePill label="Personalized"   anim={pill3Anim} />
            </View>
          </GlassCard>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaWrap, { opacity: ctaOp, transform: [{ translateY: ctaY }] }]}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleStart}
            activeOpacity={0.84}
          >
            <LinearGradient
              colors={['#4A8A62', '#3E6B50', '#2C4D38']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Get Started</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </Animated.View>
  );
}

// ─── Glass card styles ────────────────────────────────────────────────────────
const glass = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: SPACING.xxl,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    // Android
    elevation: 10,
    flex: 1,
    justifyContent: 'center',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: RADIUS.xxl,
    right: RADIUS.xxl,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.30)',
  },
});

// ─── Pill styles ──────────────────────────────────────────────────────────────
const pill = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: RADIUS.full,
    paddingVertical: 7,
    paddingHorizontal: SPACING.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6DDBA0',
  },
  text: {
    ...FONT.labelSmall,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'none',
    letterSpacing: 0.2,
    fontSize: 12,
  },
});

// ─── Screen styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A1F14',
  },

  // Orbs
  orb1: {
    position: 'absolute',
    top: -height * 0.12,
    right: -width * 0.25,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: 'rgba(62,107,80,0.28)',
  },
  orb2: {
    position: 'absolute',
    bottom: height * 0.12,
    left: -width * 0.3,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: 'rgba(44,70,56,0.32)',
  },
  orb3: {
    position: 'absolute',
    bottom: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(109,219,160,0.07)',
  },

  // Layout
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },

  // Logo row
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  logoMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(109,219,160,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(109,219,160,0.12)',
  },
  logoMarkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6DDBA0',
  },
  wordmark: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#FFFFFF',
  },

  // Glass card interior
  mainCard: {},
  headline: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.2,
    lineHeight: 44,
    marginBottom: SPACING.md,
  },
  subhead: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.60)',
    lineHeight: 24,
  },
  divider: {
    width: 36,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: 'rgba(109,219,160,0.4)',
    marginVertical: SPACING.xl,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  // CTA
  ctaWrap: {
    gap: SPACING.md,
  },
  ctaBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#3E6B50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    // Android — elevation won't show shadow color but adds depth
    elevation: 10,
  },
  ctaGradient: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  ctaArrow: {
    fontSize: 17,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.75)',
  },
});