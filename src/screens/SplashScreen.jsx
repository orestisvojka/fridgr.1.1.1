// src/screens/SplashScreen.jsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  PREMIUM_GRADIENT,
  PREMIUM_GRADIENT_END,
  PREMIUM_GRADIENT_START,
  PREMIUM_VEIL,
} from '../constants/premiumScreenTheme';

const VEIL_STYLE = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: 280,
};

export default function SplashScreen({ onDone }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const taglineOp = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(14)).current;
  const dotScale = useRef(new Animated.Value(0)).current;
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Op = useRef(new Animated.Value(0.55)).current;
  const badgeOp = useRef(new Animated.Value(0)).current;
  const accentPulse = useRef(new Animated.Value(1)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  const logoColor = '#06402B';
  const taglineColor = 'rgba(6,64,43,0.8)';
  const badgeBg = 'rgba(255,255,255,0.12)';
  const badgeBorder = 'rgba(255,255,255,0.35)';
  const badgeText = '#FFFFFF';
  const ringColor = 'rgba(255,255,255,0.25)';

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(accentPulse, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(accentPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [accentPulse]);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 78, friction: 8 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.spring(dotScale, { toValue: 1, useNativeDriver: true, tension: 100, friction: 7, delay: 160 }),
      ]),
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(taglineOp, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(taglineY, { toValue: 0, duration: 380, useNativeDriver: true }),
        Animated.timing(badgeOp, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
      Animated.delay(640),
      Animated.parallel([
        Animated.timing(ring1Scale, { toValue: 2.8, duration: 580, useNativeDriver: true }),
        Animated.timing(ring1Op, { toValue: 0, duration: 580, useNativeDriver: true }),
      ]),
      Animated.timing(screenFade, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start(() => onDone?.());
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: screenFade }]}>
      <LinearGradient
        colors={PREMIUM_GRADIENT}
        start={PREMIUM_GRADIENT_START}
        end={PREMIUM_GRADIENT_END}
        style={styles.container}
      >
        <LinearGradient
          colors={PREMIUM_VEIL.colors}
          locations={PREMIUM_VEIL.locations}
          start={PREMIUM_VEIL.start}
          end={PREMIUM_VEIL.end}
          style={VEIL_STYLE}
          pointerEvents="none"
        />
        <StatusBar style="light" />

        <Animated.View style={[styles.ring, { opacity: ring1Op, borderColor: ringColor, transform: [{ scale: ring1Scale }] }]} />

        <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoRow}>
            <Animated.View style={[styles.dot, { transform: [{ scale: accentPulse }] }]} />
            <Text style={[styles.logo, { color: logoColor }]}>FRIDGR</Text>
          </View>
          <Animated.Text style={[styles.tagline, { color: taglineColor, opacity: taglineOp, transform: [{ translateY: taglineY }] }]}>
            Cook what you have
          </Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.badge, { opacity: badgeOp, backgroundColor: badgeBg, borderColor: badgeBorder }]}>
          <Text style={[styles.badgeText, { color: badgeText }]}>AI-powered recipes</Text>
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
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FACC15',
    marginTop: 8,
  },
  logo: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  badge: {
    position: 'absolute',
    bottom: 52,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
