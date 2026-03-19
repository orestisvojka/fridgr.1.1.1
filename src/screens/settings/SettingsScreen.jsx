// src/screens/settings/SettingsScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

function ToggleRow({ icon, label, value, onToggle, iconBg, iconColor }) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg || COLORS.surface2 }]}>
        <Ionicons name={icon} size={18} color={iconColor || COLORS.textSecondary} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.primaryPale }}
        thumbColor={value ? COLORS.primary : COLORS.textTertiary}
      />
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notifs, setNotifs]   = useState(true);
  const [darkMode, setDark]   = useState(false);
  const [tips, setTips]       = useState(true);
  const [newsletter, setNews] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <ToggleRow icon="notifications-outline" label="Push Notifications" value={notifs} onToggle={setNotifs} iconBg="#EDE9FE" iconColor="#7C3AED" />
            <View style={styles.divider} />
            <ToggleRow icon="bulb-outline" label="Daily Cooking Tips" value={tips} onToggle={setTips} iconBg="#FEF3C7" iconColor="#D97706" />
            <View style={styles.divider} />
            <ToggleRow icon="mail-outline" label="Weekly Newsletter" value={newsletter} onToggle={setNews} iconBg="#E0F2FE" iconColor="#0284C7" />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <ToggleRow icon="moon-outline" label="Dark Mode" value={darkMode} onToggle={setDark} iconBg="#1A1814" iconColor="#A8A29E" />
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          <View style={styles.card}>
            {[
              { icon: 'shield-checkmark-outline', label: 'Privacy Policy', bg: '#F0FDF4', color: '#15803D' },
              { icon: 'document-text-outline',    label: 'Terms of Service', bg: COLORS.surface2, color: COLORS.textSecondary },
              { icon: 'trash-outline',            label: 'Delete Account',   bg: '#FFF1F2', color: '#BE123C' },
            ].map((item, i, arr) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                  <View style={[styles.settingIcon, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.settingLabel, item.label === 'Delete Account' && { color: COLORS.error }]}>
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        <Text style={styles.versionText}>FRIDGR v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface2, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...FONT.h4, color: COLORS.text },
  scroll: { padding: SPACING.xl, gap: SPACING.xxl, paddingBottom: 40 },
  section: { gap: SPACING.sm },
  sectionTitle: { ...FONT.h5, color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.borderLight, overflow: 'hidden', ...SHADOWS.xs,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  settingIcon: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  settingLabel: { ...FONT.bodyMedium, color: COLORS.text, flex: 1 },
  divider: { height: 1, backgroundColor: COLORS.borderLight, marginLeft: SPACING.lg + 36 + SPACING.md },
  versionText: { ...FONT.caption, color: COLORS.textTertiary, textAlign: 'center' },
});
