// src/components/Header.jsx
// Reusable app header with optional back button and right action

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing } from '../styles/theme';

export default function Header({
  title,
  subtitle,
  onBack,
  rightIcon,
  rightLabel,
  onRight,
  dark = false,
  large = false,
}) {
  const titleColor = dark ? colors.textInverse : colors.textPrimary;
  const subtitleColor = dark ? colors.textOnDarkMuted : colors.textMuted;
  const iconColor = dark ? colors.textInverse : colors.textPrimary;
  const backBg = dark ? 'rgba(255,255,255,0.15)' : colors.bgMuted;

  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      {/* Left — back button or spacer */}
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.iconBtn, { backgroundColor: backBg }]}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={iconColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      {/* Center — title */}
      <View style={styles.center}>
        {large ? (
          <Text style={[styles.largTitle, { color: titleColor }]}>{title}</Text>
        ) : (
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle ? (
          <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
        ) : null}
      </View>

      {/* Right — optional action */}
      <View style={styles.side}>
        {onRight ? (
          <TouchableOpacity
            onPress={onRight}
            style={[styles.iconBtn, { backgroundColor: backBg }]}
            activeOpacity={0.7}
          >
            {rightIcon ? (
              <Ionicons name={rightIcon} size={20} color={iconColor} />
            ) : (
              <Text style={[styles.rightLabel, { color: iconColor }]}>
                {rightLabel}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 56 : spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgCardAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  containerDark: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  side: {
    width: 40,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    letterSpacing: -0.3,
  },
  largTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  rightLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
