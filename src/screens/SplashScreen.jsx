// src/screens/SplashScreen.jsx
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const GREEN      = '#3E6B50';
const GREEN_DARK = '#0D3B26';
const BG         = '#F9F7F2';
const DOT_COUNT  = 3;

export default function SplashScreen({ onDone }) {
  // Core entrance
  const logoY     = useRef(new Animated.Value(28)).current;
  const logoOp    = useRef(new Animated.Value(0)).current;
  const taglineOp = useRef(new Animated.Value(0)).current;
  const taglineY  = useRef(new Animated.Value(10)).current;
  const subtitleOp = useRef(new Animated.Value(0)).current;
  const bottomOp  = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  // Glowing ring pulse
  const ringScale  = useRef(new Animated.Value(1)).current;
  const ringOp     = useRef(new Animated.Value(0.6)).current;

  // Animated dots (3 dots pulsing in sequence)
  const dotAnims  = useRef(Array.from({ length: DOT_COUNT }, () => new Animated.Value(0.2))).current;

  useEffect(() => {
    // Ring pulse loop
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(ringScale, { toValue: 1.25, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(ringScale, { toValue: 1,    duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(ringOp, { toValue: 0.15, duration: 1000, useNativeDriver: true }),
          Animated.timing(ringOp, { toValue: 0.55, duration: 1000, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Dots wave loop
    const makeWave = () =>
      Animated.loop(
        Animated.stagger(180,
          dotAnims.map(d =>
            Animated.sequence([
              Animated.timing(d, { toValue: 1,   duration: 380, easing: Easing.out(Easing.ease), useNativeDriver: true }),
              Animated.timing(d, { toValue: 0.2, duration: 380, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
            ])
          )
        )
      );
    makeWave().start();

    // Entrance sequence
    Animated.sequence([
      Animated.delay(150),
      // Logo in
      Animated.parallel([
        Animated.spring(logoY,  { toValue: 0, tension: 55, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOp, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
      // Tagline in
      Animated.parallel([
        Animated.timing(taglineOp, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.spring(taglineY,  { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      // Subtitle + bottom dots in
      Animated.parallel([
        Animated.timing(subtitleOp, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(bottomOp,   { toValue: 1, duration: 320, useNativeDriver: true }),
      ]),
      // Hold
      Animated.delay(1400),
      // Fade out
      Animated.timing(screenFade, { toValue: 0, duration: 420, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start(() => onDone?.());
  }, []);

  return (
    <Animated.View style={[s.root, { opacity: screenFade }]}>
      <StatusBar style="dark" />

      {/* Subtle background circle */}
      <Animated.View style={[s.bgOrb, { transform: [{ scale: ringScale }], opacity: ringOp }]} />

      <View style={s.center}>
        {/* Logo mark */}
        <Animated.View style={[s.logoWrap, { opacity: logoOp, transform: [{ translateY: logoY }] }]}>
          <View style={s.iconRing}>
            <View style={s.iconDot} />
          </View>
          <Text style={s.wordmark}>FRIDGR</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[s.tagline, { opacity: taglineOp, transform: [{ translateY: taglineY }] }]}>
          THE CULINARY CURATOR
        </Animated.Text>

        {/* Divider */}
        <Animated.View style={[s.divider, { opacity: subtitleOp }]} />

        {/* Subtitle */}
        <Animated.Text style={[s.subtitle, { opacity: subtitleOp }]}>
          Cook smarter. Waste less. Eat better.
        </Animated.Text>
      </View>

      {/* Bottom loading dots */}
      <Animated.View style={[s.bottom, { opacity: bottomOp }]}>
        <View style={s.dotsRow}>
          {dotAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                s.loadDot,
                { opacity: anim, transform: [{ scaleY: anim }] },
              ]}
            />
          ))}
        </View>
        <Text style={s.initLabel}>LOADING</Text>
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgOrb: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(62,107,80,0.07)',
  },
  center: {
    alignItems: 'center',
    gap: 12,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 4,
  },
  iconRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(62,107,80,0.1)',
  },
  iconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
  },
  wordmark: {
    fontSize: 44,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    letterSpacing: 5,
    color: GREEN_DARK,
  },
  tagline: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    letterSpacing: 5,
    color: 'rgba(13,59,38,0.45)',
    textTransform: 'uppercase',
  },
  divider: {
    width: 32,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: 'rgba(62,107,80,0.25)',
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 13, lineHeight: 20,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: 'rgba(13,59,38,0.38)',
    letterSpacing: 0.2,
  },
  bottom: {
    position: 'absolute',
    bottom: 56,
    alignItems: 'center',
    gap: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  loadDot: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: GREEN,
  },
  initLabel: {
    fontSize: 9,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    letterSpacing: 3,
    color: 'rgba(13,59,38,0.35)',
  },
});
