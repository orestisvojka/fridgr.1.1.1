// src/components/PrimaryButton.jsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { ArrowRight, ShoppingCart } from 'lucide-react-native';
import { colors, radius, fontSize, fontWeight, spacing, shadows } from '../styles/theme';
import { ICON_STROKE } from '../constants/icons';

const ICON_MAP = {
  'arrow-forward': ArrowRight,
  'cart-outline': ShoppingCart,
};

export default function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  full = false,
  color,
  style,
  labelStyle,
}) {
  const accent = color || colors.green;

  const variantStyles = {
    primary: {
      bg: disabled || loading ? '#D1D5DB' : accent,
      text: colors.textInverse,
      borderColor: 'transparent',
      shadow: disabled || loading ? {} : shadows.green,
    },
    secondary: {
      bg: colors.bgMuted,
      text: colors.textPrimary,
      borderColor: 'transparent',
      shadow: {},
    },
    outline: {
      bg: 'transparent',
      text: accent,
      borderColor: accent,
      shadow: {},
    },
    ghost: {
      bg: 'transparent',
      text: colors.textSecondary,
      borderColor: 'transparent',
      shadow: {},
    },
    danger: {
      bg: colors.errorBg,
      text: colors.error,
      borderColor: 'transparent',
      shadow: {},
    },
  };

  const sizeStyles = {
    sm: { paddingVertical: 9, paddingHorizontal: 16, fontSize: fontSize.sm, borderRadius: radius.md, iconSize: 14 },
    md: { paddingVertical: 13, paddingHorizontal: 20, fontSize: fontSize.md, borderRadius: radius.lg, iconSize: 16 },
    lg: { paddingVertical: 16, paddingHorizontal: 26, fontSize: fontSize.lg, borderRadius: radius.xl, iconSize: 18 },
  };

  const vs = variantStyles[variant] || variantStyles.primary;
  const ss = sizeStyles[size] || sizeStyles.md;

  const IconComponent = icon ? ICON_MAP[icon] : null;

  return (
    <TouchableOpacity
      onPress={!disabled && !loading ? onPress : undefined}
      activeOpacity={0.82}
      style={[
        styles.base,
        {
          backgroundColor: vs.bg,
          borderColor: vs.borderColor,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderRadius: ss.borderRadius,
          paddingVertical: ss.paddingVertical,
          paddingHorizontal: ss.paddingHorizontal,
          opacity: disabled ? 0.6 : 1,
          alignSelf: full ? 'stretch' : 'auto',
          ...vs.shadow,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.textInverse : accent}
        />
      ) : (
        <View style={styles.inner}>
          {IconComponent && iconPosition === 'left' && (
            <View style={styles.iconLeft}>
              <IconComponent size={ss.iconSize} color={vs.text} strokeWidth={ICON_STROKE} />
            </View>
          )}
          <Text
            style={[
              styles.label,
              { color: vs.text, fontSize: ss.fontSize },
              labelStyle,
            ]}
          >
            {label}
          </Text>
          {IconComponent && iconPosition === 'right' && (
            <View style={styles.iconRight}>
              <IconComponent size={ss.iconSize} color={vs.text} strokeWidth={ICON_STROKE} />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: fontWeight.bold,
    letterSpacing: 0.1,
  },
  iconLeft: {
    marginRight: spacing.xs + 2,
  },
  iconRight: {
    marginLeft: spacing.xs + 2,
  },
});
