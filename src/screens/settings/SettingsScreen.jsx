// src/screens/settings/SettingsScreen.jsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Image, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Lightbulb,
  Mail,
  Moon,
  Shield,
  FileText,
  Trash2,
  ChevronRight,
  ArrowLeft
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useTheme, useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import { DEFAULT_RECIPE_IMAGE } from '../../data/recipeImages';

const { height } = Dimensions.get('window');
const IMG_HEIGHT = height * 0.35;

function ToggleRow({
  icon: Icon, label, value, onToggle, iconBg, iconColor, styles,
}) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg || 'rgba(30,41,59,0.9)' }]}>
        <Icon size={20} color={iconColor || '#64748B'} strokeWidth={ICON_STROKE} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#CBD5E1', true: 'rgba(74,222,128,0.35)' }}
        thumbColor={value ? '#4ADE80' : '#F8FAFC'}
      />
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F9F7F2' },
    imageSection: { width: '100%', backgroundColor: '#E8E4DC', position: 'absolute', top: 0, left: 0, right: 0 },
    
    // Custom header to sit on top of the image
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.md,
      paddingBottom: SPACING.md,
      zIndex: 10,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: RADIUS.sm,
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...FONT.h4,
      color: '#0D3B26',
      flex: 1,
      textAlign: 'center',
      marginHorizontal: SPACING.sm,
      textShadowColor: 'rgba(255,255,255,0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    side: { width: 44 },

    scroll: { padding: SPACING.xl, gap: SPACING.xxl, paddingBottom: 48 },
    section: { gap: SPACING.sm },
    sectionTitle: { ...FONT.h5, color: '#0D3B26', opacity: 0.7 },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: RADIUS.xxl,
      borderWidth: 1,
      borderColor: 'rgba(13,59,38,0.07)',
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
    settingLabel: { ...FONT.bodyMedium, color: '#0D3B26', flex: 1, fontSize: 16 },
    divider: { height: 1, backgroundColor: 'rgba(13,59,38,0.05)', marginLeft: SPACING.xl + 42 + SPACING.lg },
    versionText: { ...FONT.caption, color: 'rgba(13,59,38,0.4)', textAlign: 'center' },
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
    { icon: Shield, label: 'Privacy Policy', bg: 'rgba(74,222,128,0.15)', color: '#3E6B50', onPress: goPrivacy },
    { icon: FileText, label: 'Terms of Service', bg: 'rgba(13,59,38,0.08)', color: '#0D3B26', onPress: goTerms },
    { icon: Trash2, label: 'Delete Account', bg: 'rgba(254,226,226,0.3)', color: '#F87171', onPress: confirmDelete, destructive: true },
  ];

  return (
    <View style={styles.root}>
      {/* ── Page Wall (Identical to Welcoming part / WelcomeScreen) ── */}
      <View style={[styles.imageSection, { height: IMG_HEIGHT }]}>
        <Image
          source={{ uri: DEFAULT_RECIPE_IMAGE }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#F9F7F2']}
          locations={[0.65, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </View>

      {/* Identitcal structurally designed header but without PremiumShell restrictions */}
      <View style={[styles.headerRow, { paddingTop: insets.top + SPACING.sm }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
        >
          <ArrowLeft size={22} color="#0D3B26" strokeWidth={ICON_STROKE} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Settings
        </Text>
        <View style={styles.side} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <ToggleRow icon={Bell} label="Push Notifications" value={notifs} onToggle={setNotifs} iconBg="#EDE9FE" iconColor="#7C3AED" styles={styles} />
            <View style={styles.divider} />
            <ToggleRow icon={Lightbulb} label="Daily Cooking Tips" value={tips} onToggle={setTips} iconBg="rgba(245,158,11,0.2)" iconColor="#FBBF24" styles={styles} />
            <View style={styles.divider} />
            <ToggleRow icon={Mail} label="Weekly Newsletter" value={newsletter} onToggle={setNews} iconBg="rgba(56,189,248,0.2)" iconColor="#38BDF8" styles={styles} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <ToggleRow icon={Moon} label="Dark Mode" value={isDark} onToggle={setIsDark} iconBg="rgba(13,59,38,0.08)" iconColor="#0D3B26" styles={styles} />
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
                  <ChevronRight size={18} color="rgba(13,59,38,0.4)" strokeWidth={ICON_STROKE} />
                </Pressable>
                {i < arr.length - 1 && <View style={styles.divider} />}
              </View>
            );
            })}
          </View>
        </View>

        <Text style={styles.versionText}>FRIDGR v1.0.0</Text>
      </ScrollView>
    </View>
  );
}
