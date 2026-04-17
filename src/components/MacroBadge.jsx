// src/components/MacroBadge.jsx
// Small badge showing a macro value (protein / carbs / fat / calories)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontFamily, fontWeight, radius, spacing } from '../styles/theme';

const MACRO_CONFIG = {
  calories: { label: 'Cal', color: '#8B5CF6', bg: '#F5F3FF' },
  protein:  { label: 'Pro', color: '#3B82F6', bg: '#EFF6FF' },
  carbs:    { label: 'Carbs', color: '#F59E0B', bg: '#FFFBEB' },
  fat:      { label: 'Fat', color: '#EF4444', bg: '#FEF2F2' },
};

function SingleBadge({ type, value, unit = 'g', accentColor }) {
  const cfg = MACRO_CONFIG[type] || { label: type, color: accentColor || colors.green, bg: colors.greenLight };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.color + '22' }]}>
      <Text style={[styles.value, { color: cfg.color }]}>
        {value}
        {type !== 'calories' ? unit : ''}
      </Text>
      <Text style={[styles.label, { color: cfg.color + 'aa' }]}>{cfg.label}</Text>
    </View>
  );
}

export default function MacroBadge({ calories, protein, carbs, fat, accentColor, compact = false }) {
  const macros = [
    { type: 'calories', value: calories },
    { type: 'protein',  value: protein },
    { type: 'carbs',    value: carbs },
    { type: 'fat',      value: fat },
  ];

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {macros.map((m) => (
        <SingleBadge key={m.type} {...m} accentColor={accentColor} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm - 2,
  },
  rowCompact: {
    gap: spacing.xs,
  },
  badge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  value: {
    fontSize: fontSize.md - 1,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
  },
  label: {
    fontSize: fontSize.xs - 1,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 2,
  },
});
