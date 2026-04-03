// src/screens/onboarding/QuestionnaireScreen.jsx
// Multi-select and steps with advance: 'confirm' use Continue; other singles advance on tap.

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { QUESTIONNAIRE_STEPS } from '../../data/questionnaireSteps';
import { ICON_STROKE } from '../../constants/icons';
import { getQuestionnaireIcon } from '../../constants/questionnaireIcons';
import { BlurView } from 'expo-blur';
import { ROUTES } from '../../constants/routes';
import { DEFAULT_RECIPE_IMAGE } from '../../data/recipeImages';
import {
  PREMIUM,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

const { width: SCREEN_W } = Dimensions.get('window');
const TOTAL = QUESTIONNAIRE_STEPS.length;



function OptionRow({
  option,
  selected,
  onPress,
}) {
  const OptionIcon = getQuestionnaireIcon(option.iconKey);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionShell,
        selected && styles.optionShellSelected,
        pressed && { opacity: 0.85 }
      ]}
      android_ripple={null}
    >
      {option.iconKey && (
        <View style={styles.optionIcon}>
          <OptionIcon
            size={22}
            color="#06402B"
            strokeWidth={ICON_STROKE}
          />
        </View>
      )}
        <View style={styles.optionCopy}>
        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
        <Text style={[styles.optionDesc, selected && styles.optionDescSelected]}>{option.desc}</Text>
      </View>
      <View style={[styles.tick, selected && styles.tickOn]}>
        {selected ? (
          <Check size={16} color="#FFFFFF" strokeWidth={ICON_STROKE + 0.5} />
        ) : null}
      </View>
    </Pressable>
  );
}

