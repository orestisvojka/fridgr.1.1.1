// src/screens/auth/ForgotPasswordScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Animated, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword, loading } = useAuth();
  const insets = useSafeAreaInsets();

  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [errMsg,  setErrMsg]  = useState('');

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {sent ? (
          // ─── Success State ─────────────────────────────────────────────────
          <View style={styles.successWrap}>
            <View style={styles.successIcon}>
              <Ionicons name="mail" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Check your inbox</Text>
            <Text style={styles.subtitle}>
              We've sent a reset link to{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.goBack()}>
              <Text style={styles.backToLoginText}>← Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ─── Input State ───────────────────────────────────────────────────
          <>
            <View style={styles.iconWrap}>
              <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.icon}>
                <Ionicons name="lock-open-outline" size={34} color={COLORS.primary} />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we'll send you a reset link.
            </Text>

            {errMsg ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{errMsg}</Text>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>Email address</Text>
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

            <TouchableOpacity
              style={[styles.sendBtn, loading && { opacity: 0.7 }]}
              onPress={handleSend}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#16A34A', '#15803D']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.sendBtnGradient}
              >
                {loading
                  ? <ActivityIndicator color={COLORS.white} />
                  : <Text style={styles.sendBtnText}>Send Reset Link</Text>
                }
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.goBack()}>
              <Text style={styles.backToLoginText}>← Back to Sign In</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  backBtn: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  content: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxl },
  iconWrap: { marginBottom: SPACING.xxl },
  icon: {
    width: 72, height: 72, borderRadius: RADIUS.xl,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...FONT.h1, color: COLORS.text, marginBottom: SPACING.sm },
  subtitle: { ...FONT.body, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.xxl },
  emailHighlight: { color: COLORS.primary, fontWeight: '600' },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.errorLight, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.lg,
  },
  errorText: { ...FONT.bodySmall, color: COLORS.error, flex: 1 },
  field: { gap: SPACING.sm, marginBottom: SPACING.xxl },
  label: { ...FONT.label, color: COLORS.text },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, height: 52,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, ...FONT.body, color: COLORS.text },
  sendBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.lg, ...SHADOWS.green },
  sendBtnGradient: { height: 54, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { ...FONT.h5, color: COLORS.white },
  backToLogin: { alignItems: 'center', paddingVertical: SPACING.md },
  backToLoginText: { ...FONT.bodyMedium, color: COLORS.primary },
  successWrap: { alignItems: 'center', paddingTop: SPACING.section },
  successIcon: {
    width: 88, height: 88, borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.primaryFaint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.xxl,
  },
});
