// src/screens/auth/WelcomeScreen.jsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Camera, ScanLine, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ICON_STROKE } from '../../constants/icons';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import {
  PREMIUM,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const { width } = Dimensions.get('window');

const FEATURES = [
  { Icon: Camera, label: 'Snap ingredients' },
  { Icon: ScanLine, label: 'AI identifies them' },
  { Icon: Sparkles, label: 'Get instant recipes' },
];

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 640, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 640, useNativeDriver: true }),
      ]),
      Animated.timing(ctaAnim, { toValue: 1, duration: 380, useNativeDriver: true, delay: 80 }),
    ]).start();
  }, [fadeAnim, slideAnim, ctaAnim]);

  return (
    <PremiumScreenShell>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <Animated.View
          style={[
            styles.heroInner,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.badge}>
            <Sparkles size={12} color="#FACC15" strokeWidth={ICON_STROKE} />
            <Text style={styles.badgeText}>AI-powered cooking</Text>
          </View>

          <View style={styles.logoRow}>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>FRIDGR</Text>
          </View>

          <Text style={styles.heroTitle}>Cook with what you already have</Text>
          <Text style={styles.heroSubtitle}>
            Turn ingredients into recipes in seconds — less waste, more flavor.
          </Text>

          <View style={styles.features}>
            {FEATURES.map(({ Icon, label }, i) => (
              <View key={i} style={styles.featurePill}>
                <Icon size={16} color="rgba(249,250,251,0.95)" strokeWidth={ICON_STROKE} />
                <Text style={styles.featureText}>{label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.bottom,
          {
            opacity: ctaAnim,
            backgroundColor: PREMIUM.footerBg,
            paddingBottom: insets.bottom + SPACING.lg,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}
          onPress={() => navigation.navigate(ROUTES.SIGN_UP)}
        >
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryText}>Create account</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.navigate(ROUTES.LOGIN)}
        >
          <Text style={styles.secondaryText}>
            Already have an account?{' '}
            <Text style={styles.secondaryLink}>Sign in</Text>
          </Text>
        </Pressable>

        <Text style={styles.legal}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </Animated.View>
    </PremiumScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 72,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xxl,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: width * 0.05,
    right: -width * 0.15,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: 'rgba(250,204,21,0.08)',
  },
  heroInner: {
    gap: SPACING.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  badgeText: {
    ...FONT.labelSmall,
    color: 'rgba(6,64,43,0.88)',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  logoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: SPACING.sm },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FACC15',
    marginTop: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#06402B',
    letterSpacing: -1.2,
  },
  heroTitle: {
    ...FONT.hero,
    color: '#06402B',
    marginTop: SPACING.sm,
  },
  heroSubtitle: {
    ...FONT.body,
    color: 'rgba(6,64,43,0.62)',
    lineHeight: 24,
    maxWidth: 360,
  },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  featureText: { ...FONT.bodySmallMedium, color: 'rgba(6,64,43,0.9)' },
  bottom: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    borderTopWidth: 1,
    borderTopColor: PREMIUM.glassBorder,
    ...SHADOWS.lg,
  },
  primaryBtn: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.green,
  },
  primaryGradient: {
    paddingVertical: SPACING.lg + 2,
    alignItems: 'center',
  },
  primaryText: { ...FONT.h5, color: '#06402B', fontWeight: '700' },
  secondaryBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  secondaryText: { ...FONT.body, color: PREMIUM.textMuted },
  secondaryLink: { fontWeight: '700', color: PREMIUM.accent },
  legal: { ...FONT.caption, textAlign: 'center', marginTop: SPACING.sm, color: 'rgba(6,64,43,0.4)' },
});
