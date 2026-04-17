// src/screens/auth/WelcomeScreen.jsx
// Muted sage-green + frosted glass — matches questionnaire palette exactly.

import { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Camera, ScanLine, ChefHat, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RADIUS, SPACING, FONT } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ICON_STROKE } from '../../constants/icons';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Same palette as QuestionnaireScreen ──────────────────────────────────────
const BG_TOP  = '#1A1F1C';
const BG_MID  = '#222A26';
const BG_BOT  = '#2A3430';
const TEXT_ON  = 'rgba(255,255,255,0.90)';
const TEXT_MUT = 'rgba(255,255,255,0.55)';

const FEATURES = [
  { Icon: Camera,   label: 'Snap ingredients',  sub: 'Point at your fridge' },
  { Icon: ScanLine, label: 'AI identification', sub: 'Detects what you have' },
  { Icon: ChefHat,  label: 'Instant recipes',   sub: 'Ready in seconds' },
];

// ─── Glass card ───────────────────────────────────────────────────────────────
function GlassCard({ style, children }) {
  return (
    <View style={[gc.card, style]}>
      <View style={gc.shimmer} />
      {children}
    </View>
  );
}

const gc = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Staggered entrance
  const heroOp   = useRef(new Animated.Value(0)).current;
  const heroY    = useRef(new Animated.Value(18)).current;
  const feat1Op  = useRef(new Animated.Value(0)).current;
  const feat2Op  = useRef(new Animated.Value(0)).current;
  const feat3Op  = useRef(new Animated.Value(0)).current;
  const ctaOp    = useRef(new Animated.Value(0)).current;
  const ctaY     = useRef(new Animated.Value(14)).current;
  const orb1Y    = useRef(new Animated.Value(0)).current;
  const orb2Y    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orb float
    Animated.loop(Animated.sequence([
      Animated.timing(orb1Y, { toValue: -12, duration: 3000, useNativeDriver: true }),
      Animated.timing(orb1Y, { toValue:   0, duration: 3000, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(orb2Y, { toValue: 10, duration: 3600, useNativeDriver: true }),
      Animated.timing(orb2Y, { toValue:  0, duration: 3600, useNativeDriver: true }),
    ])).start();

    // Entrance
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(heroOp, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(heroY,  { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      Animated.stagger(100, [
        Animated.timing(feat1Op, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(feat2Op, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(feat3Op, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(ctaOp, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.spring(ctaY,  { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const featAnims = [feat1Op, feat2Op, feat3Op];

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* Background */}
      <LinearGradient
        colors={[BG_TOP, BG_MID, BG_BOT]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Orbs */}
      <Animated.View style={[s.orb1, { transform: [{ translateY: orb1Y }] }]} />
      <Animated.View style={[s.orb2, { transform: [{ translateY: orb2Y }] }]} />

      {/* Content */}
      <View style={[s.content, { paddingTop: insets.top + SPACING.xl, paddingBottom: insets.bottom + SPACING.xxl }]}>

        {/* Logo */}
        <View style={s.logoRow}>
          <View style={s.logoDot} />
          <Text style={s.logoText}>FRIDGR</Text>
        </View>

        {/* Hero text */}
        <Animated.View style={[s.heroWrap, { opacity: heroOp, transform: [{ translateY: heroY }] }]}>
          <GlassCard style={s.heroCard}>
            <Text style={s.heroTitle}>Your Personal{'\n'}AI Chef</Text>
            <Text style={s.heroSub}>
              Snap your fridge. Get instant recipes tailored to what you have.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Feature rows */}
        <View style={s.features}>
          {FEATURES.map(({ Icon, label, sub }, i) => (
            <Animated.View key={label} style={{
              opacity: featAnims[i],
              transform: [{ translateY: featAnims[i].interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
            }}>
              <GlassCard style={s.featureRow}>
                <View style={s.featureIcon}>
                  <Icon size={16} color={TEXT_ON} strokeWidth={ICON_STROKE} />
                </View>
                <View style={s.featureText}>
                  <Text style={s.featureLabel}>{label}</Text>
                  <Text style={s.featureSub}>{sub}</Text>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <Animated.View style={[s.ctaWrap, { opacity: ctaOp, transform: [{ translateY: ctaY }] }]}>
          <Pressable
            style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] }]}
            onPress={() => navigation.navigate(ROUTES.SIGN_UP)}
          >
            <LinearGradient
              colors={PREMIUM_CTA_VERTICAL}
              start={PREMIUM_CTA_VERTICAL_START}
              end={PREMIUM_CTA_VERTICAL_END}
              style={s.primaryGrad}
            >
              <Text style={s.primaryText}>Get Started</Text>
              <ArrowRight size={16} color="#FFFFFF" strokeWidth={ICON_STROKE} />
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => pressed && { opacity: 0.6 }}
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
          >
            <Text style={s.secondaryText}>
              Already have an account?{'  '}
              <Text style={s.secondaryLink}>Sign in</Text>
            </Text>
          </Pressable>

          <Text style={s.legal}>
            By continuing you agree to our Terms &amp; Privacy Policy
          </Text>
        </Animated.View>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_TOP },

  orb1: {
    position: 'absolute',
    top: -60,
    right: -70,
    width: SCREEN_W * 0.6,
    height: SCREEN_W * 0.6,
    borderRadius: SCREEN_W * 0.3,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  orb2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: SCREEN_W * 0.5,
    height: SCREEN_W * 0.5,
    borderRadius: SCREEN_W * 0.25,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xl,
  },
  logoDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  logoText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: TEXT_ON,
    letterSpacing: 1.4,
  },

  // Hero card
  heroWrap: { marginBottom: SPACING.xl },
  heroCard: { padding: SPACING.xl },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: SPACING.sm,
  },
  heroSub: {
    fontSize: 14,
    color: TEXT_MUT,
    lineHeight: 21,
  },

  // Features
  features: { gap: SPACING.sm },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, gap: 1 },
  featureLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: TEXT_ON,
  },
  featureSub: {
    fontSize: 11,
    color: TEXT_MUT,
  },

  // CTA
  ctaWrap: { gap: 10, alignItems: 'center' },
  primaryBtn: {
    alignSelf: 'stretch',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryGrad: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryText: { fontSize: 15, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF' },

  secondaryText: { fontSize: 13, color: TEXT_MUT },
  secondaryLink: { fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_ON },

  legal: {
    fontSize: 10,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.28)',
    lineHeight: 15,
  },
});
