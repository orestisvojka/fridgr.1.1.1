// src/screens/onboarding/QuestionnaireScreen.jsx
// Dark charcoal with a whisper of green + frosted glass. Selection = tick only.

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import { FONT, SPACING, RADIUS } from '../../constants/theme';
import { QUESTIONNAIRE_STEPS } from '../../data/questionnaireSteps';
import { ICON_STROKE } from '../../constants/icons';
import { getQuestionnaireIcon } from '../../constants/questionnaireIcons';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_START,
  PREMIUM_CTA_VERTICAL_END,
} from '../../constants/premiumScreenTheme';

const { width: SCREEN_W } = Dimensions.get('window');
const TOTAL = QUESTIONNAIRE_STEPS.length;

// ─── Palette — dark charcoal, barely green ──────────────────────────────────
const BG_TOP  = '#1A1F1C';   // near-black with green tint
const BG_MID  = '#222A26';   // charcoal-green
const BG_BOT  = '#2A3430';   // slightly lighter
const G_TICK  = '#4A7C5E';   // tick fill — only real green accent
const TEXT_PRI = 'rgba(255,255,255,0.92)';
const TEXT_SEC = 'rgba(255,255,255,0.50)';

// ─── Glass card ─────────────────────────────────────────────────────────────
function GlassCard({ style, children }) {
  return (
    <View style={[gl.card, style]}>
      <View style={gl.shimmer} />
      {children}
    </View>
  );
}

const gl = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 5,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
});

