// src/screens/auth/LoginScreen.jsx
import { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, TextInput,
  KeyboardAvoidingView, ScrollView, Platform,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { SPACING, RADIUS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

export default function LoginScreen({ navigation }) {
  const { login, loading, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();
  const C = useThemeColors();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const [fieldErr, setFieldErr] = useState({ email: '', password: '' });
  const passwordRef = useRef(null);

  useEffect(() => () => clearError(), []);

  const handleLogin = async () => {
    setLocalErr('');
    setFieldErr({ email: '', password: '' });
    const emailTrim = email.trim();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) next.email = 'Enter a valid email address';
    if (password.length < 6) next.password = 'Use at least 6 characters';
    if (Object.keys(next).length) { setFieldErr(next); return; }
    const result = await login(emailTrim, password);
    if (!result.success) setLocalErr(result.error || 'Login failed.');
  };

  const displayError = localErr || error;
  const ACCENT = C.primary;
  const ICON_C = C.textTertiary;

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <View style={styles.logoBadge}>
            <View style={styles.logoDot} />
            <Text style={[styles.logoText, { color: C.text }]}>FRIDGR</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: C.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: C.textSecondary }]}>Sign in to your account</Text>

          {displayError ? (
            <View style={[styles.errorBanner, { backgroundColor: C.errorLight, borderColor: C.error + '33' }]}>
              <AlertCircle size={14} color={C.error} strokeWidth={ICON_STROKE} />
              <Text style={[styles.errorText, { color: C.error }]}>{displayError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={[styles.form, { backgroundColor: C.surface, borderColor: C.border }]}>
            {/* Email */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: C.textSecondary }]}>Email</Text>
              <View style={[
                styles.inputWrap,
                { backgroundColor: C.surface2, borderColor: C.border },
                emailFocused && { borderColor: ACCENT },
                fieldErr.email ? { borderColor: C.error } : null,
              ]}>
                <Mail size={15} color={emailFocused ? ACCENT : ICON_C} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: C.text }]}
                  value={email}
                  onChangeText={t => { setEmail(t); if (fieldErr.email) setFieldErr(f => ({ ...f, email: '' })); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@example.com"
                  placeholderTextColor={C.textTertiary}
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
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: C.textSecondary }]}>Password</Text>
                <Pressable onPress={() => navigation.navigate(ROUTES.FORGOT_PW)}>
                  <Text style={[styles.forgotText, { color: ACCENT }]}>Forgot password?</Text>
                </Pressable>
              </View>
              <View style={[
                styles.inputWrap,
                { backgroundColor: C.surface2, borderColor: C.border },
                passwordFocused && { borderColor: ACCENT },
                fieldErr.password ? { borderColor: C.error } : null,
              ]}>
                <Lock size={15} color={passwordFocused ? ACCENT : ICON_C} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, { flex: 1, color: C.text }]}
                  value={password}
                  onChangeText={t => { setPassword(t); if (fieldErr.password) setFieldErr(f => ({ ...f, password: '' })); }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Enter your password"
                  placeholderTextColor={C.textTertiary}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable onPress={() => setShowPw(v => !v)} style={styles.eyeBtn} hitSlop={8}>
                  {showPw
                    ? <EyeOff size={16} color={ICON_C} strokeWidth={ICON_STROKE} />
                    : <Eye size={16} color={ICON_C} strokeWidth={ICON_STROKE} />}
                </Pressable>
              </View>
              {fieldErr.password ? <Text style={[styles.fieldError, { color: C.error }]}>{fieldErr.password}</Text> : null}
            </View>

            {/* Sign In button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                loading && { opacity: 0.5 },
                pressed && !loading && { opacity: 0.88 },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={PREMIUM_CTA_VERTICAL}
                start={PREMIUM_CTA_VERTICAL_START}
                end={PREMIUM_CTA_VERTICAL_END}
                style={styles.primaryBtnGradient}
              >
                {loading
                  ? <ActivityIndicator color="#FFFFFF" size="small" />
                  : <Text style={styles.primaryBtnText}>Sign In</Text>}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
              <Text style={[styles.dividerText, { color: C.textTertiary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
            </View>

            {/* Social */}
            <View style={styles.social}>
              <Pressable style={({ pressed }) => [styles.socialBtn, { backgroundColor: C.surface2, borderColor: C.border }, pressed && { opacity: 0.7 }]}>
                <Text style={[styles.socialBtnLabel, { color: C.text }]}>G</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.socialBtn, { backgroundColor: C.surface2, borderColor: C.border }, pressed && { opacity: 0.7 }]}>
                <Text style={[styles.socialBtnLabel, { color: C.text }]}>󰍃</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <Pressable style={styles.footer} onPress={() => navigation.navigate(ROUTES.SIGN_UP)}>
            <Text style={[styles.footerText, { color: C.textSecondary }]}>
              {"Don't have an account? "}
              <Text style={[styles.footerLink, { color: ACCENT }]}>Sign up</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  logoBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#4ADE80' },
  logoText: { fontSize: 13, fontWeight: '800', letterSpacing: 1.4 },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: 48,
  },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4, marginBottom: 3 },
  subtitle: { fontSize: 13, marginBottom: SPACING.lg },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  errorText: { fontSize: 12, flex: 1 },
  form: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  field: { gap: 5 },
  label: { fontWeight: '600', fontSize: 11, letterSpacing: 0.3 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText: { fontWeight: '600', fontSize: 11 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  fieldError: { fontSize: 11, marginTop: 2 },
  inputIcon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 0,
  },
  eyeBtn: { padding: 4 },
  primaryBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: SPACING.xs,
    elevation: 4,
    shadowColor: '#3E6B50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  primaryBtnGradient: { height: 46, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, letterSpacing: 0.2 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  social: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md },
  socialBtn: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnLabel: { fontSize: 15, fontWeight: '700' },
  footer: { alignItems: 'center', marginTop: SPACING.md },
  footerText: { fontSize: 13 },
  footerLink: { fontWeight: '700' },
});
