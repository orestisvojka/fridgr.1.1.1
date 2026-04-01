// src/screens/auth/WelcomeScreen.jsx
import { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
  Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Camera, ScanLine, ChefHat, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ICON_STROKE } from '../../constants/icons';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';
import { DEFAULT_RECIPE_IMAGE } from '../../data/recipeImages';

const { height } = Dimensions.get('window');
// Smaller image — leaves more room for content on small screens
const IMG_HEIGHT = height * 0.40;

const FEATURES = [
  { Icon: Camera,   label: 'Snap ingredients',  sub: 'Point at your fridge' },
  { Icon: ScanLine, label: 'AI identification', sub: 'Detects what you have' },
  { Icon: ChefHat,  label: 'Instant recipes',   sub: 'Ready in seconds' },
];

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 550, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Image section ── */}
      <View style={[styles.imageSection, { height: IMG_HEIGHT }]}>
        <Image
          source={{ uri: DEFAULT_RECIPE_IMAGE }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#F9F7F2']}
          locations={[0.65, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Logo */}
        <View style={[styles.logoBadge, { top: insets.top + 14 }]}>
          <View style={styles.logoDot} />
          <Text style={styles.logoText}>FRIDGR</Text>
        </View>
      </View>

      {/* ── Content panel — fills remaining space, buttons pinned to bottom ── */}
      <Animated.View
        style={[styles.panel, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Top: text + features */}
        <View style={styles.topContent}>
          <Text style={styles.heroTitle}>Your Personal{'\n'}AI Chef</Text>
          <Text style={styles.heroSubtitle}>
            Snap your fridge. Get instant recipes tailored to what you have.
          </Text>

          <View style={styles.featuresWrap}>
            {FEATURES.map(({ Icon, label, sub }) => (
              <View key={label} style={styles.featureRow}>
                <View style={styles.iconCircle}>
                  <Icon size={14} color="#3E6B50" strokeWidth={ICON_STROKE + 0.3} />
                </View>
                <View style={styles.featureTextWrap}>
                  <Text style={styles.featureLabel}>{label}</Text>
                  <Text style={styles.featureSub}>{sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom: CTA — always visible, pinned to bottom */}
        <View style={[styles.ctaSection, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
            ]}
            onPress={() => navigation.navigate(ROUTES.SIGN_UP)}
          >
            <LinearGradient
              colors={PREMIUM_CTA_VERTICAL}
              start={PREMIUM_CTA_VERTICAL_START}
              end={PREMIUM_CTA_VERTICAL_END}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryText}>Get Started — It's Free</Text>
              <ArrowRight size={16} color="#FFFFFF" strokeWidth={ICON_STROKE} />
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.6 }]}
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
          >
            <Text style={styles.secondaryText}>
              Already have an account?{'  '}
              <Text style={styles.secondaryLink}>Sign in</Text>
            </Text>
          </Pressable>

          <Text style={styles.legal}>
            By continuing you agree to our Terms &amp; Privacy Policy
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9F7F2' },

  imageSection: { width: '100%', backgroundColor: '#E8E4DC' },

  logoBadge: {
    position: 'absolute', left: 20,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.30)',
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: RADIUS.full,
  },
  logoDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#4ADE80' },
  logoText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.4 },

  // Panel fills everything below the image, pinned layout
  panel: {
    flex: 1,
    backgroundColor: '#F9F7F2',
    paddingHorizontal: 20,
    paddingTop: 18,
    justifyContent: 'space-between', // top content + bottom CTA always visible
  },

  topContent: { gap: 0 },

  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D3B26',
    letterSpacing: -0.6,
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(13,59,38,0.52)',
    lineHeight: 20,
    marginBottom: 14,
  },

  featuresWrap: { gap: 7 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(62,107,80,0.07)',
    ...SHADOWS.xs,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(62,107,80,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureTextWrap: { gap: 1 },
  featureLabel: { fontSize: 12, fontWeight: '700', color: '#0D3B26' },
  featureSub: { fontSize: 10.5, color: 'rgba(13,59,38,0.45)' },

  // CTA section — pinned to bottom
  ctaSection: { gap: 0 },
  primaryBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.green,
    marginBottom: 10,
  },
  primaryGradient: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },

  secondaryBtn: { alignItems: 'center', paddingVertical: 8 },
  secondaryText: { fontSize: 13, color: 'rgba(13,59,38,0.52)' },
  secondaryLink: { fontWeight: '800', color: '#3E6B50' },

  legal: {
    fontSize: 10,
    textAlign: 'center',
    color: 'rgba(13,59,38,0.32)',
    marginTop: 4,
    lineHeight: 15,
  },
});
