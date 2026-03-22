// src/screens/auth/ForgotPasswordScreen.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, Pressable, TextInput,
  KeyboardAvoidingView, Platform, Animated, ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Mail, LockOpen, AlertCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { SPACING } from '../../constants/theme';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import { createPremiumForgotStyles } from '../../constants/premiumAuthStyles';
import {
  PREMIUM,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
  PREMIUM_SOFT_ICON_GRADIENT,
} from '../../constants/premiumScreenTheme';

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createPremiumForgotStyles(C), [C]);

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleSend = async () => {
    setErrMsg('');
    const result = await forgotPassword(email.trim());
    if (result.success) setSent(true);
    else setErrMsg(result.error || 'Something went wrong.');
  };

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
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {sent ? (
            <View style={styles.successWrap}>
              <View style={styles.successIcon}>
                <Mail size={40} color={PREMIUM.accent} strokeWidth={ICON_STROKE} />
              </View>
              <Text style={styles.title}>Check your inbox</Text>
              <Text style={styles.subtitle}>
                We've sent a reset link to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Pressable style={styles.backToLogin} onPress={() => navigation.goBack()}>
                <Text style={styles.backToLoginText}>← Back to Sign In</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.iconWrap}>
                <LinearGradient colors={PREMIUM_SOFT_ICON_GRADIENT} style={styles.icon}>
                  <LockOpen size={34} color={PREMIUM.accent} strokeWidth={ICON_STROKE} />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Forgot your password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your email and we'll send you a reset link.
              </Text>

              {errMsg ? (
                <View style={styles.errorBanner}>
                  <AlertCircle size={16} color={C.error} strokeWidth={ICON_STROKE} />
                  <Text style={styles.errorText}>{errMsg}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputWrap}>
                  <Mail size={18} color={PREMIUM.iconMuted} strokeWidth={ICON_STROKE} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={PREMIUM.iconMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [styles.sendBtn, loading && { opacity: 0.7 }, pressed && !loading && { opacity: 0.9 }]}
                onPress={handleSend}
                disabled={loading}
              >
                <LinearGradient
                  colors={PREMIUM_CTA_VERTICAL}
                  start={PREMIUM_CTA_VERTICAL_START}
                  end={PREMIUM_CTA_VERTICAL_END}
                  style={styles.sendBtnGradient}
                >
                  {loading
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={styles.sendBtnText}>Send Reset Link</Text>}
                </LinearGradient>
              </Pressable>

              <Pressable style={styles.backToLogin} onPress={() => navigation.goBack()}>
                <Text style={styles.backToLoginText}>← Back to Sign In</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </PremiumScreenShell>
  );
}
