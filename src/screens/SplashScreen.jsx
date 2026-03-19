// src/screens/SplashScreen.jsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onDone }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.85)).current;
  const taglineOp   = useRef(new Animated.Value(0)).current;
  const taglineY    = useRef(new Animated.Value(12)).current;
  const dotScale    = useRef(new Animated.Value(0)).current;
  const ring1Scale  = useRef(new Animated.Value(1)).current;
  const ring1Op     = useRef(new Animated.Value(0.6)).current;
  const badgeOp     = useRef(new Animated.Value(0)).current;
  const screenFade  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1,   useNativeDriver: true, tension: 80, friction: 8 }),
        Animated.timing(logoOpacity, { toValue: 1,   duration: 500, useNativeDriver: true }),
        Animated.spring(dotScale,    { toValue: 1,   useNativeDriver: true, tension: 100, friction: 7, delay: 200 }),
      ]),
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(taglineOp,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(taglineY,   { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(badgeOp,    { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(ring1Scale, { toValue: 2.8,  duration: 600, useNativeDriver: true }),
        Animated.timing(ring1Op,    { toValue: 0,    duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(screenFade,   { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start(() => onDone?.());
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: screenFade }]}>
      <LinearGradient colors={['#071A0B', '#0F3D22', '#15803D']} style={styles.container}>
        <StatusBar style="light" />

        {/* Pulse ring */}
        <Animated.View style={[styles.ring, { opacity: ring1Op, transform: [{ scale: ring1Scale }] }]} />

        {/* Logo block */}
        <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoRow}>
            <Animated.View style={[styles.dot, { transform: [{ scale: dotScale }] }]} />
            <Text style={styles.logo}>FRIDGR</Text>
          </View>
          <Animated.Text style={[styles.tagline, { opacity: taglineOp, transform: [{ translateY: taglineY }] }]}>
            Cook what you have.
          </Animated.Text>
        </Animated.View>

        {/* Bottom badge */}
        <Animated.View style={[styles.badge, { opacity: badgeOp }]}>
          <Text style={styles.badgeText}>✦  AI-Powered Recipes</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoWrap: {
    alignItems: 'center',
    gap: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#86EFAC',
    marginTop: 7,
  },
  logo: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  badge: {
    position: 'absolute',
    bottom: 52,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
  },
});
