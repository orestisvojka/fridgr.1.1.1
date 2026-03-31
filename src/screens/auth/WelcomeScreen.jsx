// src/screens/auth/WelcomeScreen.jsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Camera, ScanLine, ChefHat, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ICON_STROKE } from '../../constants/icons';
import {
  PREMIUM,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';
import { DEFAULT_RECIPE_IMAGE } from '../../data/recipeImages';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { Icon: Camera, label: 'Snap ingredients' },
  { Icon: ScanLine, label: 'AI identification' },
  { Icon: ChefHat, label: 'Instant recipes' },
];

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.timing(ctaAnim, { toValue: 1, duration: 450, useNativeDriver: true, delay: 100 }),
    ]).start();
  }, [fadeAnim, slideAnim, ctaAnim]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F7F2' }}>
      <StatusBar style="dark" />

      {/* 100% Full Screen Background Image */}
      <Image 
        source={{ uri: DEFAULT_RECIPE_IMAGE }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Professional Soft Cream Fade allowing the top 35% of the image to shine clearly */}
      <LinearGradient 
        colors={['transparent', 'rgba(249,247,242,0.6)', 'rgba(249,247,242,0.95)', '#F9F7F2']}
        locations={[0, 0.45, 0.65, 1]}
        style={StyleSheet.absoluteFill} 
      />

      {/* Optional ultra-light blur to ensure text remains 100% crisp without using dark shadows */}
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />

      <View style={styles.hero}>
        <Animated.View
          style={[
            styles.heroInner,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.logoRow}>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>FRIDGR</Text>
          </View>

          <Text style={styles.heroTitle}>Your Personal AI Chef</Text>
          <Text style={styles.heroSubtitle}>
            Take a photo of your fridge and discover incredible meals you can make right now.
          </Text>

          <View style={styles.featuresWrap}>
            {FEATURES.map(({ Icon, label }, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.iconCircle}>
                  <Icon size={18} color="#0D3B26" strokeWidth={ICON_STROKE + 0.5} />
                </View>
                <Text style={styles.featureText}>{label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.bottomWrap,
          {
            opacity: ctaAnim,
            paddingBottom: insets.bottom + SPACING.xl,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={() => navigation.navigate(ROUTES.SIGN_UP)}
        >
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryText}>Get Started</Text>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={ICON_STROKE} />
          </LinearGradient>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.navigate(ROUTES.LOGIN)}
        >
          <Text style={styles.secondaryText}>
            Already have an account?{' '}
            <Text style={styles.secondaryLink}>Sign in</Text>
          </Text>
        </Pressable>

        <Text style={styles.legal}>
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'flex-end', // Pushes content downwards
    paddingBottom: SPACING.xl,
  },
  heroInner: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3E6B50',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0D3B26',
    letterSpacing: -0.5,
  },
  heroTitle: {
    ...FONT.h1,
    color: '#0D3B26',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    ...FONT.body,
    color: 'rgba(13, 59, 38, 0.65)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  featuresWrap: {
    marginTop: SPACING.xxl,
    gap: SPACING.md,
    alignSelf: 'stretch',
    paddingHorizontal: SPACING.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Solid crisp cards to separate from background
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    gap: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: 'rgba(62,107,80,0.06)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(62,107,80,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    ...FONT.bodySemiBold,
    color: '#0D3B26',
    fontSize: 15,
  },
  bottomWrap: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  primaryBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.green,
    marginBottom: SPACING.lg,
  },
  primaryGradient: {
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  primaryText: {
    ...FONT.h5,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  secondaryText: {
    ...FONT.body,
    color: 'rgba(13, 59, 38, 0.6)',
  },
  secondaryLink: {
    fontWeight: '700',
    color: '#3E6B50',
  },
  legal: {
    ...FONT.caption,
    textAlign: 'center',
    marginTop: SPACING.md,
    color: 'rgba(13, 59, 38, 0.4)',
  },
});
