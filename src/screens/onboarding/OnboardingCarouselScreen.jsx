// src/screens/onboarding/OnboardingCarouselScreen.jsx
import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING, RADIUS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ONBOARDING_SLIDES } from '../../data/mockData';
import { PREMIUM_CAROUSEL_GRADIENTS, PREMIUM_VEIL, PREMIUM, PREMIUM_CTA_VERTICAL, PREMIUM_CTA_VERTICAL_END, PREMIUM_CTA_VERTICAL_START } from '../../constants/premiumScreenTheme';

const { width, height } = Dimensions.get('window');

const GRADIENTS = PREMIUM_CAROUSEL_GRADIENTS;

function Slide({ item, index }) {
  return (
    <View style={[styles.slide, { width }]}>
      {/* Big emoji */}
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View style={styles.emojiGlow} />
      </View>

      {/* Text block */}
      <View style={styles.textBlock}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
}

export default function OnboardingCarouselScreen({ navigation }) {
  const insets  = useSafeAreaInsets();
  const flatRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      navigation.navigate(ROUTES.QUESTIONNAIRE);
    }
  };

  const handleSkip = () => navigation.navigate(ROUTES.QUESTIONNAIRE);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: e => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(idx);
      },
    }
  );

  const isLast = activeIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={GRADIENTS[activeIndex] || GRADIENTS[0]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={PREMIUM_VEIL.colors}
        locations={PREMIUM_VEIL.locations}
        start={PREMIUM_VEIL.start}
        end={PREMIUM_VEIL.end}
        style={styles.topVeil}
        pointerEvents="none"
      />

      {/* Decorative orb */}
      <View style={styles.orb} />
      <View style={styles.orb2} />

      {/* Skip */}
      <TouchableOpacity
        style={[styles.skipBtn, { top: insets.top + SPACING.md }]}
        onPress={handleSkip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Carousel */}
      <Animated.FlatList
        ref={flatRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <Slide item={item} index={index} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.flatList}
        contentContainerStyle={{ alignItems: 'center' }}
      />

      {/* Bottom controls */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + SPACING.xxl }]}>
        {/* Dots */}
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.92}>
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={styles.nextBtnInner}
          >
            <Text style={styles.nextBtnText}>
              {isLast ? 'Get Started' : 'Continue'}
            </Text>
            {!isLast && <Text style={styles.nextArrow}>→</Text>}
          </LinearGradient>
        </TouchableOpacity>

        {/* Step indicator */}
        <Text style={styles.stepText}>
          {activeIndex + 1} of {ONBOARDING_SLIDES.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PREMIUM.rootBg },
  topVeil: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 280,
  },
  orb: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  orb2: {
    position: 'absolute',
    bottom: 60,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  skipBtn: {
    position: 'absolute',
    right: SPACING.xl,
    zIndex: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  skipText: { ...FONT.bodySmallMedium, color: 'rgba(255,255,255,0.75)' },
  flatList: { flex: 1, marginTop: 60 },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.section,
  },
  emojiWrap: { alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 90, textAlign: 'center' },
  emojiGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  textBlock: { alignItems: 'center', gap: SPACING.md },
  slideTitle: {
    ...FONT.h1,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  slideSubtitle: {
    ...FONT.body,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 280,
  },

  // Bottom
  bottom: { alignItems: 'center', gap: SPACING.xl, paddingHorizontal: SPACING.xl },
  dots: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  nextBtn: {
    width: '100%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  nextBtnInner: {
    paddingVertical: SPACING.lg + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  nextBtnText: { ...FONT.bodySemiBold, color: '#FFFFFF', fontSize: 16 },
  nextArrow: { ...FONT.h4, color: 'rgba(255,255,255,0.8)' },
  stepText: { ...FONT.caption, color: 'rgba(255,255,255,0.4)' },
});
