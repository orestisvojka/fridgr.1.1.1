// src/components/PremiumScreenHeader.jsx
// Header row aligned with questionnaire (glass back, light title).

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS } from '../constants/theme';
import { ICON_STROKE } from '../constants/icons';
import { PREMIUM } from '../constants/premiumScreenTheme';

export default function PremiumScreenHeader({ title, onBack, right }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.row, { paddingTop: insets.top + SPACING.sm }]}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
      >
        <ArrowLeft size={22} color={PREMIUM.text} strokeWidth={ICON_STROKE} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {right ?? <View style={styles.side} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: PREMIUM.backBtnBg,
    borderWidth: 1,
    borderColor: PREMIUM.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  side: { width: 44 },
  title: {
    ...FONT.h4,
    color: PREMIUM.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
});
