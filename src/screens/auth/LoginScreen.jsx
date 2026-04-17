// src/screens/auth/LoginScreen.jsx
// Completely new structure: centered layout, glass inputs floating on dark charcoal.
// No form card — fields are first-class citizens of the screen.

import { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, TextInput, Animated,
  KeyboardAvoidingView, ScrollView, Platform,
  ActivityIndicator, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { SPACING, RADIUS, FONT } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ICON_STROKE } from '../../constants/icons';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const { width: SCREEN_W } = Dimensions.get('window');

const BG_TOP  = '#1A1F1C';
const BG_MID  = '#222A26';
const BG_BOT  = '#2A3430';
const TEXT_PRI = 'rgba(255,255,255,0.92)';
const TEXT_SEC = 'rgba(255,255,255,0.50)';
const G_TICK   = '#4A7C5E';

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
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 5,
  },
  shimmer: {
    position: 'absolute', top: 0, left: 20, right: 20,
    height: 1, backgroundColor: 'rgba(255,255,255,0.18)',
  },
});

export default function LoginScreen({ navigation }) {
  const { login, loading, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [emailFocused, setEmailFocused]       = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [localErr, setLocalErr]       = useState('');
  const [fieldErr, setFieldErr]       = useState({ email: '', password: '' });
  const passwordRef = useRef(null);

  const fadeOp = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(24)).current;
  const orbY   = useRef(new Animated.Value(0)).current;

  useEffect(() => () => clearError(), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeOp, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideY, { toValue: 0, tension: 55, friction: 8, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.timing(orbY, { toValue: -12, duration: 3200, useNativeDriver: true }),
      Animated.timing(orbY, { toValue:   0, duration: 3200, useNativeDriver: true }),
    ])).start();
  }, []);

  const handleLogin = async () => {
    setLocalErr('');
    setFieldErr({ email: '', password: '' });
    const emailTrim = email.trim();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) next.email = 'Enter a valid email';
    if (password.length < 6) next.password = 'At least 6 characters';
    if (Object.keys(next).length) { setFieldErr(next); return; }
    const result = await login(emailTrim, password);
    if (!result.success) setLocalErr(result.error || 'Login failed.');
  };

  const displayError = localErr || error;

  return (
    <View style={s.root}>
      <LinearGradient colors={[BG_TOP, BG_MID, BG_BOT]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <Animated.View style={[s.orb, { transform: [{ translateY: orbY }] }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Back button — top left */}
        <View style={[s.topBar, { paddingTop: insets.top + SPACING.sm }]}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <GlassCard style={s.backBtn}>
              <ArrowLeft size={18} color={TEXT_PRI} strokeWidth={ICON_STROKE} />
            </GlassCard>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={{ opacity: fadeOp, transform: [{ translateY: slideY }] }}>

            {/* ── Big welcome section ────────────────────────────────────── */}
            <View style={s.heroSection}>
              <View style={s.logoRow}>
                <View style={s.logoDot} />
                <Text style={s.logoText}>FRIDGR</Text>
              </View>
              <Text style={s.heroTitle}>Welcome{'\n'}back.</Text>
              <Text style={s.heroSub}>Sign in to pick up where you left off.</Text>
            </View>

            {/* ── Error ──────────────────────────────────────────────────── */}
            {displayError ? (
              <View style={s.errorBanner}>
                <AlertCircle size={14} color="#FF8888" strokeWidth={ICON_STROKE} />
                <Text style={s.errorText}>{displayError}</Text>
              </View>
            ) : null}

            {/* ── Email input — standalone glass ─────────────────────────── */}
            <View style={s.fieldWrap}>
              <Text style={s.label}>Email</Text>
              <GlassCard style={[
                s.inputRow,
                emailFocused && { borderColor: 'rgba(255,255,255,0.35)' },
                fieldErr.email && { borderColor: 'rgba(184,64,64,0.6)' },
              ]}>
                <Mail size={16} color={emailFocused ? TEXT_PRI : TEXT_SEC} strokeWidth={ICON_STROKE} />
                <TextInput
                  style={s.input}
                  value={email}
                  onChangeText={t => { setEmail(t); if (fieldErr.email) setFieldErr(f => ({ ...f, email: '' })); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@example.com"
                  placeholderTextColor={TEXT_SEC}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </GlassCard>
              {fieldErr.email ? <Text style={s.fieldErr}>{fieldErr.email}</Text> : null}
            </View>

            {/* ── Password input — standalone glass ──────────────────────── */}
            <View style={s.fieldWrap}>
              <View style={s.labelRow}>
                <Text style={s.label}>Password</Text>
                <Pressable onPress={() => navigation.navigate(ROUTES.FORGOT_PW)}>
                  <Text style={s.forgotLink}>Forgot?</Text>
                </Pressable>
              </View>
              <GlassCard style={[
                s.inputRow,
                passwordFocused && { borderColor: 'rgba(255,255,255,0.35)' },
                fieldErr.password && { borderColor: 'rgba(184,64,64,0.6)' },
              ]}>
                <Lock size={16} color={passwordFocused ? TEXT_PRI : TEXT_SEC} strokeWidth={ICON_STROKE} />
                <TextInput
                  ref={passwordRef}
                  style={s.input}
                  value={password}
                  onChangeText={t => { setPassword(t); if (fieldErr.password) setFieldErr(f => ({ ...f, password: '' })); }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Enter your password"
                  placeholderTextColor={TEXT_SEC}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable onPress={() => setShowPw(v => !v)} hitSlop={8} style={{ padding: 4 }}>
                  {showPw
                    ? <EyeOff size={16} color={TEXT_SEC} strokeWidth={ICON_STROKE} />
                    : <Eye size={16} color={TEXT_SEC} strokeWidth={ICON_STROKE} />}
                </Pressable>
              </GlassCard>
              {fieldErr.password ? <Text style={s.fieldErr}>{fieldErr.password}</Text> : null}
            </View>

            {/* ── CTA ───────────────────────────────────────────────────── */}
            <Pressable
              style={({ pressed }) => [s.cta, loading && { opacity: 0.5 }, pressed && !loading && { opacity: 0.88, transform: [{ scale: 0.985 }] }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={PREMIUM_CTA_VERTICAL}
                start={PREMIUM_CTA_VERTICAL_START}
                end={PREMIUM_CTA_VERTICAL_END}
                style={s.ctaGrad}
              >
                {loading
                  ? <ActivityIndicator color="#FFFFFF" size="small" />
                  : <Text style={s.ctaText}>Sign In</Text>}
              </LinearGradient>
            </Pressable>

            {/* ── Divider ───────────────────────────────────────────────── */}
            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerLabel}>or continue with</Text>
              <View style={s.dividerLine} />
            </View>

            {/* ── Social — horizontal glass pills ─────────────────────── */}
            <View style={s.socialRow}>
              <Pressable style={({ pressed }) => [s.socialBtn, pressed && { opacity: 0.7 }]}>
                <GlassCard style={s.socialGlass}>
                  <Text style={s.socialLabel}>Google</Text>
                </GlassCard>
              </Pressable>
              <Pressable style={({ pressed }) => [s.socialBtn, pressed && { opacity: 0.7 }]}>
                <GlassCard style={s.socialGlass}>
                  <Text style={s.socialLabel}>Apple</Text>
                </GlassCard>
              </Pressable>
            </View>

            {/* ── Footer link ───────────────────────────────────────────── */}
            <Pressable style={s.footer} onPress={() => navigation.navigate(ROUTES.SIGN_UP)}>
              <Text style={s.footerText}>
                Don't have an account?{' '}
                <Text style={s.footerLink}>Sign up</Text>
              </Text>
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_TOP },

  orb: {
    position: 'absolute', top: -60, left: -50,
    width: SCREEN_W * 0.55, height: SCREEN_W * 0.55,
    borderRadius: SCREEN_W * 0.275,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  topBar: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  backBtn: {
    width: 38, height: 38, borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { paddingHorizontal: SPACING.xxl },

  // Hero — big bold left-aligned
  heroSection: { marginBottom: SPACING.xxl, gap: SPACING.sm },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md },
  logoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: G_TICK },
  logoText: { fontSize: 12, fontFamily: 'Poppins_400Regular', fontWeight: '400', letterSpacing: 1.6, color: TEXT_SEC },
  heroTitle: {
    fontSize: 36, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF',
    letterSpacing: -1.2, lineHeight: 42,
  },
  heroSub: { fontSize: 15, color: TEXT_SEC, lineHeight: 22 },

  // Error
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg,
    backgroundColor: 'rgba(184,64,64,0.15)', borderWidth: 1,
    borderColor: 'rgba(184,64,64,0.30)',
  },
  errorText: { fontSize: 12, flex: 1, color: '#FF8888' },

  // Fields — each is its own glass row, no card wrapper
  fieldWrap: { gap: 6, marginBottom: SPACING.lg },
  label: { fontFamily: 'Poppins_400Regular', fontWeight: '400', fontSize: 12, color: TEXT_SEC, letterSpacing: 0.3, marginLeft: 4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotLink: { fontFamily: 'Poppins_400Regular', fontWeight: '400', fontSize: 12, color: TEXT_PRI },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, height: 52,
    borderRadius: RADIUS.xl,
  },
  input: { flex: 1, fontSize: 14, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF', paddingVertical: 0 },
  fieldErr: { fontSize: 11, color: '#FF8888', marginLeft: 4, marginTop: 2 },

  // CTA
  cta: {
    borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: SPACING.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30, shadowRadius: 14, elevation: 8,
  },
  ctaGrad: { height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.full },
  ctaText: { fontSize: 15, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF', letterSpacing: 0.2 },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.12)' },
  dividerLabel: { fontSize: 11, color: TEXT_SEC, letterSpacing: 0.4 },

  // Social — two equal glass pills side by side
  socialRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xxl },
  socialBtn: { flex: 1 },
  socialGlass: {
    height: 48, alignItems: 'center', justifyContent: 'center',
    borderRadius: RADIUS.xl,
  },
  socialLabel: { fontSize: 13, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },

  // Footer
  footer: { alignItems: 'center' },
  footerText: { fontSize: 13, color: TEXT_SEC },
  footerLink: { fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },
});
