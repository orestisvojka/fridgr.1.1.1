// src/screens/settings/SettingsScreen.jsx
// Updated: dark charcoal + frosted glass — matches questionnaire palette.

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert,
  Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell, Lightbulb, Mail, Moon, Shield, FileText,
  Trash2, ChevronRight, ArrowLeft, Settings, Info,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useTheme } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Palette — dark charcoal (same as questionnaire) ─────────────────────────
const BG_TOP  = '#1A1F1C';
const BG_MID  = '#222A26';
const BG_BOT  = '#2A3430';
const TEXT_PRI = 'rgba(255,255,255,0.92)';
const TEXT_SEC = 'rgba(255,255,255,0.50)';
const G_TICK   = '#4A7C5E';

// ─── Glass card ──────────────────────────────────────────────────────────────
function GlassCard({ style, children }) {
  return (
    <View style={[gl.card, style]}>
      <View style={gl.shimmer} />
      {children}
    </View>
  );
}

const gl = StyleSheet.create({
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

// ─── Toggle row ──────────────────────────────────────────────────────────────
function ToggleRow({ icon: Icon, label, value, onToggle, iconBg, iconColor }) {
  return (
    <View style={r.row}>
      <View style={[r.iconWrap, { backgroundColor: iconBg || 'rgba(255,255,255,0.08)' }]}>
        <Icon size={18} color={iconColor || TEXT_SEC} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={r.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: 'rgba(255,255,255,0.15)', true: 'rgba(74,124,94,0.50)' }}
        thumbColor={value ? G_TICK : 'rgba(255,255,255,0.6)'}
      />
    </View>
  );
}

// ─── Nav row ─────────────────────────────────────────────────────────────────
function NavRow({ icon: Icon, label, onPress, iconBg, iconColor, destructive }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [r.row, pressed && { opacity: 0.7 }]}
    >
      <View style={[r.iconWrap, { backgroundColor: iconBg || 'rgba(255,255,255,0.08)' }]}>
        <Icon size={18} color={iconColor || TEXT_SEC} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={[r.label, destructive && { color: '#FF6B6B' }]}>{label}</Text>
      <ChevronRight size={16} color="rgba(255,255,255,0.25)" strokeWidth={ICON_STROKE} />
    </Pressable>
  );
}

const r = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.lg,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { ...FONT.bodyMedium, color: TEXT_PRI, flex: 1, fontSize: 15 },
});

const DIVIDER = (
  <View style={{
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: SPACING.xl + 40 + SPACING.lg,
  }} />
);

// ─── Main ────────────────────────────────────────────────────────────────────
export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDark, setIsDark } = useTheme();

  const [notifs, setNotifs]       = useState(true);
  const [tips, setTips]           = useState(true);
  const [newsletter, setNews]     = useState(false);

  // Entrance
  const fadeOp = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(20)).current;
  const orbY   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeOp, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideY, { toValue: 0, tension: 55, friction: 8, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.timing(orbY, { toValue: -10, duration: 3600, useNativeDriver: true }),
      Animated.timing(orbY, { toValue:   0, duration: 3600, useNativeDriver: true }),
    ])).start();
  }, []);

  const goPrivacy = () => navigation.navigate(ROUTES.PRIVACY_POLICY);
  const goTerms   = () => navigation.navigate(ROUTES.TERMS_OF_SERVICE);

  const confirmDelete = () => {
    Alert.alert(
      'Delete account',
      'This will remove your account and preferences. This demo cannot delete accounts on a server.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={[BG_TOP, BG_MID, BG_BOT]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <Animated.View style={[s.orb, { transform: [{ translateY: orbY }] }]} />

      {/* Header */}
      <View style={[s.headerBar, { paddingTop: insets.top + SPACING.sm }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <GlassCard style={s.backBtn}>
            <ArrowLeft size={18} color={TEXT_PRI} strokeWidth={ICON_STROKE} />
          </GlassCard>
        </Pressable>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeOp, transform: [{ translateY: slideY }] }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]}
        >
          {/* Notifications */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Notifications</Text>
            <GlassCard>
              <ToggleRow icon={Bell}      label="Push Notifications" value={notifs}     onToggle={setNotifs}  iconBg="rgba(124,58,237,0.20)" iconColor="#A78BFA" />
              {DIVIDER}
              <ToggleRow icon={Lightbulb} label="Daily Cooking Tips" value={tips}       onToggle={setTips}    iconBg="rgba(251,191,36,0.15)" iconColor="#FBBF24" />
              {DIVIDER}
              <ToggleRow icon={Mail}      label="Weekly Newsletter"  value={newsletter} onToggle={setNews}    iconBg="rgba(56,189,248,0.15)"  iconColor="#38BDF8" />
            </GlassCard>
          </View>

          {/* Appearance */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Appearance</Text>
            <GlassCard>
              <ToggleRow icon={Moon} label="Dark Mode" value={isDark} onToggle={setIsDark} iconBg="rgba(255,255,255,0.08)" iconColor={TEXT_PRI} />
            </GlassCard>
          </View>

          {/* About */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>About</Text>
            <GlassCard>
              <NavRow icon={Info} label="App Version 1.0.0" iconBg="rgba(74,124,94,0.20)" iconColor={G_TICK} onPress={() => {}} />
            </GlassCard>
          </View>

          {/* Privacy & Data */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Privacy & Data</Text>
            <GlassCard>
              <NavRow icon={Shield}   label="Privacy Policy"    onPress={goPrivacy}     iconBg="rgba(74,124,94,0.20)" iconColor={G_TICK} />
              {DIVIDER}
              <NavRow icon={FileText} label="Terms of Service"  onPress={goTerms}       iconBg="rgba(255,255,255,0.08)" iconColor={TEXT_SEC} />
              {DIVIDER}
              <NavRow icon={Trash2}   label="Delete Account"    onPress={confirmDelete}  iconBg="rgba(255,107,107,0.15)" iconColor="#FF6B6B" destructive />
            </GlassCard>
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <View style={s.footerDot} />
            <Text style={s.footerText}>FRIDGR v1.0.0</Text>
            <Text style={s.footerSub}>Made with care</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_TOP },

  orb: {
    position: 'absolute', bottom: -40, left: -60,
    width: SCREEN_W * 0.5, height: SCREEN_W * 0.5,
    borderRadius: SCREEN_W * 0.25,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16, fontWeight: '700', color: TEXT_PRI, letterSpacing: -0.2,
  },

  scroll: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.sm, gap: SPACING.xl },

  section: { gap: SPACING.sm },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: TEXT_SEC,
    textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4,
  },

  footer: { alignItems: 'center', gap: 4, paddingTop: SPACING.lg },
  footerDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: G_TICK,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12, fontWeight: '800', color: TEXT_SEC, letterSpacing: 0.8,
  },
  footerSub: {
    fontSize: 11, color: 'rgba(255,255,255,0.25)',
  },
});
