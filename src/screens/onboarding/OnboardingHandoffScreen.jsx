// src/screens/onboarding/OnboardingHandoffScreen.jsx
// Final onboarding step — confirms profile is saved, then hands off to the main app.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ICON_STROKE } from '../../constants/icons';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import {
  PREMIUM,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
  PREMIUM_ICON_RING_GRADIENT,
} from '../../constants/premiumScreenTheme';

export default function OnboardingHandoffScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useOnboarding();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.spring(rise, { toValue: 0, friction: 8, tension: 65, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <PremiumScreenShell>
      <Animated.View
        style={[
          styles.content,
          {
            paddingTop: insets.top + SPACING.xl,
            paddingBottom: insets.bottom + SPACING.lg,
            opacity: fade,
            transform: [{ translateY: rise }],
          },
        ]}
      >
        <View style={styles.iconRing}>
          <LinearGradient colors={PREMIUM_ICON_RING_GRADIENT} style={styles.iconGrad}>
            <Check size={40} color={PREMIUM.accent} strokeWidth={ICON_STROKE + 1} />
          </LinearGradient>
        </View>

        <Text style={styles.title}>You are all set</Text>
        <Text style={styles.subtitle}>
          Your preferences are saved. Start scanning ingredients or browse recipes — FRIDGR will match what you actually eat.
        </Text>

        <Pressable
          onPress={completeOnboarding}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}
        >
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={styles.ctaGrad}
          >
            <Text style={styles.ctaText}>Enter FRIDGR</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </PremiumScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconRing: {
    borderRadius: 999,
    padding: 3,
    marginBottom: SPACING.xl,
    backgroundColor: 'rgba(74,222,128,0.2)',
    ...SHADOWS.green,
  },
  iconGrad: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: PREMIUM.text,
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...FONT.body,
    color: PREMIUM.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
    marginBottom: SPACING.xxl,
  },
  cta: {
    alignSelf: 'stretch',
    maxWidth: 400,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.green,
  },
  ctaGrad: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { ...FONT.h5, color: '#FFFFFF', fontWeight: '700' },
});
