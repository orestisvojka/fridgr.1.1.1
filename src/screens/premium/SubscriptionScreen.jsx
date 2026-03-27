// src/screens/premium/SubscriptionScreen.jsx
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import {
  PREMIUM_BANNER,
  PREMIUM_BANNER_END,
  PREMIUM_BANNER_START,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const PLANS = [
  { id: 'weekly', label: 'Weekly', price: '$2.99', period: '/week', perMonth: '$11.96/mo', badge: null },
  { id: 'monthly', label: 'Monthly', price: '$7.99', period: '/month', perMonth: '$7.99/mo', badge: 'Most Popular' },
  { id: 'yearly', label: 'Yearly', price: '$39.99', period: '/year', perMonth: 'just $3.33/mo', badge: 'Best Value' },
];

const FREE_FEATURES = [
  '3 scans per day',
  'Basic recipe matching',
  'Save up to 5 recipes',
  'Standard recipes',
];

const PREMIUM_FEATURES = [
  'Unlimited scans',
  'AI-powered ingredient detection',
  'Save unlimited recipes',
  'Premium recipe collection (200+)',
  'Personalized meal plans',
  'Advanced nutrition tracking',
  'Weekly grocery list export',
  'AI meal coaching',
  'Priority support',
];

function createStyles(C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    hero: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.section },
    backBtn: {
      alignSelf: 'flex-start', padding: SPACING.sm,
      backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.md,
      marginBottom: SPACING.lg,
    },
    heroContent: { alignItems: 'center', gap: SPACING.sm },
    heroTitle: {
      ...FONT.h2,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: SPACING.md,
    },
    heroSub: { ...FONT.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
    trialBadge: {
      flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
      backgroundColor: 'rgba(245,158,11,0.15)',
      borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
      borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
    },
    trialText: { ...FONT.bodySmallMedium, color: '#F59E0B' },
    scroll: { padding: SPACING.xl, gap: SPACING.xxl },
    plansSection: { gap: SPACING.md },
    plansTitle: { ...FONT.h4, color: C.text },
    plans: { gap: SPACING.sm },
    planCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: C.surface, borderRadius: RADIUS.xl, padding: SPACING.lg,
      borderWidth: 2, borderColor: C.border, gap: SPACING.md,
      ...SHADOWS.xs,
    },
    planCardActive: { borderColor: C.primary, backgroundColor: C.primaryFaint },
    planBadge: {
      position: 'absolute', top: -10, right: SPACING.lg,
      backgroundColor: C.primary, borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm, paddingVertical: 3,
    },
    planBadgeGold: { backgroundColor: '#D97706' },
    planBadgeText: { ...FONT.captionMedium, color: '#FFFFFF', fontSize: 10 },
    planRadio: {},
    radioOuter: {
      width: 20, height: 20, borderRadius: 10,
      borderWidth: 2, borderColor: C.border,
      alignItems: 'center', justifyContent: 'center',
    },
    radioOuterActive: { borderColor: C.primary },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.primary },
    planInfo: { flex: 1, gap: 2 },
    planLabel: { ...FONT.bodySemiBold, color: C.text },
    planLabelActive: { color: C.primary },
    planPerMonth: { ...FONT.caption, color: C.textTertiary },
    planPriceWrap: { alignItems: 'flex-end' },
    planPrice: { ...FONT.h4, color: C.text },
    planPriceActive: { color: C.primary },
    planPeriod: { ...FONT.caption, color: C.textTertiary },
    comparisonSection: { gap: SPACING.md },
    compTitle: { ...FONT.h4, color: C.text },
    comparison: { flexDirection: 'row', borderRadius: RADIUS.xl, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
    compColumn: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
    compDivider: { width: 1, backgroundColor: C.border },
    compHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs },
    compHeaderLabel: { ...FONT.label, color: C.textSecondary },
    compRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
    compFeature: { ...FONT.bodySmall, color: C.textSecondary, flex: 1, lineHeight: 18 },
    testimonialsSection: { gap: SPACING.md },
    testimonialsTitle: { ...FONT.h4, color: C.text },
    testimonial: {
      backgroundColor: C.surface, borderRadius: RADIUS.xl, padding: SPACING.lg,
      gap: SPACING.sm, borderWidth: 1, borderColor: C.borderLight,
    },
    testimonialStars: { flexDirection: 'row', gap: 2 },
    testimonialText: { ...FONT.body, color: C.text, lineHeight: 24 },
    testimonialName: { ...FONT.bodySmallMedium, color: C.textSecondary },
    ctaWrap: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
      backgroundColor: C.background, borderTopWidth: 1, borderTopColor: C.borderLight,
      gap: SPACING.sm, ...SHADOWS.lg,
    },
    ctaBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.green },
    ctaBtnGradient: { height: 54, alignItems: 'center', justifyContent: 'center' },
    ctaBtnText: { ...FONT.h5, color: C.white },
    ctaLegal: { ...FONT.caption, color: C.textTertiary, textAlign: 'center' },
  });
}

