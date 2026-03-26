// src/screens/onboarding/TrialScreen.jsx
// Cal AI-style trial/paywall screen — shown after questionnaire, before sign-up
import { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Leaf, Camera, ChefHat, Heart } from 'lucide-react-native';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import {
  PREMIUM_CTA_VERTICAL, PREMIUM_CTA_VERTICAL_START, PREMIUM_CTA_VERTICAL_END,
} from '../../constants/premiumScreenTheme';

const PLANS = [
  { id: 'weekly',  label: 'Weekly',  price: '$2.99', per: '/week',  badge: null },
  { id: 'monthly', label: 'Monthly', price: '$7.99', per: '/month', badge: null },
  { id: 'yearly',  label: 'Yearly',  price: '$39.99', per: '/year', perMonth: 'just $3.33/mo', badge: 'Best Value' },
];

const FEATURES = [
  { Icon: Camera,   text: 'Unlimited ingredient scans' },
  { Icon: ChefHat,  text: 'AI-generated personalized recipes' },
  { Icon: Heart,    text: 'Save & organize your favourites' },
  { Icon: Leaf,     text: 'Dietary & allergy filtering' },
];

const TIMELINE = [
  { day: 'Today',  label: 'Full access\nactivated', active: true },
  { day: 'Day 5',  label: 'Reminder\nsent to you', active: false },
  { day: 'Day 7',  label: 'Trial ends,\nbilling starts', active: false },
];

