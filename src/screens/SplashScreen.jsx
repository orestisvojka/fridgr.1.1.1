// src/screens/SplashScreen.jsx
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen({ onDone }) {
  const logoY = useRef(new Animated.Value(20)).current;
  const logoOp = useRef(new Animated.Value(0)).current;
  const tagOp = useRef(new Animated.Value(0)).current;
  const barW = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the glowing dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(logoY, { toValue: 0, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.timing(logoOp, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(tagOp, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(barW, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      Animated.delay(100),
      Animated.timing(screenFade, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => onDone?.());
  }, []);

  return (
    <Animated.View style={[s.root, { opacity: screenFade }]}>
      <StatusBar style="dark" />
      <View style={s.center}>
        <Animated.View style={[s.logoWrap, { opacity: logoOp, transform: [{ translateY: logoY }] }]}>
          <Animated.View style={[s.dotWrap, { transform: [{ scale: pulseScale }] }]}>
            <View style={s.dot} />
          </Animated.View>
          <Text style={s.wordmark}>FRIDGR</Text>
        </Animated.View>

        <Animated.Text style={[s.tagline, { opacity: tagOp }]}>
          THE CULINARY CURATOR
        </Animated.Text>
      </View>

      <Animated.View style={[s.bottom, { opacity: tagOp }]}>
        <View style={s.barTrack}>
          <Animated.View style={[s.barFill, { width: barW.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
        </View>
        <Text style={s.initLabel}>INITIALIZING PANTRY</Text>
      </Animated.View>
    </Animated.View>
  );
}

const GREEN = '#3E6B50';
const BG = '#F9F7F2';

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dotWrap: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: 'rgba(62, 107, 80, 0.15)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: GREEN 
  },
  wordmark: { 
    fontSize: 40, 
    fontWeight: '800', 
    letterSpacing: 4, 
    color: '#0D3B26' 
  },
  tagline: { 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 4, 
    color: '#8A8A84' 
  },
  bottom: { 
    position: 'absolute', 
    bottom: 60, 
    left: 70, 
    right: 70, 
    alignItems: 'center', 
    gap: 16 
  },
  barTrack: { 
    width: '100%', 
    height: 2, 
    backgroundColor: '#E4DDD2', 
    overflow: 'hidden', 
    borderRadius: 1 
  },
  barFill: { 
    height: '100%', 
    backgroundColor: GREEN 
  },
  initLabel: { 
    fontSize: 9, 
    fontWeight: '700', 
    letterSpacing: 2, 
    color: '#8A8A84' 
  }
});
