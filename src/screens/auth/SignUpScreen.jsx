// src/screens/auth/SignUpScreen.jsx
import { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, TextInput,
  KeyboardAvoidingView, ScrollView, Platform,
  ActivityIndicator, StyleSheet, Image,
} from 'react-native';
import { ArrowLeft, AlertCircle, User, Mail, Lock, Eye, EyeOff, Check, Smartphone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { SPACING } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { RECIPE_IMAGE_URLS } from '../../data/recipeImages';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const ICON_COLOR = '#9A9A94';
const ACCENT = '#3E6B50';

export default function SignUpScreen({ navigation }) {
  const { signUp, loading, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();
  const C = useThemeColors();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const [fieldErr, setFieldErr] = useState({ name: '', email: '', password: '' });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => () => clearError(), []);

  const handleSignUp = async () => {
    setLocalErr('');
    setFieldErr({ name: '', email: '', password: '' });
    const next = {};
    if (!name.trim()) next.name = 'Enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address';
    if (password.length < 6) next.password = 'Use at least 6 characters';
    if (Object.keys(next).length) { setFieldErr(next); return; }
    if (!agree) { setLocalErr('Please agree to the Terms and Privacy Policy.'); return; }
    const result = await signUp(name.trim(), email.trim(), password);
    if (!result.success) setLocalErr(result.error || 'Sign up failed.');
  };

  const displayError = localErr || error;

  const strengthLevel = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ['transparent', C.error, C.warning, C.success][strengthLevel];
  const strengthLabel = ['', 'Too short', 'Good', 'Strong'][strengthLevel];

  return (
    <View style={styles.root}>
      <Image source={{ uri: RECIPE_IMAGE_URLS.r6 }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(249,247,242,0.3)', 'rgba(249,247,242,0.92)']}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
            onPress={() => navigation.goBack()}
            hitSlop={8}
          >
            <ArrowLeft size={22} color="#1E1E1C" strokeWidth={ICON_STROKE} />
          </Pressable>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>FRIDGR</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start cooking smarter today</Text>

          {displayError ? (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color={C.error} strokeWidth={ICON_STROKE} />
              <Text style={[styles.errorText, { color: C.error }]}>{displayError}</Text>
            </View>
          ) : null}

          {/* Form card */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[
                styles.inputWrap,
                nameFocused && styles.inputWrapFocused,
                fieldErr.name ? styles.inputWrapError : null,
              ]}>
                <User size={18} color={nameFocused ? ACCENT : ICON_COLOR} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={t => { setName(t); if (fieldErr.name) setFieldErr(f => ({ ...f, name: '' })); }}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  placeholder="Your name"
                  placeholderTextColor={ICON_COLOR}
                  autoCapitalize="words"
                  textContentType="name"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
              {fieldErr.name ? <Text style={[styles.fieldError, { color: C.error }]}>{fieldErr.name}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={[
                styles.inputWrap,
                emailFocused && styles.inputWrapFocused,
                fieldErr.email ? styles.inputWrapError : null,
              ]}>
                <Mail size={18} color={emailFocused ? ACCENT : ICON_COLOR} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  value={email}
                  onChangeText={t => { setEmail(t); if (fieldErr.email) setFieldErr(f => ({ ...f, email: '' })); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@example.com"
                  placeholderTextColor={ICON_COLOR}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              {fieldErr.email ? <Text style={[styles.fieldError, { color: C.error }]}>{fieldErr.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[
                styles.inputWrap,
                passwordFocused && styles.inputWrapFocused,
                fieldErr.password ? styles.inputWrapError : null,
              ]}>
                <Lock size={18} color={passwordFocused ? ACCENT : ICON_COLOR} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={t => { setPassword(t); if (fieldErr.password) setFieldErr(f => ({ ...f, password: '' })); }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={ICON_COLOR}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  textContentType="newPassword"
                  autoComplete="password-new"
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
                <Pressable onPress={() => setShowPw(v => !v)} style={styles.eyeBtn} hitSlop={8}>
                  {showPw
                    ? <EyeOff size={18} color={ICON_COLOR} strokeWidth={ICON_STROKE} />
                    : <Eye size={18} color={ICON_COLOR} strokeWidth={ICON_STROKE} />}
                </Pressable>
              </View>
              {fieldErr.password ? <Text style={[styles.fieldError, { color: C.error }]}>{fieldErr.password}</Text> : null}
              {password.length > 0 && (
                <View style={styles.strength}>
                  <View style={styles.strengthBar}>
                    {[1, 2, 3].map(i => (
                      <View
                        key={i}
                        style={[styles.strengthSegment, { backgroundColor: i <= strengthLevel ? strengthColor : '#E4DDD2' }]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                </View>
              )}
            </View>

            {/* Agree */}
            <Pressable style={({ pressed }) => [styles.agreeRow, pressed && { opacity: 0.75 }]} onPress={() => setAgree(v => !v)}>
              <View style={[styles.checkbox, agree && styles.checkboxActive]}>
                {agree && <Check size={12} color="#FFFFFF" strokeWidth={ICON_STROKE + 0.5} />}
              </View>
              <Text style={styles.agreeText}>
                {'I agree to the '}
                <Text style={styles.agreeLink}>Terms of Service</Text>
                {' and '}
                <Text style={styles.agreeLink}>Privacy Policy</Text>
              </Text>
            </Pressable>

            {/* Create Account button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                loading && styles.primaryBtnDisabled,
                pressed && !loading && { opacity: 0.88 },
              ]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <LinearGradient
                colors={PREMIUM_CTA_VERTICAL}
                start={PREMIUM_CTA_VERTICAL_START}
                end={PREMIUM_CTA_VERTICAL_END}
                style={styles.primaryBtnGradient}
              >
                {loading
                  ? <ActivityIndicator color="#FFFFFF" />
                  : <Text style={styles.primaryBtnText}>Create Account</Text>}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.social}>
              <Pressable style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.75 }]}>
                <Text style={styles.socialBtnLabel}>G</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.75 }]}>
                <Smartphone size={20} color="#1E1E1C" strokeWidth={ICON_STROKE} />
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <Pressable style={styles.footer} onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.footerText}>
              {'Already have an account? '}
              <Text style={styles.footerLink}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9F7F2' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  logoBadgeText: { color: '#0D3B26', fontWeight: '800', letterSpacing: 1.5, fontSize: 11 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 48,
  },
  title: { fontSize: 30, fontWeight: '800', color: '#0D3B26', marginBottom: 4 },
  subtitle: { fontSize: 15, color: 'rgba(13,59,38,0.6)', marginBottom: SPACING.lg },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(254,226,226,0.92)',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(220,80,80,0.2)',
  },
  errorText: { fontSize: 13, flex: 1 },
  form: {
    gap: SPACING.md + 4,
    marginBottom: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    width: '90%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  field: { gap: 6 },
  label: { color: '#0D3B26', fontWeight: '700', fontSize: 13, letterSpacing: 0.3 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText: { color: ACCENT, fontWeight: '700', fontSize: 12 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(200,200,200,0.6)',
    paddingHorizontal: SPACING.md,
    height: 52,
  },
  inputWrapFocused: {
    borderColor: ACCENT,
    backgroundColor: '#FFFFFF',
  },
  inputWrapError: {
    borderColor: '#DC2626',
  },
  fieldError: { fontSize: 12, marginTop: 2 },
  inputIcon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#0D3B26',
    paddingVertical: 0,
  },
  eyeBtn: { padding: 4 },
  strength: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 4 },
  strengthBar: { flex: 1, flexDirection: 'row', gap: 3 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '600' },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(62,107,80,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  checkboxActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  agreeText: { color: 'rgba(13,59,38,0.6)', flex: 1, lineHeight: 20, fontSize: 12.5 },
  agreeLink: { color: ACCENT, fontWeight: '700' },
  primaryBtn: {
    borderRadius: 99,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    elevation: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnGradient: { height: 54, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 17, letterSpacing: 0.3 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(13,59,38,0.2)' },
  dividerText: { color: 'rgba(13,59,38,0.5)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  social: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md },
  socialBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(200,200,200,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnLabel: { fontSize: 18, color: '#1E1E1C', fontWeight: '700' },
  footer: { alignItems: 'center', marginTop: SPACING.md },
  footerText: { color: 'rgba(13,59,38,0.6)', fontSize: 14 },
  footerLink: { color: ACCENT, fontWeight: '800' },
});