export default function SubscriptionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const styles = useMemo(() => createStyles(C), [C]);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={PREMIUM_BANNER}
        start={PREMIUM_BANNER_START}
        end={PREMIUM_BANNER_END}
        style={[styles.hero, { paddingTop: insets.top + SPACING.md }]}
      >
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
          onPress={() => navigation.goBack()}
        >
          <X size={22} color="rgba(255,255,255,0.8)" strokeWidth={ICON_STROKE} />
        </Pressable>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Unlock FRIDGR Premium</Text>
          <Text style={styles.heroSub}>Cook smarter. Waste less. Eat better.</Text>

          <View style={[styles.trialBadge, { marginTop: SPACING.sm }]}>
            <Text style={styles.trialText}>7-day free trial, then cancel anytime</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.plansSection}>
          <Text style={styles.plansTitle}>Choose Your Plan</Text>
          <View style={styles.plans}>
            {PLANS.map(plan => (
              <Pressable
                key={plan.id}
                style={({ pressed }) => [
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardActive,
                  pressed && { opacity: 0.92 },
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <View style={[styles.planBadge, plan.badge === 'Best Value' && styles.planBadgeGold]}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <View style={styles.planRadio}>
                  <View style={[styles.radioOuter, selectedPlan === plan.id && styles.radioOuterActive]}>
                    {selectedPlan === plan.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <View style={styles.planInfo}>
                  <Text style={[styles.planLabel, selectedPlan === plan.id && styles.planLabelActive]}>
                    {plan.label}
                  </Text>
                  <Text style={styles.planPerMonth}>{plan.perMonth}</Text>
                </View>
                <View style={styles.planPriceWrap}>
                  <Text style={[styles.planPrice, selectedPlan === plan.id && styles.planPriceActive]}>
                    {plan.price}
                  </Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.comparisonSection}>
          <Text style={styles.compTitle}>Free vs. Premium</Text>
          <View style={styles.comparison}>
            <View style={styles.compColumn}>
              <View style={styles.compHeader}>
                <Text style={styles.compHeaderLabel}>Free</Text>
              </View>
              {FREE_FEATURES.map((f, i) => (
                <View key={i} style={styles.compRow}>
                  <Text style={styles.compFeature}>• {f}</Text>
                </View>
              ))}
            </View>

            <View style={styles.compDivider} />

            <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.compColumn}>
              <View style={styles.compHeader}>
                <Text style={[styles.compHeaderLabel, { color: C.primary, fontWeight: '700' }]}>Premium</Text>
              </View>
              {PREMIUM_FEATURES.map((f, i) => (
                <View key={i} style={styles.compRow}>
                  <Text style={[styles.compFeature, { color: C.text, fontWeight: '500' }]}>• {f}</Text>
                </View>
              ))}
            </LinearGradient>
          </View>
        </View>

        <View style={styles.testimonialsSection}>
          <Text style={styles.testimonialsTitle}>What users say</Text>
          {[
            { name: 'Sarah M.', text: 'Saved me so much money on groceries. I never waste food anymore!', stars: 5 },
            { name: 'James K.', text: 'The AI scanning is incredible. Takes 2 seconds and it knows everything.', stars: 5 },
          ].map((t, i) => (
            <View key={i} style={styles.testimonial}>
              <View style={styles.testimonialStars}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={12} color={C.star} fill={C.star} strokeWidth={0} />
                ))}
              </View>
              <Text style={styles.testimonialText}>"{t.text}"</Text>
              <Text style={styles.testimonialName}>— {t.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + SPACING.md }]}>
        <Pressable style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.9 }]}>
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={styles.ctaBtnGradient}
          >
            <Text style={styles.ctaBtnText}>Start Free Trial →</Text>
          </LinearGradient>
        </Pressable>
        <Text style={styles.ctaLegal}>No payment today · Cancel anytime · Renews automatically</Text>
      </View>
    </View>
  );
}