export default function TrialScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('yearly');

  const handleStart = () => navigation.navigate(ROUTES.ONBOARDING_HANDOFF);
  const handleSkip  = () => navigation.navigate(ROUTES.ONBOARDING_HANDOFF);

  return (
    <View style={s.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + SPACING.xl, paddingBottom: insets.bottom + 32 }]}
      >

        {/* ── Header ── */}
        <View style={s.header}>
          {/* Fridge icon pill */}
          <View style={s.iconPill}>
            <Text style={{ fontSize: 22 }}>🧊</Text>
          </View>
          <Text style={s.eyebrow}>LIMITED TIME OFFER</Text>
          <Text style={s.title}>Try Fridgr free{'\n'}for 7 days</Text>
          <Text style={s.subtitle}>
            Unlock every premium feature. No payment due now.{'\n'}Cancel anytime before day 7.
          </Text>
        </View>

        {/* ── Trust chips ── */}
        <View style={s.chips}>
          <View style={s.chip}>
            <Check size={13} color="#3E6B50" strokeWidth={2.5} />
            <Text style={s.chipText}>No Payment Due Now</Text>
          </View>
          <View style={s.chip}>
            <Check size={13} color="#3E6B50" strokeWidth={2.5} />
            <Text style={s.chipText}>Cancel Anytime</Text>
          </View>
        </View>

        {/* ── Timeline ── */}
        <View style={s.timeline}>
          {TIMELINE.map((item, i) => (
            <View key={i} style={s.timelineItem}>
              <View style={[s.timelineDot, item.active && s.timelineDotActive]}>
                {item.active && <View style={s.timelineDotInner} />}
              </View>
              {i < TIMELINE.length - 1 && <View style={s.timelineLine} />}
              <Text style={[s.timelineDay, item.active && { color: '#3E6B50', fontWeight: '700' }]}>
                {item.day}
              </Text>
              <Text style={s.timelineLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Features ── */}
        <View style={s.features}>
          {FEATURES.map(({ Icon, text }, i) => (
            <View key={i} style={s.featureRow}>
              <View style={s.featureIconWrap}>
                <Icon size={16} color="#3E6B50" strokeWidth={2} />
              </View>
              <Text style={s.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* ── Plan Selector ── */}
        <View style={s.plans}>
          {PLANS.map(plan => {
            const active = selected === plan.id;
            return (
              <Pressable
                key={plan.id}
                style={({ pressed }) => [s.plan, active && s.planActive, pressed && { opacity: 0.9 }]}
                onPress={() => setSelected(plan.id)}
              >
                {plan.badge && (
                  <View style={s.planBadge}>
                    <Text style={s.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <View style={s.planLeft}>
                  <View style={[s.radio, active && s.radioActive]}>
                    {active && <View style={s.radioInner} />}
                  </View>
                  <Text style={[s.planLabel, active && { color: '#3E6B50' }]}>{plan.label}</Text>
                </View>
                <View style={s.planRight}>
                  <Text style={[s.planPrice, active && { color: '#3E6B50' }]}>{plan.price}</Text>
                  <Text style={s.planPer}>{plan.per}</Text>
                </View>
                {plan.perMonth && (
                  <View style={s.planSaving}>
                    <Text style={s.planSavingText}>{plan.perMonth}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* ── CTA ── */}
        <Pressable
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.9 }]}
          onPress={handleStart}
        >
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={s.ctaGrad}
          >
            <Text style={s.ctaText}>Start My Free 7-Day Trial</Text>
          </LinearGradient>
        </Pressable>

        {/* ── Skip ── */}
        <Pressable style={s.skip} onPress={handleSkip}>
          <Text style={s.skipText}>No thanks, skip trial</Text>
        </Pressable>

        <Text style={s.legal}>
          Subscription auto-renews after the free trial. Cancel at any time before the trial ends.
          Prices shown in USD.
        </Text>
      </ScrollView>
    </View>
  );
}

const BG = '#F9F7F2';
const GREEN = '#3E6B50';

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: SPACING.xl },

  // ─── Header ─────────────────────────────────────────────────────────────
  header:   { alignItems: 'center', marginBottom: SPACING.xl },
  iconPill: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#D4E8DA', alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  eyebrow: {
    fontSize: 10, fontWeight: '800', letterSpacing: 1.8,
    color: GREEN, textTransform: 'uppercase', marginBottom: SPACING.sm,
  },
  title: {
    ...FONT.h1, color: '#1E1E1C', textAlign: 'center',
    letterSpacing: -0.8, lineHeight: 36, marginBottom: SPACING.md,
  },
  subtitle: {
    ...FONT.bodySmall, color: '#6B6B68', textAlign: 'center', lineHeight: 20,
  },

  // ─── Chips ──────────────────────────────────────────────────────────────
  chips: { flexDirection: 'row', gap: SPACING.sm, justifyContent: 'center', marginBottom: SPACING.xl },
  chip:  {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#EDF5F0', borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
    borderWidth: 1, borderColor: '#D0E8D8',
  },
  chipText: { fontSize: 12, fontWeight: '600', color: GREEN },

  // ─── Timeline ───────────────────────────────────────────────────────────
  timeline: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl,
    padding: SPACING.lg, marginBottom: SPACING.xl,
    borderWidth: 1, borderColor: '#EAE6DD',
    ...SHADOWS.sm,
  },
  timelineItem:      { alignItems: 'center', flex: 1, gap: SPACING.xs },
  timelineDot:       { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E4DDD2', marginBottom: 2 },
  timelineDotActive: { backgroundColor: GREEN },
  timelineDotInner:  { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF', position: 'absolute', top: 4, left: 4 },
  timelineLine:      { position: 'absolute', top: 7, left: '60%', right: '-60%', height: 1, backgroundColor: '#E4DDD2' },
  timelineDay:       { fontSize: 12, fontWeight: '600', color: '#4A4A46' },
  timelineLabel:     { fontSize: 10, color: '#8A8A84', textAlign: 'center', lineHeight: 14 },

  // ─── Features ───────────────────────────────────────────────────────────
  features: { gap: SPACING.sm, marginBottom: SPACING.xl },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderWidth: 1, borderColor: '#EAE6DD',
  },
  featureIconWrap: {
    width: 32, height: 32, borderRadius: RADIUS.md,
    backgroundColor: '#EDF5F0', alignItems: 'center', justifyContent: 'center',
  },
  featureText: { ...FONT.bodyMedium, color: '#1E1E1C', flex: 1 },

  // ─── Plans ──────────────────────────────────────────────────────────────
  plans: { gap: SPACING.sm, marginBottom: SPACING.xl },
  plan: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl,
    padding: SPACING.lg, borderWidth: 1.5, borderColor: '#E4DDD2',
    ...SHADOWS.xs,
  },
  planActive: { borderColor: GREEN, backgroundColor: '#EDF5F0' },
  planBadge: {
    position: 'absolute', top: -10, right: 12,
    backgroundColor: GREEN, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  planBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.4 },
  planLeft:  { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  radio:     { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#C4C0B8', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: GREEN },
  radioInner:  { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN },
  planLabel: { ...FONT.bodyMedium, color: '#1E1E1C' },
  planRight: { alignItems: 'flex-end', gap: 1 },
  planPrice: { ...FONT.h4, color: '#1E1E1C' },
  planPer:   { ...FONT.caption, color: '#8A8A84' },
  planSaving: {
    position: 'absolute', right: SPACING.lg, bottom: -10,
    backgroundColor: '#FAF0D0', borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  planSavingText: { fontSize: 10, fontWeight: '700', color: '#8A6820' },

  // ─── CTA ────────────────────────────────────────────────────────────────
  cta: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOWS.green },
  ctaGrad: { height: 56, alignItems: 'center', justifyContent: 'center' },
  ctaText: { ...FONT.h5, color: '#FFFFFF', fontWeight: '700' },

  // ─── Skip ───────────────────────────────────────────────────────────────
  skip: { alignItems: 'center', paddingVertical: SPACING.sm, marginBottom: SPACING.sm },
  skipText: { ...FONT.bodySmallMedium, color: '#8A8A84' },

  // ─── Legal ──────────────────────────────────────────────────────────────
  legal: { ...FONT.caption, color: '#C4C0B8', textAlign: 'center', lineHeight: 16 },
});