// ─── Option row — tick-only selection ────────────────────────────────────────
function OptionRow({ option, selected, onPress }) {
  const OptionIcon = getQuestionnaireIcon(option.iconKey);
  const scaleAnim  = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.975, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 130, friction: 6, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        android_ripple={null}
        style={({ pressed }) => pressed && { opacity: 0.88 }}
      >
        <GlassCard style={opt.shell}>
          {option.iconKey && (
            <View style={opt.iconWrap}>
              <OptionIcon size={20} color={TEXT_PRI} strokeWidth={ICON_STROKE} />
            </View>
          )}
          <View style={opt.copy}>
            <Text style={opt.label}>{option.label}</Text>
            {option.desc ? <Text style={opt.desc}>{option.desc}</Text> : null}
          </View>
          <View style={[opt.tick, selected && opt.tickOn]}>
            {selected && <Check size={13} color="#FFFFFF" strokeWidth={ICON_STROKE + 0.5} />}
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

const opt = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  label: { ...FONT.bodySemiBold, fontSize: 15, color: TEXT_PRI },
  desc: { ...FONT.bodySmall, fontSize: 12, color: TEXT_SEC, lineHeight: 17 },
  tick: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickOn: {
    backgroundColor: G_TICK,
    borderColor: G_TICK,
  },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function QuestionnaireScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { answers, setAnswer, toggleMultiAnswer, completeOnboarding } = useOnboarding();

  const [stepIndex, setStepIndex] = useState(0);
  const advancing    = useRef(false);
  const contentOp    = useRef(new Animated.Value(0)).current;
  const contentX     = useRef(new Animated.Value(28)).current;
  const scrollRef    = useRef(null);
  const orb1Y        = useRef(new Animated.Value(0)).current;
  const orb2Y        = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value((1 / TOTAL) * 100)).current;

  const step   = QUESTIONNAIRE_STEPS[stepIndex];
  const isMulti = step.type === 'multi';

  // Orb float
  useEffect(() => {
    const l1 = Animated.loop(Animated.sequence([
      Animated.timing(orb1Y, { toValue: -14, duration: 3200, useNativeDriver: true }),
      Animated.timing(orb1Y, { toValue:   0, duration: 3200, useNativeDriver: true }),
    ]));
    const l2 = Animated.loop(Animated.sequence([
      Animated.timing(orb2Y, { toValue: 12, duration: 3800, useNativeDriver: true }),
      Animated.timing(orb2Y, { toValue:  0, duration: 3800, useNativeDriver: true }),
    ]));
    l1.start(); l2.start();
    return () => { l1.stop(); l2.stop(); };
  }, []);

  // Step transition
  useEffect(() => {
    contentOp.setValue(0);
    Animated.parallel([
      Animated.timing(contentOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(contentX,  { toValue: 0, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
    Animated.timing(progressAnim, {
      toValue: ((stepIndex + 1) / TOTAL) * 100,
      duration: 420,
      useNativeDriver: false,
    }).start();
  }, [stepIndex]);

  const isAnswered = useCallback(() => {
    const a = answers[step.id];
    if (isMulti) return Array.isArray(a) && a.length > 0;
    return !!a;
  }, [answers, step.id, isMulti]);

  const goNextOrFinish = useCallback((fromIndex) => {
    if (fromIndex >= TOTAL - 1) {
      completeOnboarding();
    } else {
      setStepIndex(fromIndex + 1);
    }
  }, [completeOnboarding]);

  const animateOut = (dir, cb) => {
    advancing.current = true;
    contentX.setValue(0);
    Animated.parallel([
      Animated.timing(contentOp, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(contentX,  { toValue: dir === 'fwd' ? -28 : 28, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      contentX.setValue(dir === 'fwd' ? 32 : -32);
      advancing.current = false;
      cb();
    });
  };

  const handleContinue = useCallback(() => {
    if (!isAnswered() || advancing.current) return;
    animateOut('fwd', () => goNextOrFinish(stepIndex));
  }, [isAnswered, stepIndex, goNextOrFinish]);

  const handleBack = useCallback(() => {
    if (stepIndex <= 0 || advancing.current) return;
    animateOut('back', () => setStepIndex(s => s - 1));
  }, [stepIndex]);

  const handleSelect = (id) => {
    isMulti ? toggleMultiAnswer(step.id, id) : setAnswer(step.id, id);
  };

  const isSelected = (id) => {
    const a = answers[step.id];
    if (isMulti) return Array.isArray(a) && a.includes(id);
    return a === id;
  };

  const answered = isAnswered();

  return (
    <View style={s.root}>
      <LinearGradient
        colors={[BG_TOP, BG_MID, BG_BOT]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[s.orb1, { transform: [{ translateY: orb1Y }] }]} />
      <Animated.View style={[s.orb2, { transform: [{ translateY: orb2Y }] }]} />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + SPACING.sm }]}>
        <Pressable
          onPress={handleBack}
          disabled={stepIndex === 0}
          hitSlop={8}
          style={({ pressed }) => [
            stepIndex === 0 && { opacity: 0.22 },
            pressed && stepIndex > 0 && { opacity: 0.7 },
          ]}
        >
          <GlassCard style={s.backGlass}>
            <ArrowLeft size={20} color={TEXT_PRI} strokeWidth={ICON_STROKE} />
          </GlassCard>
        </Pressable>

        <GlassCard style={s.progressPill}>
          <Text style={s.stepLabel}>
            {stepIndex + 1}
            <Text style={s.stepOf}> / {TOTAL}</Text>
          </Text>
          <View style={s.track}>
            <Animated.View
              style={[
                s.trackFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </GlassCard>

        <View style={{ width: 44 }} />
      </View>

      {/* Content */}
      <Animated.View style={[s.body, { opacity: contentOp, transform: [{ translateX: contentX }] }]}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 130 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <GlassCard style={s.qCard}>
            <Text style={s.badge}>Personalize FRIDGR</Text>
            <Text style={s.question}>{step.question}</Text>
            {step.subtitle ? <Text style={s.subtitle}>{step.subtitle}</Text> : null}
          </GlassCard>

          <View style={s.options}>
            {step.options.map((o) => (
              <OptionRow
                key={o.id}
                option={o}
                selected={isSelected(o.id)}
                onPress={() => handleSelect(o.id)}
              />
            ))}
          </View>

          <Text style={s.hint}>
            {isMulti ? 'Select all that apply' : 'Choose one option'}
          </Text>
        </ScrollView>
      </Animated.View>

      {/* Footer CTA */}
      <View style={[s.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={['rgba(42,52,48,0)', BG_BOT]}
            locations={[0, 0.35]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={!answered}
          android_ripple={null}
          style={({ pressed }) => [
            s.ctaBtn,
            answered && s.ctaBtnEnabled,
            pressed && answered && { transform: [{ scale: 0.982 }], opacity: 0.88 },
          ]}
        >
          {answered ? (
            <LinearGradient
              colors={PREMIUM_CTA_VERTICAL}
              start={PREMIUM_CTA_VERTICAL_START}
              end={PREMIUM_CTA_VERTICAL_END}
              style={s.ctaGrad}
            >
              <Text style={s.ctaText}>
                {stepIndex >= TOTAL - 1 ? 'Finish' : 'Continue'}
              </Text>
              <ChevronRight size={20} color="#FFFFFF" strokeWidth={ICON_STROKE} />
            </LinearGradient>
          ) : (
            <View style={s.ctaDisabled}>
              <Text style={s.ctaTextOff}>
                {stepIndex >= TOTAL - 1 ? 'Finish' : 'Continue'}
              </Text>
              <ChevronRight size={20} color="rgba(255,255,255,0.25)" strokeWidth={ICON_STROKE} />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_TOP },

  orb1: {
    position: 'absolute', top: -80, right: -80,
    width: SCREEN_W * 0.65, height: SCREEN_W * 0.65,
    borderRadius: SCREEN_W * 0.325,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  orb2: {
    position: 'absolute', bottom: 100, left: -100,
    width: SCREEN_W * 0.55, height: SCREEN_W * 0.55,
    borderRadius: SCREEN_W * 0.275,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, gap: SPACING.sm,
  },
  backGlass: {
    width: 40, height: 40, borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center',
  },
  progressPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    gap: SPACING.sm, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm, borderRadius: RADIUS.full,
  },
  stepLabel: { ...FONT.label, color: TEXT_PRI, fontWeight: '800', minWidth: 30 },
  stepOf: { fontWeight: '500', color: TEXT_SEC },
  track: {
    flex: 1, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.10)', overflow: 'hidden',
  },
  trackFill: { height: '100%', borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.55)' },

  body: { flex: 1 },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, gap: SPACING.md },

  qCard: { padding: SPACING.xl, marginBottom: SPACING.sm },
  badge: {
    ...FONT.labelSmall, fontSize: 10, fontWeight: '700',
    letterSpacing: 1.6, color: TEXT_SEC,
    textTransform: 'uppercase', marginBottom: SPACING.sm,
  },
  question: {
    fontSize: 26, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: -0.5, lineHeight: 32, marginBottom: SPACING.xs,
  },
  subtitle: { ...FONT.body, fontSize: 14, color: TEXT_SEC, lineHeight: 21 },

  options: { gap: SPACING.sm },

  hint: {
    ...FONT.caption, color: 'rgba(255,255,255,0.25)',
    textAlign: 'center', marginTop: SPACING.sm,
  },

  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl, overflow: 'hidden',
  },

  ctaBtn: { borderRadius: RADIUS.full, overflow: 'hidden' },
  ctaBtnEnabled: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30, shadowRadius: 14, elevation: 8,
  },
  ctaGrad: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: SPACING.xs, borderRadius: RADIUS.full,
  },
  ctaDisabled: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  ctaText: { ...FONT.h5, color: '#FFFFFF', fontWeight: '700' },
  ctaTextOff: { ...FONT.h5, color: 'rgba(255,255,255,0.30)', fontWeight: '600' },
});