export default function QuestionnaireScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { answers, setAnswer, toggleMultiAnswer } = useOnboarding();

  const [stepIndex, setStepIndex] = useState(0);
  const advancing = useRef(false);
  const contentOp = useRef(new Animated.Value(0)).current;
  const contentTransY = useRef(new Animated.Value(15)).current;
  const scrollViewRef = useRef(null);

  const step = QUESTIONNAIRE_STEPS[stepIndex];
  const isMulti = step.type === 'multi';

  const isAnswered = useCallback(() => {
    const answer = answers[step.id];
    if (isMulti) return Array.isArray(answer) && answer.length > 0;
    return !!answer;
  }, [answers, step.id, isMulti]);

  const goNextOrFinish = useCallback(
    (fromIndex) => {
      if (fromIndex >= TOTAL - 1) {
        navigation.navigate(ROUTES.TRIAL);
        return;
      }
      setStepIndex(fromIndex + 1);
    },
    [navigation],
  );

  const handleSingleTap = useCallback(
    (optionId) => {
      setAnswer(step.id, optionId);
    },
    [step.id, setAnswer],
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
    
    Animated.parallel([
      Animated.timing(contentOp, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(contentTransY, { toValue: -15, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
      goNextOrFinish(stepIndex);
      contentTransY.setValue(15);
      advancing.current = false;
    });
  }, [isAnswered, stepIndex, goNextOrFinish, contentOp, contentTransY]);

  const handleBack = useCallback(() => {
    if (stepIndex <= 0 || advancing.current) return;
    advancing.current = true;
    
    Animated.parallel([
      Animated.timing(contentOp, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(contentTransY, { toValue: 15, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
      setStepIndex((s) => s - 1);
      contentTransY.setValue(-15);
      advancing.current = false;
    });
  }, [stepIndex, contentOp, contentTransY]);

  useEffect(() => {
    contentOp.setValue(0);
    Animated.parallel([
      Animated.timing(contentOp, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(contentTransY, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [stepIndex, contentOp, contentTransY]);

  const isSelected = (optionId) => {
    const answer = answers[step.id];
    if (isMulti) return Array.isArray(answer) && answer.includes(optionId);
    return answer === optionId;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F7F2' }}>
      {/* 100% Background Photo for the glass effect backdrop */}
      <Image 
        source={{ uri: DEFAULT_RECIPE_IMAGE }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      
      {/* Soft Frosted Glass Overlay mapping the entire screen to the Warm Cream aesthetic */}
      <LinearGradient 
        colors={['rgba(249,247,242,0.6)', 'rgba(249,247,242,0.95)']}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill} 
      />
      <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} pointerEvents="none" />

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
            color={stepIndex === 0 ? 'rgba(248,250,252,0.22)' : '#FFFFFF'}
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
        </View>
        <View style={{ width: 44 }} />
      </View>

      <Animated.View style={[styles.body, { opacity: contentOp, transform: [{ translateY: contentTransY }] }]}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollInner,
            { paddingBottom: insets.bottom + 140 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
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
              />
            ))}
          </View>

          <View style={styles.hintWrap}>
            <Text style={styles.hint}>
              {isMulti
                ? 'Select all that apply, then tap Continue'
                : 'Choose an option, then tap Continue'}
            </Text>
          </View>
        </ScrollView>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
          <Pressable
            onPress={handleContinue}
            disabled={!isAnswered()}
            android_ripple={null}
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
    </View>
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
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center', gap: 10, paddingHorizontal: SPACING.xs },
  stepPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  stepPillText: {
    ...FONT.captionMedium,
    color: '#FFFFFF',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    maxWidth: SCREEN_W - 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EEEEEE',
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
  body: { flex: 1 },
  scrollInner: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  questionCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    display: 'none',
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
    fontWeight: '700',
    color: '#06402B',
    letterSpacing: 0,
    lineHeight: 33,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONT.body,
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    maxWidth: 340,
  },
  options: { gap: SPACING.md },
  optionShell: {
    borderRadius: RADIUS.xl, // smaller radius
    overflow: 'hidden',
    borderWidth: 1.5, // thinner border
    borderColor: 'rgba(255, 255, 255, 0.85)', // frost edge
    backgroundColor: 'rgba(255, 255, 255, 0.65)', // glass surface
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2, // much smaller vertical padding
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  optionShellSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // brighter white focus
    borderColor: '#3E6B50', // green focus border
    shadowColor: '#3E6B50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIcon: {
    width: 44, // smaller glass icon wrap
    height: 44,
    borderRadius: RADIUS.md, // smaller border radius
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  optionCopy: { flex: 1, gap: 1 },
  optionLabel: {
    ...FONT.bodySemiBold,
    fontSize: 15, // slightly smaller font
    color: '#0D3B26',
  },
  optionLabelSelected: {
    color: '#0D3B26', // Keep dark text so it doesn't get lost on pure white
    fontWeight: '800',
  },
  optionDesc: {
    ...FONT.bodySmall,
    color: 'rgba(13, 59, 38, 0.65)', // subtle sage green matching theme
    lineHeight: 18,
    fontSize: 12,
  },
  optionDescSelected: {
    color: 'rgba(13, 59, 38, 0.9)',
  },
  tick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickOn: {
    backgroundColor: '#3E6B50',
    borderColor: '#3E6B50',
  },
  hintWrap: {
    marginTop: SPACING.xxl,
    alignSelf: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: 'transparent',
    borderWidth: 0,
    maxWidth: SCREEN_W - SPACING.xl * 2,
  },
  hint: {
    ...FONT.caption,
    color: '#666666',
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
    backgroundColor: 'rgba(249, 247, 242, 0.85)', // translucent Warm Cream footer
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
  },
  continueBtnOuter: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  continueBtnOuterEnabled: {
    ...SHADOWS.sm,
  },
  continueGrad: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: '#06402B',
  },
  continueSolidDisabled: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: '#EEEEEE',
    borderWidth: 0,
    borderRadius: RADIUS.xl,
  },
  continueText: { ...FONT.h5, color: '#FFFFFF', fontWeight: '700' },
  continueTextDisabled: {
    ...FONT.h5,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
