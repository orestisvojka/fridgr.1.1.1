// src/components/PremiumScreenShell.jsx
// Full-screen questionnaire-style backdrop: base gradient + optional top veil.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  PREMIUM_GRADIENT,
  PREMIUM_GRADIENT_END,
  PREMIUM_GRADIENT_START,
  PREMIUM_VEIL,
  PREMIUM,
} from '../constants/premiumScreenTheme';

const VEIL_STYLE = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: 280,
};

export default function PremiumScreenShell({ children, showVeil = true, style }) {
  return (
    <View style={[{ flex: 1, backgroundColor: PREMIUM.rootBg }, style]}>
      <LinearGradient
        colors={PREMIUM_GRADIENT}
        start={PREMIUM_GRADIENT_START}
        end={PREMIUM_GRADIENT_END}
        style={StyleSheet.absoluteFill}
      />
      {showVeil ? (
        <LinearGradient
          colors={PREMIUM_VEIL.colors}
          locations={PREMIUM_VEIL.locations}
          start={PREMIUM_VEIL.start}
          end={PREMIUM_VEIL.end}
          style={VEIL_STYLE}
          pointerEvents="none"
        />
      ) : null}
      {children}
    </View>
  );
}
