// src/screens/premium/SubscriptionScreen.jsx
import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Lock, Bell, Crown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ICON_STROKE } from '../../constants/icons';
import { useThemeColors } from '../../context/ThemeContext';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

// ─── Timeline steps ────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    Icon: Lock,
    iconBg: '#3E6B50',
    iconColor: '#FFFFFF',
    title: 'Today',
    sub: 'Unlock all features — unlimited scans, AI detection, premium recipes & meal plans.',
  },
  {
    Icon: Bell,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    title: 'In 5 Days — Reminder',
    sub: "We'll send you a reminder that your trial is ending soon.",
  },
  {
    Icon: Crown,
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
    title: 'In 7 Days — Billing Starts',
    sub: 'You will be charged unless you cancel any time before.',
  },
];

// ─── Plans ────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'trial',
    title: '7-Days Trial',
    sub: 'Free for 7 days',
    badge: null,
    price: '0,00 €',
  },
  {
    id: 'yearly',
    title: 'Yearly Plan',
    sub: '7 days free, then 39,99 € / year',
    badge: 'Best Value',
    price: '39,99 €',
  },
];

// ─── Timeline step ────────────────────────────────────────────────────────────
function TimelineStep({ item, isLast, C }) {
  const { Icon, iconBg, iconColor, title, sub } = item;
  return (
    <View style={tl.row}>
      <View style={tl.leftCol}>
        <View style={[tl.iconWrap, { backgroundColor: iconBg }]}>
          <Icon size={16} color={iconColor} strokeWidth={ICON_STROKE} />
        </View>
        {!isLast && <View style={[tl.line, { backgroundColor: C.border }]} />}
      </View>
      <View style={tl.textWrap}>
        <Text style={[tl.title, { color: C.text }]}>{title}</Text>
        <Text style={[tl.sub, { color: C.textSecondary }]}>{sub}</Text>
      </View>
    </View>
  );
}

const tl = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.lg, minHeight: 64 },
  leftCol: { alignItems: 'center', width: 44 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  line: { flex: 1, width: 2, marginTop: 4, marginBottom: -4 },
  textWrap: { flex: 1, paddingTop: 8, paddingBottom: SPACING.lg },
  title: { fontSize: 13, fontFamily: 'Poppins_400Regular', fontWeight: '400', marginBottom: 2 },
  sub: { fontSize: 12, lineHeight: 18 },
});

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({ plan, selected, onPress, C }) {
  const active = selected === plan.id;
  return (
    <Pressable
      onPress={() => onPress(plan.id)}
      style={({ pressed }) => [
        pc.card,
        { backgroundColor: C.surface, borderColor: C.border },
        active && { borderColor: C.primary, backgroundColor: C.primaryFaint },
        pressed && { opacity: 0.88 },
      ]}
      android_ripple={{ color: 'rgba(62,107,80,0.06)' }}
    >
      <View style={pc.left}>
        <Text style={[pc.title, { color: C.text }]}>{plan.title}</Text>
        <Text style={[pc.sub, { color: C.textSecondary }]}>{plan.sub}</Text>
      </View>
      <View style={[pc.radioOuter, { borderColor: C.border }, active && { borderColor: C.primary }]}>
        {active && <View style={[pc.radioInner, { backgroundColor: C.primary }]} />}
      </View>
      {plan.badge && (
        <View style={pc.badge}>
          <Text style={pc.badgeText}>{plan.badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

const pc = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg, borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    ...SHADOWS.xs,
  },
  left: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontFamily: 'Poppins_400Regular', fontWeight: '400' },
  sub: { fontSize: 13 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  badge: {
    position: 'absolute', top: -9, right: SPACING.md,
    backgroundColor: '#D97706', borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  badgeText: { fontSize: 9, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF' },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SubscriptionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const [selected, setSelected] = useState('trial');

  const activePlan = PLANS.find(p => p.id === selected);
  const ctaLabel = selected === 'trial'
    ? `Redeem 7 days for 0,00 €`
    : `Start Free Trial — then ${activePlan?.price}`;
  const legalLabel = selected === 'trial'
    ? '7 days free, then 39,99 €/year · Cancel anytime'
    : '7 days free, then billed yearly · Cancel anytime';

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm, borderBottomColor: C.border, backgroundColor: C.background }]}>
        <View style={styles.headerLeft}>
          <View style={styles.headerLogoDot} />
          <Text style={[styles.headerLogo, { color: C.text }]}>FRIDGR</Text>
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.closeBtn, { backgroundColor: C.surface2 }, pressed && { opacity: 0.6 }]}
          hitSlop={8}
        >
          <X size={16} color={C.textSecondary} strokeWidth={ICON_STROKE} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* ── Title ── */}
        <Text style={[styles.title, { color: C.text }]}>Design your trial</Text>

        {/* ── Timeline ── */}
        <View style={styles.timeline}>
          {TIMELINE.map((item, i) => (
            <TimelineStep key={item.title} item={item} isLast={i === TIMELINE.length - 1} C={C} />
          ))}
        </View>

        {/* ── Divider ── */}
        <View style={[styles.divider, { backgroundColor: C.border }]} />

        {/* ── Plans ── */}
        <View style={styles.plansWrap}>
          {PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selected}
              onPress={setSelected}
              C={C}
            />
          ))}
        </View>
      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View style={[styles.ctaWrap, { 
        bottom: Platform.OS === 'android' ? 70 + insets.bottom : 0,
        paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, SPACING.md) + SPACING.xs : Math.max(insets.bottom, SPACING.md) + 70 + SPACING.xs, 
        backgroundColor: C.background, borderTopColor: C.border 
      }]}>
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] }, { overflow: 'hidden' }]}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
        >
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </LinearGradient>
        </Pressable>
        <Text style={[styles.ctaLegal, { color: C.textTertiary }]}>{legalLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerLogoDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#3E6B50' },
  headerLogo: { fontSize: 14, fontFamily: 'Poppins_400Regular', fontWeight: '400', letterSpacing: 0.5 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },

  title: { fontSize: 22, fontFamily: 'Poppins_400Regular', fontWeight: '400', letterSpacing: -0.4, marginBottom: SPACING.xl },

  timeline: { gap: 0, marginBottom: SPACING.lg },

  divider: { height: 1, marginBottom: SPACING.lg },

  plansWrap: { gap: SPACING.lg },

  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: SPACING.sm,
    ...SHADOWS.lg,
  },
  ctaBtn: { borderRadius: RADIUS.full, overflow: 'hidden', ...SHADOWS.green },
  ctaGradient: { height: 48, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 14, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF' },
  ctaLegal: { fontSize: 11, textAlign: 'center' },
});
