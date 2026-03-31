// src/screens/auth/LoginScreen.jsx
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, Pressable, TextInput,
  KeyboardAvoidingView, ScrollView, Platform, Animated,
  ActivityIndicator, StyleSheet, Image,
} from 'react-native';
import {
  ArrowLeft, AlertCircle, Mail, Lock, Eye, EyeOff, Smartphone,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';
import { SPACING } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { RECIPE_IMAGE_URLS } from '../../data/recipeImages';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import { createPremiumAuthStyles } from '../../constants/premiumAuthStyles';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const ICON_COLOR = '#9A9A94';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { login, loading, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createPremiumAuthStyles(C), [C]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const [fieldErr, setFieldErr] = useState({ email: '', password: '' });
  const passwordRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }).start();
    return () => clearError();
  }, []);

  const handleLogin = async () => {
    setLocalErr('');
    setFieldErr({ email: '', password: '' });
    const emailTrim = email.trim();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) next.email = 'Enter a valid email address';
    if (password.length < 6) next.password = 'Use at least 6 characters';
    if (Object.keys(next).length) {
      setFieldErr(next);
      return;
    }
    const result = await login(emailTrim, password);
    if (!result.success) setLocalErr(result.error || 'Login failed.');
  };

  const displayError = localErr || error;

  return (
    <View style={styles.container}>
      {/* Cinematic 100% Background Photo */}
      <Image 
        source={{ uri: RECIPE_IMAGE_URLS.r2 }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      
      {/* Soft Frosted Glass Overlay mapping the entire screen to the Warm Cream aesthetic */}
      <LinearGradient 
        colors={['rgba(249,247,242,0.3)', 'rgba(249,247,242,0.9)']}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill} 
      />
      <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} pointerEvents="none" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
          {/* Back button removed to prevent unwanted navigation */}
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
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            {displayError ? (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color={C.error} strokeWidth={ICON_STROKE} />
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

            <BlurView intensity={70} tint="light" style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={[
                  styles.inputWrap,
                  emailFocused && styles.inputWrapFocused,
                  fieldErr.email ? styles.inputWrapError : null,
                ]}>
                  <Mail size={18} color={emailFocused ? '#3E6B50' : ICON_COLOR} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={t => {
                      setEmail(t);
                      if (fieldErr.email) setFieldErr(f => ({ ...f, email: '' }));
                    }}
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
                    blurOnSubmit={false}
                    underlineColorAndroid="transparent"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                </View>
                {fieldErr.email ? <Text style={styles.fieldError}>{fieldErr.email}</Text> : null}
              </View>

              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Password</Text>
                  <Pressable onPress={() => navigation.navigate(ROUTES.FORGOT_PW)}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </Pressable>
                </View>
                <View style={[
                  styles.inputWrap,
                  passwordFocused && styles.inputWrapFocused,
                  fieldErr.password ? styles.inputWrapError : null,
                ]}>
                  <Lock size={18} color={passwordFocused ? '#3E6B50' : ICON_COLOR} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                  <TextInput
                    ref={passwordRef}
                    style={[styles.input, { flex: 1 }]}
                    value={password}
                    onChangeText={t => {
                      setPassword(t);
                      if (fieldErr.password) setFieldErr(f => ({ ...f, password: '' }));
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Enter your password"
                    placeholderTextColor={ICON_COLOR}
                    secureTextEntry={!showPw}
                    autoCapitalize="none"
                    textContentType="password"
                    autoComplete="password"
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    onSubmitEditing={handleLogin}
                  />
                  <Pressable onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                    {showPw
                      ? <EyeOff size={18} color={ICON_COLOR} strokeWidth={ICON_STROKE} />
                      : <Eye size={18} color={ICON_COLOR} strokeWidth={ICON_STROKE} />}
                  </Pressable>
                </View>
                {fieldErr.password ? <Text style={styles.fieldError}>{fieldErr.password}</Text> : null}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  loading && styles.primaryBtnDisabled,
                  pressed && !loading && { transform: [{ scale: 0.985 }], opacity: 0.92 },
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
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={styles.primaryBtnText}>Sign In</Text>}
                </LinearGradient>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.social}>
                <Pressable style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.75 }]}>
                  <Text style={styles.socialBtnLabel}>G</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.75 }]}>
                  <Smartphone size={20} color="#1E1E1C" strokeWidth={ICON_STROKE} />
                </Pressable>
              </View>
            </BlurView>

            <Pressable style={styles.footer} onPress={() => navigation.navigate(ROUTES.SIGN_UP)}>
              <Text style={styles.footerText}>
                {"Don't have an account? "}
                <Text style={styles.footerLink}>Sign up</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  orb: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
  },
});
