// src/screens/premium/SubscriptionScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const PLANS = [
  {
    id: 'weekly',
    label: 'Weekly',
    price: '$2.99',
    period: '/week',
    perMonth: '$11.96/mo',
    badge: null,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$7.99',
    period: '/month',
    perMonth: '$7.99/mo',
    badge: 'Most Popular',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$39.99',
    period: '/year',
    perMonth: 'just $3.33/mo',
    badge: 'Best Value',
  },
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

export default function SubscriptionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0A1F0E', '#15803D', '#22C55E']} style={[styles.hero, { paddingTop: insets.top + SPACING.md }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <View style={styles.crownWrap}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>
          <Text style={styles.heroTitle}>Unlock FRIDGR Premium</Text>
          <Text style={styles.heroSub}>Cook smarter. Waste less. Eat better.</Text>

          <View style={styles.trialBadge}>
            <Ionicons name="flash" size={14} color="#F59E0B" />
            <Text style={styles.trialText}>7-day free trial, then cancel anytime</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}>
        {/* Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.plansTitle}>Choose Your Plan</Text>
          <View style={styles.plans}>
            {PLANS.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, selectedPlan === plan.id && styles.planCardActive]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.85}
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
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.compTitle}>Free vs. Premium</Text>
          <View style={styles.comparison}>
            {/* Free column */}
            <View style={styles.compColumn}>
              <View style={styles.compHeader}>
                <Text style={styles.compHeaderLabel}>Free</Text>
              </View>
              {FREE_FEATURES.map((f, i) => (
                <View key={i} style={styles.compRow}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.textTertiary} />
                  <Text style={styles.compFeature}>{f}</Text>
                </View>
              ))}
            </View>

            {/* Divider */}
            <View style={styles.compDivider} />

            {/* Premium column */}
            <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.compColumn}>
              <View style={styles.compHeader}>
                <Ionicons name="star" size={12} color={COLORS.primary} />
                <Text style={[styles.compHeaderLabel, { color: COLORS.primary }]}>Premium</Text>
              </View>
              {PREMIUM_FEATURES.map((f, i) => (
                <View key={i} style={styles.compRow}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  <Text style={[styles.compFeature, { color: COLORS.text }]}>{f}</Text>
                </View>
              ))}
            </LinearGradient>
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.testimonialsTitle}>What users say</Text>
          {[
            { name: 'Sarah M.', text: 'Saved me so much money on groceries. I never waste food anymore!', stars: 5 },
            { name: 'James K.', text: 'The AI scanning is incredible. Takes 2 seconds and it knows everything.', stars: 5 },
          ].map((t, i) => (
            <View key={i} style={styles.testimonial}>
              <View style={styles.testimonialStars}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Ionicons key={j} name="star" size={12} color={COLORS.star} />
                ))}
              </View>
              <Text style={styles.testimonialText}>"{t.text}"</Text>
              <Text style={styles.testimonialName}>— {t.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={['#16A34A', '#15803D']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaBtnGradient}
          >
            <Text style={styles.ctaBtnText}>Start Free Trial →</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.ctaLegal}>No payment today · Cancel anytime · Renews automatically</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  hero: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.section },
  backBtn: {
    alignSelf: 'flex-start', padding: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  heroContent: { alignItems: 'center', gap: SPACING.md },
  crownWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  crownEmoji: { fontSize: 36 },
  heroTitle: { ...FONT.h2, color: '#FFFFFF', textAlign: 'center' },
  heroSub: { ...FONT.body, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },
  trialBadge: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
  },
  trialText: { ...FONT.bodySmallMedium, color: '#F59E0B' },

  scroll: { padding: SPACING.xl, gap: SPACING.xxl },

  // Plans
  plansSection: { gap: SPACING.md },
  plansTitle: { ...FONT.h4, color: COLORS.text },
  plans: { gap: SPACING.sm },
  planCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg,
    borderWidth: 2, borderColor: COLORS.border, gap: SPACING.md,
    ...SHADOWS.xs,
  },
  planCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryFaint },
  planBadge: {
    position: 'absolute', top: -10, right: SPACING.lg,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm, paddingVertical: 3,
  },
  planBadgeGold: { backgroundColor: '#D97706' },
  planBadgeText: { ...FONT.captionMedium, color: '#FFFFFF', fontSize: 10 },
  planRadio: {},
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: COLORS.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  planInfo: { flex: 1, gap: 2 },
  planLabel: { ...FONT.bodySemiBold, color: COLORS.text },
  planLabelActive: { color: COLORS.primary },
  planPerMonth: { ...FONT.caption, color: COLORS.textTertiary },
  planPriceWrap: { alignItems: 'flex-end' },
  planPrice: { ...FONT.h4, color: COLORS.text },
  planPriceActive: { color: COLORS.primary },
  planPeriod: { ...FONT.caption, color: COLORS.textTertiary },

  // Comparison
  comparisonSection: { gap: SPACING.md },
  compTitle: { ...FONT.h4, color: COLORS.text },
  comparison: { flexDirection: 'row', borderRadius: RADIUS.xl, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  compColumn: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
  compDivider: { width: 1, backgroundColor: COLORS.border },
  compHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs },
  compHeaderLabel: { ...FONT.label, color: COLORS.textSecondary },
  compRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  compFeature: { ...FONT.bodySmall, color: COLORS.textSecondary, flex: 1, lineHeight: 18 },

  // Testimonials
  testimonialsSection: { gap: SPACING.md },
  testimonialsTitle: { ...FONT.h4, color: COLORS.text },
  testimonial: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg,
    gap: SPACING.sm, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  testimonialStars: { flexDirection: 'row', gap: 2 },
  testimonialText: { ...FONT.body, color: COLORS.text, lineHeight: 24 },
  testimonialName: { ...FONT.bodySmallMedium, color: COLORS.textSecondary },

  // CTA
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
    backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: COLORS.borderLight,
    gap: SPACING.sm, ...SHADOWS.lg,
  },
  ctaBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.green },
  ctaBtnGradient: { height: 54, alignItems: 'center', justifyContent: 'center' },
  ctaBtnText: { ...FONT.h5, color: COLORS.white },
  ctaLegal: { ...FONT.caption, color: COLORS.textTertiary, textAlign: 'center' },
});
