// src/screens/onboarding/QuestionnaireScreen.jsx
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, Animated, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { QUESTIONNAIRE_STEPS } from '../../data/mockData';

const { width } = Dimensions.get('window');

function OptionCard({ option, isSelected, onPress, isMulti }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <Animated.View
        style={[
          styles.optionCard,
          isSelected && styles.optionCardSelected,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[styles.optionEmoji, isSelected && styles.optionEmojiSelected]}>
          <Text style={styles.optionEmojiText}>{option.emoji}</Text>
        </View>
        <View style={styles.optionText}>
          <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
            {option.label}
          </Text>
          <Text style={styles.optionDesc}>{option.desc}</Text>
        </View>
        <View style={[
          styles.optionCheck,
          isSelected && styles.optionCheckSelected,
          isMulti && styles.optionCheckMulti,
          isMulti && isSelected && styles.optionCheckMultiSelected,
        ]}>
          {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function QuestionnaireScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { answers, setAnswer, toggleMultiAnswer, completeOnboarding } = useOnboarding();

  const [currentStep, setCurrentStep] = useState(0);
  const [finishing,   setFinishing]   = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const step = QUESTIONNAIRE_STEPS[currentStep];
  const totalSteps = QUESTIONNAIRE_STEPS.length;

  const isAnswered = () => {
    const answer = answers[step.id];
    if (step.type === 'multi') return Array.isArray(answer) && answer.length > 0;
    return !!answer;
  };

  const animateTransition = (callback) => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0,   duration: 0,   useNativeDriver: true }),
    ]).start(callback);
  };

  const handleNext = () => {
    if (!isAnswered()) return;
    if (currentStep < totalSteps - 1) {
      animateTransition(() => setCurrentStep(prev => prev + 1));
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition(() => setCurrentStep(prev => prev - 1));
    }
  };

  const handleFinish = () => {
    setFinishing(true);
    setTimeout(() => {
      completeOnboarding();
    }, 800);
  };

  const handleSelect = (optionId) => {
    if (step.type === 'multi') {
      toggleMultiAnswer(step.id, optionId);
    } else {
      setAnswer(step.id, optionId);
    }
  };

  const isOptionSelected = (optionId) => {
    const answer = answers[step.id];
    if (step.type === 'multi') return Array.isArray(answer) && answer.includes(optionId);
    return answer === optionId;
  };

  const progress = (currentStep + 1) / totalSteps;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          disabled={currentStep === 0}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={currentStep === 0 ? COLORS.textTertiary : COLORS.text}
          />
        </TouchableOpacity>

        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{currentStep + 1}/{totalSteps}</Text>
        </View>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          {/* Question */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>
              Question {currentStep + 1}
            </Text>
            <Text style={styles.question}>{step.question}</Text>
            <Text style={styles.questionSub}>{step.subtitle}</Text>
          </View>

          {/* Options */}
          <View style={styles.options}>
            {step.options.map(option => (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={isOptionSelected(option.id)}
                onPress={() => handleSelect(option.id)}
                isMulti={step.type === 'multi'}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomWrap, { paddingBottom: insets.bottom + SPACING.lg }]}>
        <TouchableOpacity
          style={[styles.nextBtn, !isAnswered() && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!isAnswered() || finishing}
          activeOpacity={0.85}
        >
          {finishing ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <LinearGradient
              colors={isAnswered() ? ['#16A34A', '#15803D'] : [COLORS.border, COLORS.border]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Text style={[styles.nextBtnText, !isAnswered() && styles.nextBtnTextDisabled]}>
                {currentStep < totalSteps - 1 ? 'Continue' : 'Get Cooking 🎉'}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        {step.type === 'multi' && (
          <Text style={styles.multiHint}>Select all that apply</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  progressWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  progressBg: {
    flex: 1, height: 6, backgroundColor: COLORS.surface2, borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressLabel: { ...FONT.captionMedium, color: COLORS.textSecondary, minWidth: 28, textAlign: 'right' },

  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: 20 },
  questionBlock: { marginTop: SPACING.xl, marginBottom: SPACING.xxl },
  questionLabel: {
    ...FONT.labelSmall,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  question: { ...FONT.h2, color: COLORS.text, marginBottom: SPACING.sm },
  questionSub: { ...FONT.body, color: COLORS.textSecondary },

  options: { gap: SPACING.sm },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.md,
    ...SHADOWS.xs,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryFaint,
  },
  optionEmoji: {
    width: 46, height: 46, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  optionEmojiSelected: { backgroundColor: COLORS.primaryPale },
  optionEmojiText: { fontSize: 22 },
  optionText: { flex: 1, gap: 2 },
  optionLabel: { ...FONT.bodySemiBold, color: COLORS.text },
  optionLabelSelected: { color: COLORS.primary },
  optionDesc: { ...FONT.bodySmall, color: COLORS.textSecondary },
  optionCheck: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  optionCheckSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionCheckMulti: { borderRadius: RADIUS.xs },
  optionCheckMultiSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },

  bottomWrap: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  nextBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.green },
  nextBtnDisabled: { ...SHADOWS.none },
  nextBtnGradient: { height: 54, alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { ...FONT.h5, color: COLORS.white },
  nextBtnTextDisabled: { color: COLORS.textTertiary },
  multiHint: { ...FONT.caption, color: COLORS.textTertiary, textAlign: 'center' },
});
