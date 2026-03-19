// src/screens/SplashScreen.jsx
// Animated letter-by-letter splash screen

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LETTERS = ['F', 'R', 'I', 'D', 'G', 'R', '.'];

export default function SplashScreen({ onDone }) {
  const letterAnims = useRef(LETTERS.map(() => new Animated.Value(0))).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const letterSequence = LETTERS.map((_, i) =>
      Animated.timing(letterAnims[i], {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      })
    );

    Animated.sequence([
      Animated.stagger(100, letterSequence),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => onDone?.());
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, { opacity: screenFade }]}>
      <LinearGradient
        colors={['#031A0C', '#0A2E1A', '#0F3D22']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        {/* Logo letters */}
        <View style={styles.lettersRow}>
          {LETTERS.map((letter, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.letter,
                letter === '.' && styles.dot,
                {
                  opacity: letterAnims[i],
                  transform: [
                    {
                      translateY: letterAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [28, 0],
                      }),
                    },
                    {
                      scale: letterAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineAnim,
              transform: [
                {
                  translateY: taglineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Cook what you have.
        </Animated.Text>

        {/* Decorative bar */}
        <Animated.View style={[styles.bar, { opacity: taglineAnim }]} />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  lettersRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  letter: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  dot: {
    color: '#22C55E',
    fontSize: 52,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  bar: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#22C55E',
    marginTop: 8,
  },
});
