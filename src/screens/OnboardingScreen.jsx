// src/screens/OnboardingScreen.jsx
// 3-step preference questionnaire shown once on first launch

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../context/RecipesContext';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '../styles/theme';

const { width: SCREEN_W } = Dimensions.get('window');

const STEPS = [
  {
    id: 'skill',
    icon: 'school-outline',
    title: 'Cooking Skill',
    subtitle: "We'll suggest recipes that match your level.",
    options: [
      { value: 'beginner', label: 'Beginner', icon: 'happy-outline', desc: 'Simple, quick recipes' },
      { value: 'home_cook', label: 'Home Cook', icon: 'home-outline', desc: 'Balanced everyday meals' },
      { value: 'pro', label: 'Chef Mode', icon: 'flame-outline', desc: 'Complex & adventurous' },
    ],
  },
  {
    id: 'diet',
    icon: 'leaf-outline',
    title: 'Dietary Preference',
    subtitle: "We'll filter recipes to fit your lifestyle.",
    options: [
      { value: 'none', label: 'No Restrictions', icon: 'restaurant-outline', desc: 'Eat everything' },
      { value: 'vegetarian', label: 'Vegetarian', icon: 'leaf-outline', desc: 'No meat or fish' },
      { value: 'vegan', label: 'Vegan', icon: 'flower-outline', desc: 'Plant-based only' },
      { value: 'gluten_free', label: 'Gluten-Free', icon: 'shield-checkmark-outline', desc: 'No gluten products' },
    ],
  },
  {
    id: 'time',
    icon: 'time-outline',
    title: 'Available Time',
    subtitle: 'How long can you spend cooking?',
    options: [
      { value: 15, label: 'Quick', icon: 'flash-outline', desc: 'Under 15 minutes' },
      { value: 30, label: 'Standard', icon: 'timer-outline', desc: '15 – 30 minutes' },
      { value: 99, label: 'No Rush', icon: 'hourglass-outline', desc: '30 minutes or more' },
    ],
  },
];

export default function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ skill: 'home_cook', diet: 'none', time: 30 });
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const { setPreferences } = useRecipes();

  const current = STEPS[step];

  const animateToNext = (nextStep) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      animateToNext(step + 1);
    } else {
      setPreferences(answers);
      onDone?.();
    }
  };

  const handleSkip = () => {
    setPreferences(answers);
    onDone?.();
  };

  const isLast = step === STEPS.length - 1;

  return (
    <View style={[StyleSheet.absoluteFill, styles.root]}>
      <LinearGradient
        colors={['#031A0C', '#0A2E1A', '#0F3D22']}
        style={[styles.gradient, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xl }]}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.stepDots}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Icon */}
          <View style={styles.iconWrap}>
            <Ionicons name={current.icon} size={32} color={colors.green} />
          </View>

          {/* Step indicator */}
          <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}</Text>

          {/* Question */}
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>

          {/* Options */}
          <View style={styles.options}>
            {current.options.map((opt) => {
              const selected = answers[current.id] === opt.value;
              return (
                <TouchableOpacity
                  key={String(opt.value)}
                  onPress={() => handleSelect(opt.value)}
                  activeOpacity={0.8}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
                    <Ionicons
                      name={opt.icon}
                      size={22}
                      color={selected ? '#fff' : 'rgba(255,255,255,0.5)'}
                    />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                  {selected && (
                    <View style={styles.checkWrap}>
                      <Ionicons name="checkmark-circle" size={22} color={colors.green} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* CTA */}
        <TouchableOpacity onPress={handleNext} activeOpacity={0.88} style={styles.cta}>
          <LinearGradient
            colors={['#16A34A', '#22C55E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>{isLast ? "Let's Cook!" : 'Continue'}</Text>
            <Ionicons name={isLast ? 'restaurant' : 'arrow-forward'} size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 998,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepDots: {
    flexDirection: 'row',
    gap: spacing.sm - 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.green,
  },
  dotDone: {
    backgroundColor: colors.green + '80',
  },
  skipText: {
    fontSize: fontSize.sm + 1,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: fontWeight.medium,
  },
  content: {
    flex: 1,
    gap: spacing.md,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.green + '22',
    borderWidth: 1.5,
    borderColor: colors.green + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.green,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extrabold,
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionSelected: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderColor: colors.green + '60',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconSelected: {
    backgroundColor: colors.green,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: fontSize.md + 1,
    fontWeight: fontWeight.bold,
    color: 'rgba(255,255,255,0.7)',
  },
  optionLabelSelected: {
    color: '#FFFFFF',
  },
  optionDesc: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.35)',
  },
  checkWrap: {
    marginLeft: 'auto',
  },
  cta: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.green,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg + 2,
    borderRadius: radius.xl,
  },
  ctaText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: '#fff',
    letterSpacing: -0.2,
  },
});
