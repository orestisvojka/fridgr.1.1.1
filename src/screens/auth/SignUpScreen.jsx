// src/screens/auth/SignUpScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, ScrollView, Platform, Animated, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';

export default function SignUpScreen({ navigation }) {
  const { signUp, loading, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [agree,    setAgree]    = useState(false);
  const [localErr, setLocalErr] = useState('');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    return () => clearError();
  }, []);

  const handleSignUp = async () => {
    setLocalErr('');
    if (!agree) { setLocalErr('Please agree to the Terms & Privacy Policy.'); return; }
    const result = await signUp(name, email.trim(), password);
    if (!result.success) setLocalErr(result.error || 'Sign up failed.');
  };

  const displayError = localErr || error;

  const strengthLevel = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthColor  = ['transparent', COLORS.error, COLORS.warning, COLORS.success][strengthLevel];
  const strengthLabel  = ['', 'Too short', 'Good', 'Strong'][strengthLevel];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>FRIDGR</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start cooking smarter today</Text>

          {displayError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={COLORS.error} />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color={COLORS.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={COLORS.textTertiary}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={COLORS.textTertiary}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
              {/* Strength bar */}
              {password.length > 0 && (
                <View style={styles.strength}>
                  <View style={styles.strengthBar}>
                    {[1, 2, 3].map(i => (
                      <View
                        key={i}
                        style={[
                          styles.strengthSegment,
                          { backgroundColor: i <= strengthLevel ? strengthColor : COLORS.border },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                </View>
              )}
            </View>

            {/* Agree */}
            <TouchableOpacity style={styles.agreeRow} onPress={() => setAgree(v => !v)} activeOpacity={0.7}>
              <View style={[styles.checkbox, agree && styles.checkboxActive]}>
                {agree && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
              </View>
              <Text style={styles.agreeText}>
                I agree to the{' '}
                <Text style={styles.agreeLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.agreeLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signupBtn, loading && { opacity: 0.7 }]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#16A34A', '#15803D']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.signupBtnGradient}
            >
              {loading
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.signupBtnText}>Create Account</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.social}>
            {['logo-google', 'logo-apple'].map(icon => (
              <TouchableOpacity key={icon} style={styles.socialBtn} activeOpacity={0.7}>
                <Ionicons name={icon} size={20} color={COLORS.text} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  logoBadge: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryFaint, borderRadius: RADIUS.full,
  },
  logoBadgeText: { ...FONT.label, color: COLORS.primary },
  scroll: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: 40 },
  title: { ...FONT.h1, color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { ...FONT.body, color: COLORS.textSecondary, marginBottom: SPACING.xxl },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.errorLight, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.lg,
  },
  errorText: { ...FONT.bodySmall, color: COLORS.error, flex: 1 },
  form: { gap: SPACING.lg, marginBottom: SPACING.xxl },
  field: { gap: SPACING.sm },
  label: { ...FONT.label, color: COLORS.text },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, height: 52,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, ...FONT.body, color: COLORS.text },
  eyeBtn: { padding: SPACING.xs },
  strength: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xs },
  strengthBar: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthSegment: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { ...FONT.captionMedium },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  checkbox: {
    width: 20, height: 20, borderRadius: RADIUS.xs,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  agreeText: { ...FONT.bodySmall, color: COLORS.textSecondary, flex: 1, lineHeight: 18 },
  agreeLink: { color: COLORS.primary, fontWeight: '600' },
  signupBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.xxl, ...SHADOWS.green },
  signupBtnGradient: { height: 54, alignItems: 'center', justifyContent: 'center' },
  signupBtnText: { ...FONT.h5, color: COLORS.white },
  divider: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { ...FONT.bodySmall, color: COLORS.textTertiary },
  social: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.xxl },
  socialBtn: {
    width: 52, height: 52, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  footer: { alignItems: 'center' },
  footerText: { ...FONT.body, color: COLORS.textSecondary },
  footerLink: { color: COLORS.primary, fontWeight: '600' },
});
