// src/screens/SplashScreen.jsx
// Matches mockup: warm cream bg, fridge icon, "Fridgr" wordmark, "THE CULINARY CURATOR"
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Leaf } from 'lucide-react-native';

// ─── Fridge Icon ──────────────────────────────────────────────────────────────
function FridgeIcon() {
  return (
    <View style={s.iconWrap}>
      {/* Body */}
      <View style={s.fridgeBody}>
        {/* Freezer top section */}
        <View style={s.fridgeTop} />
        {/* Divider */}
        <View style={s.fridgeDivider} />
        {/* Main compartment */}
        <View style={s.fridgeBottom} />
        {/* Handle top */}
        <View style={[s.handle, s.handleTop]} />
        {/* Handle bottom */}
        <View style={[s.handle, s.handleBottom]} />
      </View>
      {/* Leaf badge — top right */}
      <View style={s.leafBadge}>
        <Leaf size={9} color="#FFFFFF" strokeWidth={2.5} />
      </View>
    </View>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress }) {
  return (
    <View style={s.progressTrack}>
      <Animated.View style={[s.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SplashScreen({ onDone }) {
  const iconAnim   = useRef(new Animated.Value(0)).current;
  const iconScale  = useRef(new Animated.Value(0.82)).current;
  const textAnim   = useRef(new Animated.Value(0)).current;
  const textY      = useRef(new Animated.Value(12)).current;
  const subAnim    = useRef(new Animated.Value(0)).current;
  const barAnim    = useRef(new Animated.Value(0)).current;
  const labelAnim  = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      // Icon appears
      Animated.parallel([
        Animated.spring(iconScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.timing(iconAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]),
      Animated.delay(80),
      // "Fridgr" wordmark
      Animated.parallel([
        Animated.timing(textAnim, { toValue: 1, duration: 340, useNativeDriver: true }),
        Animated.timing(textY,    { toValue: 0, duration: 340, useNativeDriver: true }),
      ]),
      Animated.delay(60),
      // Subtitle + bar
      Animated.parallel([
        Animated.timing(subAnim,   { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(barAnim,   { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(labelAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(300),
      // Fade out
      Animated.timing(screenFade, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start(() => onDone?.());
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, s.container, { opacity: screenFade }]}>
      <StatusBar style="dark" />

      {/* Center content */}
      <View style={s.center}>
        {/* Icon */}
        <Animated.View style={{ opacity: iconAnim, transform: [{ scale: iconScale }], marginBottom: 24 }}>
          <FridgeIcon />
        </Animated.View>

        {/* Wordmark */}
        <Animated.Text style={[s.wordmark, { opacity: textAnim, transform: [{ translateY: textY }] }]}>
          Fridgr
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[s.tagline, { opacity: subAnim }]}>
          THE CULINARY CURATOR
        </Animated.Text>
      </View>

      {/* Bottom: progress bar + label */}
      <Animated.View style={[s.bottom, { opacity: labelAnim }]}>
        <ProgressBar progress={barAnim} />
        <Text style={s.initLabel}>INITIALIZING PANTRY</Text>
      </Animated.View>
    </Animated.View>
  );
}

const ICON_BG    = '#D4E8DA';
const ICON_GREEN = '#3E6B50';
const BG         = '#F9F7F2';

const s = StyleSheet.create({
  container: {
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },

  // ─── Fridge Icon ───────────────────────────────────────────────────────────
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fridgeBody: {
    width: 34,
    height: 50,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: ICON_GREEN,
    overflow: 'hidden',
    position: 'relative',
  },
  fridgeTop: {
    height: 17,
    backgroundColor: 'transparent',
  },
  fridgeDivider: {
    height: 2,
    backgroundColor: ICON_GREEN,
  },
  fridgeBottom: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  handle: {
    position: 'absolute',
    right: -7,
    width: 5,
    borderRadius: 2,
    backgroundColor: ICON_GREEN,
  },
  handleTop: {
    top: 5,
    height: 11,
  },
  handleBottom: {
    bottom: 8,
    height: 8,
  },
  leafBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ICON_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Wordmark ──────────────────────────────────────────────────────────────
  wordmark: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1E1E1C',
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  // ─── Tagline ───────────────────────────────────────────────────────────────
  tagline: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.8,
    color: '#8A8A84',
    textTransform: 'uppercase',
  },

  // ─── Bottom Progress ───────────────────────────────────────────────────────
  bottom: {
    position: 'absolute',
    bottom: 56,
    left: 48,
    right: 48,
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#E4DDD2',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1,
    backgroundColor: ICON_GREEN,
  },
  initLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: '#8A8A84',
    textTransform: 'uppercase',
  },
});
