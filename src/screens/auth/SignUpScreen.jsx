// src/screens/auth/SignUpScreen.jsx
// Completely new structure: compact top-aligned form with inline glass fields,
// progress feel, and bottom CTA. Dark charcoal palette.

import { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, TextInput, Animated,
  KeyboardAvoidingView, ScrollView, Platform,
  ActivityIndicator, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, AlertCircle, User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react-native';
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

export default function SignUpScreen({ navigation }) {
  const { signUp, loading, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [agree, setAgree]       = useState(false);
  const [nameFocused, setNameFocused]         = useState(false);
  const [emailFocused, setEmailFocused]       = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const [fieldErr, setFieldErr] = useState({ name: '', email: '', password: '' });

  const emailRef    = useRef(null);
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
      Animated.timing(orbY, { toValue: -10, duration: 3600, useNativeDriver: true }),
      Animated.timing(orbY, { toValue:   0, duration: 3600, useNativeDriver: true }),
    ])).start();
  }, []);

  const handleSignUp = async () => {
    setLocalErr('');
    setFieldErr({ name: '', email: '', password: '' });
    const next = {};
    if (!name.trim()) next.name = 'Enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email';
    if (password.length < 6) next.password = 'At least 6 characters';
    if (Object.keys(next).length) { setFieldErr(next); return; }
    if (!agree) { setLocalErr('Please agree to the Terms and Privacy Policy.'); return; }
    const result = await signUp(name.trim(), email.trim(), password);
    if (!result.success) setLocalErr(result.error || 'Sign up failed.');
  };

  const displayError = localErr || error;

  const pwLen = password.length;
  const strengthLevel = pwLen === 0 ? 0 : pwLen < 6 ? 1 : pwLen < 10 ? 2 : 3;
  const strengthColor = ['transparent', '#FF6B6B', '#FFB84D', '#6DDBA0'][strengthLevel];
  const strengthLabel = ['', 'Too short', 'Good', 'Strong'][strengthLevel];

  return (
    <View style={s.root}>
      <LinearGradient colors={[BG_TOP, BG_MID, BG_BOT]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <Animated.View style={[s.orb, { transform: [{ translateY: orbY }] }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header — back + inline title */}
        <View style={[s.headerBar, { paddingTop: insets.top + SPACING.sm }]}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <GlassCard style={s.backBtn}>
              <ArrowLeft size={18} color={TEXT_PRI} strokeWidth={ICON_STROKE} />
            </GlassCard>
          </Pressable>
          <Text style={s.headerTitle}>Create account</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={{ opacity: fadeOp, transform: [{ translateY: slideY }] }}>

            {/* Tagline */}
            <Text style={s.tagline}>Join thousands cooking smarter every day.</Text>

            {/* Error */}
            {displayError ? (
              <View style={s.errorBanner}>
                <AlertCircle size={14} color="#FF8888" strokeWidth={ICON_STROKE} />
                <Text style={s.errorText}>{displayError}</Text>
              </View>
            ) : null}

            {/* ── All fields in a single glass card ────────────────────── */}
            <GlassCard style={s.formCard}>

              {/* Name */}
              <View style={s.fieldInCard}>
                <View style={[
                  s.inputInner,
                  nameFocused && s.inputFocused,
                  fieldErr.name && s.inputError,
                ]}>
                  <User size={16} color={nameFocused ? TEXT_PRI : TEXT_SEC} strokeWidth={ICON_STROKE} />
                  <TextInput
                    style={s.input}
                    value={name}
                    onChangeText={t => { setName(t); if (fieldErr.name) setFieldErr(f => ({ ...f, name: '' })); }}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    placeholder="Full name"
                    placeholderTextColor={TEXT_SEC}
                    autoCapitalize="words"
                    textContentType="name"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                </View>
                {fieldErr.name ? <Text style={s.fieldErr}>{fieldErr.name}</Text> : null}
              </View>

              <View style={s.separator} />

              {/* Email */}
              <View style={s.fieldInCard}>
                <View style={[
                  s.inputInner,
                  emailFocused && s.inputFocused,
                  fieldErr.email && s.inputError,
                ]}>
                  <Mail size={16} color={emailFocused ? TEXT_PRI : TEXT_SEC} strokeWidth={ICON_STROKE} />
                  <TextInput
                    ref={emailRef}
                    style={s.input}
                    value={email}
                    onChangeText={t => { setEmail(t); if (fieldErr.email) setFieldErr(f => ({ ...f, email: '' })); }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="Email address"
                    placeholderTextColor={TEXT_SEC}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                </View>
                {fieldErr.email ? <Text style={s.fieldErr}>{fieldErr.email}</Text> : null}
              </View>

              <View style={s.separator} />

              {/* Password */}
              <View style={s.fieldInCard}>
                <View style={[
                  s.inputInner,
                  passwordFocused && s.inputFocused,
                  fieldErr.password && s.inputError,
                ]}>
                  <Lock size={16} color={passwordFocused ? TEXT_PRI : TEXT_SEC} strokeWidth={ICON_STROKE} />
                  <TextInput
                    ref={passwordRef}
                    style={s.input}
                    value={password}
                    onChangeText={t => { setPassword(t); if (fieldErr.password) setFieldErr(f => ({ ...f, password: '' })); }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Password (min. 6 chars)"
                    placeholderTextColor={TEXT_SEC}
                    secureTextEntry={!showPw}
                    autoCapitalize="none"
                    textContentType="newPassword"
                    returnKeyType="done"
                    onSubmitEditing={handleSignUp}
                  />
                  <Pressable onPress={() => setShowPw(v => !v)} hitSlop={8} style={{ padding: 4 }}>
                    {showPw
                      ? <EyeOff size={16} color={TEXT_SEC} strokeWidth={ICON_STROKE} />
                      : <Eye size={16} color={TEXT_SEC} strokeWidth={ICON_STROKE} />}
                  </Pressable>
                </View>
                {fieldErr.password ? <Text style={s.fieldErr}>{fieldErr.password}</Text> : null}
                {pwLen > 0 && (
                  <View style={s.strength}>
                    <View style={s.strengthBar}>
                      {[1, 2, 3].map(i => (
                        <View key={i} style={[s.strengthSeg, { backgroundColor: i <= strengthLevel ? strengthColor : 'rgba(255,255,255,0.10)' }]} />
                      ))}
                    </View>
                    <Text style={[s.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                  </View>
                )}
              </View>
            </GlassCard>

            {/* Agree checkbox — outside card */}
            <Pressable style={({ pressed }) => [s.agreeRow, pressed && { opacity: 0.75 }]} onPress={() => setAgree(v => !v)}>
              <View style={[s.checkbox, agree && { backgroundColor: G_TICK, borderColor: G_TICK }]}>
                {agree && <Check size={11} color="#FFFFFF" strokeWidth={ICON_STROKE + 0.5} />}
              </View>
              <Text style={s.agreeText}>
                I agree to the{' '}
                <Text style={s.agreeLink}>Terms</Text>
                {' and '}
                <Text style={s.agreeLink}>Privacy Policy</Text>
              </Text>
            </Pressable>

            {/* CTA */}
            <Pressable
              style={({ pressed }) => [s.cta, loading && { opacity: 0.5 }, pressed && !loading && { opacity: 0.88, transform: [{ scale: 0.985 }] }]}
              onPress={handleSignUp}
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
                  : <Text style={s.ctaText}>Create Account</Text>}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerLabel}>or continue with</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Social — full-width stacked glass pills */}
            <View style={s.socialStack}>
              <Pressable style={({ pressed }) => pressed && { opacity: 0.7 }}>
                <GlassCard style={s.socialPill}>
                  <Text style={s.socialText}>Continue with Google</Text>
                </GlassCard>
              </Pressable>
              <Pressable style={({ pressed }) => pressed && { opacity: 0.7 }}>
                <GlassCard style={s.socialPill}>
                  <Text style={s.socialText}>Continue with Apple</Text>
                </GlassCard>
              </Pressable>
            </View>

            {/* Footer */}
            <Pressable style={s.footer} onPress={() => navigation.navigate(ROUTES.LOGIN)}>
              <Text style={s.footerText}>
                Already have an account?{' '}
                <Text style={s.footerLink}>Sign in</Text>
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
    position: 'absolute', bottom: -40, right: -60,
    width: SCREEN_W * 0.5, height: SCREEN_W * 0.5,
    borderRadius: SCREEN_W * 0.25,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  // Header — back + centered title
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI, letterSpacing: -0.2,
  },

  scroll: { paddingHorizontal: SPACING.xxl },

  tagline: {
    fontSize: 14, color: TEXT_SEC, lineHeight: 21,
    marginBottom: SPACING.xl,
  },

  // Error
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg,
    backgroundColor: 'rgba(184,64,64,0.15)', borderWidth: 1,
    borderColor: 'rgba(184,64,64,0.30)',
  },
  errorText: { fontSize: 12, flex: 1, color: '#FF8888' },

  // Single glass card housing all fields — like iOS Settings grouped rows
  formCard: {
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: SPACING.lg,
  },
  fieldInCard: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  inputInner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    height: 46,
  },
  inputFocused: {
    // subtle left bar
  },
  inputError: {},
  input: { flex: 1, fontSize: 14, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF', paddingVertical: 0 },
  fieldErr: { fontSize: 11, color: '#FF8888', marginTop: 4, marginLeft: 28 },

  // Strength
  strength: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 4, marginLeft: 28 },
  strengthBar: { flex: 1, flexDirection: 'row', gap: 3 },
  strengthSeg: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: 10, fontFamily: 'Poppins_400Regular', fontWeight: '400' },

  // Agree
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.xl },
  checkbox: {
    width: 22, height: 22, borderRadius: RADIUS.xs, borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  agreeText: { flex: 1, lineHeight: 18, fontSize: 12, color: TEXT_SEC },
  agreeLink: { fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },

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

  // Social — stacked full-width pills (different from login's side-by-side)
  socialStack: { gap: SPACING.sm, marginBottom: SPACING.xxl },
  socialPill: {
    height: 48, alignItems: 'center', justifyContent: 'center',
    borderRadius: RADIUS.xl,
  },
  socialText: { fontSize: 13, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },

  // Footer
  footer: { alignItems: 'center' },
  footerText: { fontSize: 13, color: TEXT_SEC },
  footerLink: { fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },
});
