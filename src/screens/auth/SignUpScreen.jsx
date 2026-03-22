// src/screens/auth/SignUpScreen.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, Pressable, TextInput,
  KeyboardAvoidingView, ScrollView, Platform, Animated, ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  AlertCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Smartphone,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { SPACING } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import { createPremiumAuthStyles } from '../../constants/premiumAuthStyles';
import {
  PREMIUM,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

export default function SignUpScreen({ navigation }) {
  const { signUp, loading, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createPremiumAuthStyles(C), [C]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const [fieldErr, setFieldErr] = useState({ name: '', email: '', password: '' });
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    return () => clearError();
  }, []);

  const handleSignUp = async () => {
    setLocalErr('');
    setFieldErr({ name: '', email: '', password: '' });
    const next = {};
    if (!name.trim()) next.name = 'Enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address';
    if (password.length < 6) next.password = 'Use at least 6 characters';
    if (Object.keys(next).length) {
      setFieldErr(next);
      return;
    }
    if (!agree) {
      setLocalErr('Please agree to the Terms and Privacy Policy.');
      return;
    }
    const result = await signUp(name.trim(), email.trim(), password);
    if (!result.success) setLocalErr(result.error || 'Sign up failed.');
  };

  const displayError = localErr || error;

  const strengthLevel = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthColor = ['transparent', C.error, C.warning, C.success][strengthLevel];
  const strengthLabel = ['', 'Too short', 'Good', 'Strong'][strengthLevel];

  return (
    <PremiumScreenShell>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <Pressable style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.75 }]} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={PREMIUM.text} strokeWidth={ICON_STROKE} />
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
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start cooking smarter today</Text>

          {displayError ? (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color={C.error} strokeWidth={ICON_STROKE} />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputWrap, fieldErr.name ? styles.inputWrapError : null]}>
                <User size={18} color={PREMIUM.iconMuted} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={t => {
                    setName(t);
                    if (fieldErr.name) setFieldErr(f => ({ ...f, name: '' }));
                  }}
                  placeholder="Your name"
                  placeholderTextColor={PREMIUM.iconMuted}
                  autoCapitalize="words"
                  textContentType="name"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
              {fieldErr.name ? <Text style={styles.fieldError}>{fieldErr.name}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrap, fieldErr.email ? styles.inputWrapError : null]}>
                <Mail size={18} color={PREMIUM.iconMuted} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  value={email}
                  onChangeText={t => {
                    setEmail(t);
                    if (fieldErr.email) setFieldErr(f => ({ ...f, email: '' }));
                  }}
                  placeholder="you@example.com"
                  placeholderTextColor={PREMIUM.iconMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              {fieldErr.email ? <Text style={styles.fieldError}>{fieldErr.email}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrap, fieldErr.password ? styles.inputWrapError : null]}>
                <Lock size={18} color={PREMIUM.iconMuted} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={t => {
                    setPassword(t);
                    if (fieldErr.password) setFieldErr(f => ({ ...f, password: '' }));
                  }}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={PREMIUM.iconMuted}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  textContentType="newPassword"
                  autoComplete="password-new"
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
                <Pressable onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                  {showPw
                    ? <EyeOff size={18} color={PREMIUM.iconMuted} strokeWidth={ICON_STROKE} />
                    : <Eye size={18} color={PREMIUM.iconMuted} strokeWidth={ICON_STROKE} />}
                </Pressable>
              </View>
              {fieldErr.password ? <Text style={styles.fieldError}>{fieldErr.password}</Text> : null}
              {password.length > 0 && (
                <View style={styles.strength}>
                  <View style={styles.strengthBar}>
                    {[1, 2, 3].map(i => (
                      <View
                        key={i}
                        style={[
                          styles.strengthSegment,
                          { backgroundColor: i <= strengthLevel ? strengthColor : 'rgba(255,255,255,0.12)' },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                </View>
              )}
            </View>

            <Pressable style={({ pressed }) => [styles.agreeRow, pressed && { opacity: 0.85 }]} onPress={() => setAgree(v => !v)}>
              <View style={[styles.checkbox, agree && styles.checkboxActive]}>
                {agree && <Check size={12} color="#FFFFFF" strokeWidth={ICON_STROKE + 0.5} />}
              </View>
              <Text style={styles.agreeText}>
                I agree to the{' '}
                <Text style={styles.agreeLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.agreeLink}>Privacy Policy</Text>
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.primaryBtn, loading && styles.primaryBtnDisabled, pressed && !loading && { opacity: 0.9 }]}
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

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.social}>
            <Pressable style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.85 }]}>
              <Text style={styles.socialBtnLabel}>G</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.85 }]}>
              <Smartphone size={20} color={PREMIUM.text} strokeWidth={ICON_STROKE} />
            </Pressable>
          </View>

          <Pressable style={styles.footer} onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerLink}>Sign in</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
    </PremiumScreenShell>
  );
}
