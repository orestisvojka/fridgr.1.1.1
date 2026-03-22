import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS } from '../constants/theme';
import { ICON_STROKE } from '../constants/icons';

export default function ScreenHeader({ title, onBack, colors }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.md, borderBottomColor: colors.borderLight, backgroundColor: colors.surface }]}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={({ pressed }) => [
          styles.backBtn,
          { backgroundColor: colors.surface2 },
          pressed && { opacity: 0.72 },
        ]}
      >
        <ArrowLeft size={22} color={colors.text} strokeWidth={ICON_STROKE} />
      </Pressable>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...FONT.h4, flex: 1, textAlign: 'center', marginHorizontal: SPACING.sm },
});
