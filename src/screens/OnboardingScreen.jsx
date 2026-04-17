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
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '../context/OnboardingContext';
import { colors, fontSize, fontFamily, fontWeight, radius, spacing, shadows, icons } from '../styles/theme';

const { width: SCREEN_W } = Dimensions.get('window');

const STEPS = [
  {
    id: 'goal',
    icon: 'target',
    title: 'Primary Goal',
    subtitle: 'What brings you to FRIDGR today?',
    options: [
      { value: 'health', label: 'Eat Healthier', icon: 'heart', desc: 'Focus on balanced, nutritious meals' },
      { value: 'weight', label: 'Weight Loss', icon: 'trending-down', desc: 'Low-calorie, filling recipes' },
      { value: 'save_time', label: 'Save Time', icon: 'clock', desc: 'Quick 15-minute meals' },
      { value: 'save_money', label: 'Save Money', icon: 'dollar-sign', desc: 'Budget-friendly ingredients' },
    ],
  },
  {
    id: 'cuisine',
    icon: 'map',
    title: 'Favorite Cuisine',
    subtitle: 'Which flavors do you love most?',
    options: [
      { value: 'italian', label: 'Italian', icon: 'compass', desc: 'Pasta, pizza, and herbs' },
      { value: 'mexican', label: 'Mexican', icon: 'sun', desc: 'Spices, tacos, and fresh lime' },
      { value: 'asian', label: 'Asian', icon: 'anchor', desc: 'Stir-fries, rice, and soy' },
      { value: 'mediterranean', label: 'Mediterranean', icon: 'wind', desc: 'Olive oil, fish, and greens' },
    ],
  },
  {
    id: 'skill',
    icon: 'award',
    title: 'Cooking Confidence',
    subtitle: "How comfortable are you in the kitchen?",
    options: [
      { value: 'beginner', label: 'Beginner', icon: 'smile', desc: 'I am just starting out' },
      { value: 'home_cook', label: 'Home Cook', icon: 'home', desc: 'I cook semi-regularly' },
      { value: 'pro', label: 'Home Chef', icon: 'zap', desc: 'I love complex techniques' },
    ],
  },
  {
    id: 'allergies',
    icon: 'shield',
    title: 'Restrictions',
    subtitle: "Any allergies or dietary needs?",
    isMulti: true,
    options: [
      { value: 'none', label: 'No Restrictions', icon: 'check-circle', desc: 'I can eat anything' },
      { value: 'nuts', label: 'Nut-Free', icon: 'alert-circle', desc: 'No peanuts or tree nuts' },
      { value: 'dairy', label: 'Dairy-Free', icon: 'droplet', desc: 'No milk or cheese' },
      { value: 'gluten', label: 'Gluten-Free', icon: 'slash', desc: 'No wheat or barley' },
    ],
  },
  {
    id: 'household',
    icon: 'users',
    title: 'Household Size',
    subtitle: 'Who are you cooking for?',
    options: [
      { value: '1', label: 'Just Me', icon: 'user', desc: 'Single-serving portions' },
      { value: '2', label: 'Two People', icon: 'users', desc: 'Perfect for couples' },
      { value: 'family', label: 'Family', icon: 'command', desc: 'Feeding a whole crew' },
    ],
  },
];

export default function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const { answers, setAnswer, toggleMultiAnswer, completeOnboarding } = useOnboarding();

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
    if (current.isMulti) {
      toggleMultiAnswer(current.id, value);
    } else {
      setAnswer(current.id, value);
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      animateToNext(step + 1);
    } else {
      completeOnboarding();
      onDone?.();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    onDone?.();
  };

  const isLast = step === STEPS.length - 1;

  const isSelected = (value) => {
    const answer = answers[current.id];
    if (current.isMulti) return answer?.includes(value);
    return answer === value;
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.root]}>
      <LinearGradient
        colors={[colors.bgPrimary, colors.bgMuted]}
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
            <Feather name={current.icon} size={icons.size.xl} color={colors.green} />
          </View>

          {/* Step indicator */}
          <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}</Text>

          {/* Question */}
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>

          {/* Options */}
          <View style={styles.options}>
            {current.options.map((opt) => {
              const selected = isSelected(opt.value);
              return (
                <TouchableOpacity
                  key={String(opt.value)}
                  onPress={() => handleSelect(opt.value)}
                  activeOpacity={0.8}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
                    <Feather
                      name={opt.icon}
                      size={icons.size.md}
                      color={selected ? '#fff' : colors.textMuted}
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
                      <Feather name="check-circle" size={icons.size.md} color={colors.green} />
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
            colors={[colors.green, colors.greenDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>{isLast ? "Let's Cook!" : 'Continue'}</Text>
            <Feather name={isLast ? 'check' : 'arrow-right'} size={icons.size.md} color="#fff" />
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
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.green,
  },
  dotDone: {
    backgroundColor: colors.greenMid,
  },
  skipText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
  },
  content: {
    flex: 1,
    gap: spacing.md,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: fontSize.xs,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: colors.green,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
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
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  optionSelected: {
    borderColor: colors.green,
    backgroundColor: colors.greenLight + '40',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
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
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.greenDark,
  },
  optionDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  checkWrap: {
    marginLeft: 'auto',
  },
  cta: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg + 2,
  },
  ctaText: {
     fontSize: fontSize.lg,
     fontFamily: 'Poppins_400Regular', fontWeight: '400',
     color: '#fff',
     letterSpacing: -0.2,
   },
 });
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
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#fff',
    letterSpacing: -0.2,
  },
});
