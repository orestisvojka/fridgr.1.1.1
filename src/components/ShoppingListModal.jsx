// src/components/ShoppingListModal.jsx
// Modal showing missing ingredients as a checkable list

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
  shadows,
} from '../styles/theme';
import PrimaryButton from './PrimaryButton';
import { capitalize } from '../utils/helpers';

export default function ShoppingListModal({ visible, recipe, onClose }) {
  const [checked, setChecked] = useState([]);

  const missing = recipe?.missing || [];
  const palette = recipe?.palette || { color: colors.green, bg: colors.greenLight };

  const toggle = (item) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleClose = () => {
    setChecked([]);
    onClose?.();
  };

  const allDone = checked.length === missing.length && missing.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Shopping List</Text>
              <Text style={styles.sheetSubtitle}>
                For <Text style={{ color: palette.color, fontWeight: fontWeight.bold }}>{recipe?.title}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: missing.length
                      ? `${(checked.length / missing.length) * 100}%`
                      : '0%',
                    backgroundColor: palette.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {checked.length}/{missing.length} picked up
            </Text>
          </View>

          {/* List */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {missing.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>✅</Text>
                <Text style={styles.emptyTitle}>You have everything!</Text>
                <Text style={styles.emptyDesc}>
                  No missing ingredients for this recipe.
                </Text>
              </View>
            ) : (
              missing.map((item) => {
                const isChecked = checked.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => toggle(item)}
                    activeOpacity={0.8}
                    style={[
                      styles.listItem,
                      isChecked && styles.listItemChecked,
                    ]}
                  >
                    {/* Checkbox */}
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && {
                          backgroundColor: palette.color,
                          borderColor: palette.color,
                        },
                      ]}
                    >
                      {isChecked && (
                        <Ionicons name="checkmark" size={13} color="#fff" strokeWidth={3} />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.itemText,
                        isChecked && styles.itemTextChecked,
                      ]}
                    >
                      {capitalize(item)}
                    </Text>

                    {/* Category hint */}
                    <View style={[styles.categoryBadge, { backgroundColor: palette.color + '14' }]}>
                      <Text style={[styles.categoryText, { color: palette.color }]}>
                        produce
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* All-done banner */}
          {allDone && (
            <View style={styles.doneBanner}>
              <Ionicons name="checkmark-circle" size={20} color={colors.green} />
              <Text style={styles.doneText}>All picked up — you're ready to cook! 🎉</Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <PrimaryButton
              label={allDone ? 'Let\'s Cook!' : 'Done'}
              icon={allDone ? 'restaurant-outline' : 'checkmark'}
              full
              size="lg"
              onPress={handleClose}
              color={palette.color}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingBottom: 36,
    maxHeight: '80%',
    ...shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    fontSize: fontSize.xxl - 2,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  sheetSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    minWidth: 70,
    textAlign: 'right',
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.sm - 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgCardAlt,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  listItemChecked: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  itemText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  categoryText: {
    fontSize: fontSize.xs - 1,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    backgroundColor: colors.greenLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.green + '44',
  },
  doneText: {
    flex: 1,
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.bold,
    color: colors.greenDark,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  emptyDesc: {
    fontSize: fontSize.sm + 1,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
