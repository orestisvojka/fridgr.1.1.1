// src/screens/settings/SettingsScreen.jsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert,
} from 'react-native';
import {
  Bell,
  Lightbulb,
  Mail,
  Moon,
  Shield,
  FileText,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useTheme, useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import PremiumScreenHeader from '../../components/PremiumScreenHeader';
import { PREMIUM } from '../../constants/premiumScreenTheme';

function ToggleRow({
  icon: Icon, label, value, onToggle, iconBg, iconColor, colors, styles,
}) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg || 'rgba(30,41,59,0.9)' }]}>
        <Icon size={20} color={iconColor || PREMIUM.textMuted} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: PREMIUM.btnDisabledBg, true: 'rgba(74,222,128,0.35)' }}
        thumbColor={value ? PREMIUM.accent : PREMIUM.textMuted}
      />
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    scroll: { padding: SPACING.xl, gap: SPACING.xxl, paddingBottom: 48 },
    section: { gap: SPACING.sm },
    sectionTitle: { ...FONT.h5, color: PREMIUM.textMuted },
    card: {
      backgroundColor: PREMIUM.cardBg,
      borderRadius: RADIUS.xxl,
      borderWidth: 1,
      borderColor: PREMIUM.cardBorder,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    settingRow: {
      flexDirection: 'row', alignItems: 'center', gap: SPACING.lg,
      paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg,
    },
    settingIcon: {
      width: 42, height: 42, borderRadius: RADIUS.lg,
      alignItems: 'center', justifyContent: 'center',
    },
    settingLabel: { ...FONT.bodyMedium, color: PREMIUM.text, flex: 1, fontSize: 16 },
    divider: { height: 1, backgroundColor: PREMIUM.glassBorder, marginLeft: SPACING.xl + 42 + SPACING.lg },
    versionText: { ...FONT.caption, color: PREMIUM.textMuted, textAlign: 'center' },
    linkRow: { flexDirection: 'row', alignItems: 'center' },
  });
}

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { isDark, setIsDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [notifs, setNotifs] = useState(true);
  const [tips, setTips] = useState(true);
  const [newsletter, setNews] = useState(false);

  const goPrivacy = () => navigation.navigate(ROUTES.PRIVACY_POLICY);
  const goTerms = () => navigation.navigate(ROUTES.TERMS_OF_SERVICE);

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

  const privacyRows = [
    { icon: Shield, label: 'Privacy Policy', bg: 'rgba(74,222,128,0.15)', color: PREMIUM.accent, onPress: goPrivacy },
    { icon: FileText, label: 'Terms of Service', bg: 'rgba(30,41,59,0.9)', color: PREMIUM.textMuted, onPress: goTerms },
    { icon: Trash2, label: 'Delete Account', bg: 'rgba(254,226,226,0.15)', color: '#F87171', onPress: confirmDelete, destructive: true },
  ];

  return (
    <PremiumScreenShell>
      <PremiumScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <ToggleRow icon={Bell} label="Push Notifications" value={notifs} onToggle={setNotifs} iconBg="#EDE9FE" iconColor="#7C3AED" colors={colors} styles={styles} />
            <View style={styles.divider} />
            <ToggleRow icon={Lightbulb} label="Daily Cooking Tips" value={tips} onToggle={setTips} iconBg="rgba(245,158,11,0.2)" iconColor="#FBBF24" colors={colors} styles={styles} />
            <View style={styles.divider} />
            <ToggleRow icon={Mail} label="Weekly Newsletter" value={newsletter} onToggle={setNews} iconBg="rgba(56,189,248,0.2)" iconColor="#38BDF8" colors={colors} styles={styles} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <ToggleRow icon={Moon} label="Dark Mode" value={isDark} onToggle={setIsDark} iconBg="rgba(255,255,255,0.08)" iconColor={PREMIUM.text} colors={colors} styles={styles} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          <View style={styles.card}>
            {privacyRows.map((item, i, arr) => {
              const RowIcon = item.icon;
              return (
              <View key={item.label}>
                <Pressable
                  onPress={item.onPress}
                  style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.82 }]}
                >
                  <View style={[styles.settingIcon, { backgroundColor: item.bg }]}>
                    <RowIcon size={20} color={item.color} strokeWidth={ICON_STROKE} />
                  </View>
                  <Text style={[styles.settingLabel, item.destructive && { color: '#FCA5A5' }]}>
                    {item.label}
                  </Text>
                  <ChevronRight size={18} color={PREMIUM.textMuted} strokeWidth={ICON_STROKE} />
                </Pressable>
                {i < arr.length - 1 && <View style={styles.divider} />}
              </View>
            );
            })}
          </View>
        </View>

        <Text style={styles.versionText}>FRIDGR v1.0.0</Text>
      </ScrollView>
    </PremiumScreenShell>
  );
}
