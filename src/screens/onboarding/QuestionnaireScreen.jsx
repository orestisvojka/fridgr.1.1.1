// src/screens/onboarding/QuestionnaireScreen.jsx
// Multi-select and steps with advance: 'confirm' use Continue; other singles advance on tap.

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { QUESTIONNAIRE_STEPS } from '../../data/questionnaireSteps';
import { ICON_STROKE } from '../../constants/icons';
import { getQuestionnaireIcon } from '../../constants/questionnaireIcons';
import { ROUTES } from '../../constants/routes';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import {
  PREMIUM,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const { width: SCREEN_W } = Dimensions.get('window');
const TOTAL = QUESTIONNAIRE_STEPS.length;

function ProgressDots({ index, total }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === index && styles.dotActive,
            i < index && styles.dotDone,
          ]}
        />
      ))}
    </View>
  );
}

function OptionRow({
  option,
  selected,
  onPress,
  showCheck,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const OptionIcon = getQuestionnaireIcon(option.iconKey);

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.97, friction: 6, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={({ pressed }) => [pressed && { opacity: 0.92 }]}
    >
      <Animated.View
        style={[
          styles.optionShell,
          selected && styles.optionShellSelected,
          { transform: [{ scale }] },
        ]}
      >
        <LinearGradient
          colors={
            selected
              ? [PREMIUM.accentSoft, 'rgba(21,128,61,0.35)']
              : ['rgba(30,41,59,0.55)', 'rgba(15,23,42,0.4)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.optionGradient}
        >
          <View style={[styles.optionIcon, selected && styles.optionIconOn]}>
            <OptionIcon
              size={22}
              color={selected ? PREMIUM.accent : PREMIUM.textMuted}
              strokeWidth={ICON_STROKE}
            />
          </View>
          <View style={styles.optionCopy}>
            <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
            <Text style={styles.optionDesc}>{option.desc}</Text>
          </View>
          {showCheck ? (
            <View style={[styles.tick, selected && styles.tickOn]}>
              {selected ? (
                <Check size={16} color="#052E16" strokeWidth={ICON_STROKE + 0.5} />
              ) : null}
            </View>
          ) : null}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export default function QuestionnaireScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { answers, setAnswer, toggleMultiAnswer } = useOnboarding();

  const [stepIndex, setStepIndex] = useState(0);
  const advancing = useRef(false);
  const contentOp = useRef(new Animated.Value(1)).current;

  const step = QUESTIONNAIRE_STEPS[stepIndex];
  const isMulti = step.type === 'multi';
  const needsContinue = isMulti || step.advance === 'confirm';
  const showOptionCheck = isMulti || step.advance === 'confirm';

  const isAnswered = useCallback(() => {
    const answer = answers[step.id];
    if (isMulti) return Array.isArray(answer) && answer.length > 0;
    return !!answer;
  }, [answers, step.id, isMulti]);

  const pulseContent = useCallback(() => {
    Animated.sequence([
      Animated.timing(contentOp, { toValue: 0.25, duration: 90, useNativeDriver: true }),
      Animated.timing(contentOp, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [contentOp]);

  const goNextOrFinish = useCallback(
    (fromIndex) => {
      if (fromIndex >= TOTAL - 1) {
        navigation.navigate(ROUTES.ONBOARDING_HANDOFF);
        return;
      }
      setStepIndex(fromIndex + 1);
    },
    [navigation],
  );

  const handleSingleTap = useCallback(
    (optionId) => {
      if (advancing.current) return;
      setAnswer(step.id, optionId);
      pulseContent();
      if (step.advance === 'confirm') return;
      advancing.current = true;
      const idx = stepIndex;
      setTimeout(() => {
        goNextOrFinish(idx);
        advancing.current = false;
      }, 340);
    },
    [step.id, step.advance, stepIndex, goNextOrFinish, pulseContent, setAnswer],
  );

  const handleMultiTap = useCallback(
    (optionId) => {
      toggleMultiAnswer(step.id, optionId);
    },
    [step.id, toggleMultiAnswer],
  );

  const handleContinue = useCallback(() => {
    if (!isAnswered() || advancing.current) return;
    advancing.current = true;
    pulseContent();
    const idx = stepIndex;
    setTimeout(() => {
      goNextOrFinish(idx);
      advancing.current = false;
    }, 280);
  }, [isAnswered, stepIndex, goNextOrFinish, pulseContent]);

  const handleBack = useCallback(() => {
    if (stepIndex <= 0 || advancing.current) return;
    setStepIndex((s) => s - 1);
  }, [stepIndex]);

  useEffect(() => {
    contentOp.setValue(1);
  }, [stepIndex, contentOp]);

  const isSelected = (optionId) => {
    const answer = answers[step.id];
    if (isMulti) return Array.isArray(answer) && answer.includes(optionId);
    return answer === optionId;
  };

  return (
    <PremiumScreenShell>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <Pressable
          onPress={handleBack}
          disabled={stepIndex === 0}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && stepIndex > 0 && { opacity: 0.85 },
          ]}
        >
          <ArrowLeft
            size={22}
            color={stepIndex === 0 ? 'rgba(248,250,252,0.22)' : PREMIUM.text}
            strokeWidth={ICON_STROKE}
          />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>
              Step {stepIndex + 1} of {TOTAL}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressRow}>
              <View style={{ flex: stepIndex + 1 }}>
                <View style={styles.progressFill} />
              </View>
              <View style={{ flex: Math.max(0, TOTAL - stepIndex - 1) }} />
            </View>
          </View>
          <ProgressDots index={stepIndex} total={TOTAL} />
        </View>
        <View style={{ width: 44 }} />
      </View>

      <Animated.View style={[styles.body, { opacity: contentOp }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollInner,
            { paddingBottom: insets.bottom + (needsContinue ? 140 : 64) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.questionCard}>
            <View style={styles.kickerRow}>
              <View style={styles.kickerDot} />
              <Text style={styles.kicker}>Personalize FRIDGR</Text>
            </View>
            <Text style={styles.question}>{step.question}</Text>
            <Text style={styles.subtitle}>{step.subtitle}</Text>
          </View>

          <View style={styles.options}>
            {step.options.map((option) => (
              <OptionRow
                key={option.id}
                option={option}
                selected={isSelected(option.id)}
                onPress={() => (isMulti ? handleMultiTap(option.id) : handleSingleTap(option.id))}
                showCheck={showOptionCheck}
              />
            ))}
          </View>

          <View style={styles.hintWrap}>
            <Text style={styles.hint}>
              {isMulti
                ? 'Select all that apply, then tap the button below'
                : step.advance === 'confirm'
                  ? 'Choose an option, then tap Continue'
                  : 'Tap an answer to go to the next question'}
            </Text>
          </View>
        </ScrollView>
      </Animated.View>

      {needsContinue ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
          <Pressable
            onPress={handleContinue}
            disabled={!isAnswered()}
            style={({ pressed }) => [
              styles.continueBtnOuter,
              isAnswered() && styles.continueBtnOuterEnabled,
              pressed && isAnswered() && { transform: [{ scale: 0.985 }] },
            ]}
          >
            {isAnswered() ? (
              <LinearGradient
                colors={PREMIUM_CTA_VERTICAL}
                start={PREMIUM_CTA_VERTICAL_START}
                end={PREMIUM_CTA_VERTICAL_END}
                style={styles.continueGrad}
              >
                <Text style={styles.continueText}>
                  {stepIndex >= TOTAL - 1 ? 'Finish' : 'Continue'}
                </Text>
                <ChevronRight size={20} color="#FFFFFF" strokeWidth={ICON_STROKE} />
              </LinearGradient>
            ) : (
              <View style={styles.continueSolidDisabled}>
                <Text style={styles.continueTextDisabled}>
                  {stepIndex >= TOTAL - 1 ? 'Finish' : 'Continue'}
                </Text>
                <ChevronRight size={20} color="#64748B" strokeWidth={ICON_STROKE} />
              </View>
            )}
          </Pressable>
        </View>
      ) : null}
    </PremiumScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderWidth: 1,
    borderColor: PREMIUM.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center', gap: 10, paddingHorizontal: SPACING.xs },
  stepPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderWidth: 1,
    borderColor: PREMIUM.glassBorder,
  },
  stepPillText: {
    ...FONT.captionMedium,
    color: PREMIUM.textMuted,
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    maxWidth: SCREEN_W - 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressRow: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
  },
  progressFill: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: PREMIUM.accent,
  },
  dotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    maxWidth: SCREEN_W - 120,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  dotDone: { backgroundColor: 'rgba(74,222,128,0.5)' },
  dotActive: {
    width: 16,
    borderRadius: 2,
    backgroundColor: PREMIUM.accent,
  },
  body: { flex: 1 },
  scrollInner: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  questionCard: {
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: PREMIUM.cardBg,
    borderWidth: 1,
    borderColor: PREMIUM.cardBorder,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  kickerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PREMIUM.accent,
  },
  kicker: {
    ...FONT.labelSmall,
    color: PREMIUM.accent,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  question: {
    fontSize: 27,
    fontWeight: '800',
    color: PREMIUM.text,
    letterSpacing: -0.7,
    lineHeight: 33,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONT.body,
    fontSize: 15,
    color: PREMIUM.textMuted,
    lineHeight: 22,
    maxWidth: 340,
  },
  options: { gap: SPACING.md },
  optionShell: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PREMIUM.glassBorder,
    ...SHADOWS.sm,
  },
  optionShellSelected: {
    borderColor: 'rgba(74,222,128,0.65)',
    borderWidth: 1.5,
    ...SHADOWS.green,
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(30,41,59,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconOn: {
    backgroundColor: 'rgba(22,101,52,0.55)',
  },
  optionCopy: { flex: 1, gap: 3 },
  optionLabel: {
    ...FONT.bodySemiBold,
    fontSize: 16,
    color: PREMIUM.text,
  },
  optionLabelSelected: { color: '#ECFDF5' },
  optionDesc: {
    ...FONT.bodySmall,
    color: PREMIUM.textMuted,
    lineHeight: 18,
  },
  tick: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickOn: {
    backgroundColor: PREMIUM.accent,
    borderColor: PREMIUM.accent,
  },
  hintWrap: {
    marginTop: SPACING.xxl,
    alignSelf: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(15,23,42,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    maxWidth: SCREEN_W - SPACING.xl * 2,
  },
  hint: {
    ...FONT.caption,
    color: 'rgba(248,250,252,0.45)',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    backgroundColor: PREMIUM.footerBg,
    borderTopWidth: 1,
    borderTopColor: '#13221a',
  },
  continueBtnOuter: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  continueBtnOuterEnabled: {
    ...SHADOWS.green,
  },
  continueGrad: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  continueSolidDisabled: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: PREMIUM.btnDisabledBg,
    borderWidth: 1,
    borderColor: PREMIUM.btnDisabledBorder,
    borderRadius: RADIUS.xl,
  },
  continueText: { ...FONT.h5, color: '#FFFFFF', fontWeight: '700' },
  continueTextDisabled: {
    ...FONT.h5,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
