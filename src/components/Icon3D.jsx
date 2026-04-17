// src/components/Icon3D.jsx
// Premium 3D-style icon system inspired by 3dicons.co
//
// HOW TO USE REAL 3D PNG ICONS:
//   1. Download packs from https://3dicons.co/
//   2. Place PNGs in src/assets/icons3d/ with the names below
//   3. Uncomment the Image branch inside Icon3D and add require() paths
//      to ICON_PNG_MAP below.
//
// Until PNGs are added, each icon renders as a premium gradient-circle
// with a lucide icon — same layout, same container sizing.

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Camera, Heart, Bookmark, Star, BarChart2, Clock, Bell,
  Settings, Search, ChefHat, History, Zap, ShoppingBag,
  User, Lock, Mail, Shield, Lightbulb, Target, Mic,
  Play, Smile, Hash, Package, Sun, Calculator, FileText,
  Folder, CheckCircle, Wallet, Copy,
} from 'lucide-react-native';

// ─── Gradient palette (mirrors 3dicons.co hues) ──────────────────────────────
const CONFIGS = {
  // Navigation / tabs
  scan:         { g: ['#FFB347', '#FF6B35'], Icon: Camera,      stroke: 2.0 },
  recipes:      { g: ['#FF7B7B', '#E63946'], Icon: ChefHat,     stroke: 1.8 },
  favorites:    { g: ['#FF4D6D', '#C9184A'], Icon: Heart,       stroke: 1.8 },
  profile:      { g: ['#7B9FFF', '#4361EE'], Icon: User,        stroke: 1.8 },

  // Actions
  save:         { g: ['#7B2FBE', '#5A189A'], Icon: Bookmark,    stroke: 1.8 },
  history:      { g: ['#FF9F1C', '#FFBF69'], Icon: History,     stroke: 1.8 },
  statistics:   { g: ['#9B5DE5', '#6930C3'], Icon: BarChart2,   stroke: 1.8 },
  settings:     { g: ['#F4A261', '#E76F51'], Icon: Settings,    stroke: 1.8 },
  bell:         { g: ['#E07A5F', '#C1440E'], Icon: Bell,        stroke: 1.8 },
  search:       { g: ['#2D6A4F', '#40916C'], Icon: Search,      stroke: 1.8 },

  // Feature icons
  star:         { g: ['#FFD166', '#EF9B20'], Icon: Star,        stroke: 1.6 },
  clock:        { g: ['#E07A5F', '#C45D3A'], Icon: Clock,       stroke: 1.8 },
  flash:        { g: ['#FFB700', '#FF8800'], Icon: Zap,         stroke: 2.0 },
  bag:          { g: ['#E63946', '#C1121F'], Icon: ShoppingBag, stroke: 1.8 },
  lock:         { g: ['#C9A44C', '#A67C00'], Icon: Lock,        stroke: 1.8 },
  mail:         { g: ['#C1440E', '#8B3A0A'], Icon: Mail,        stroke: 1.8 },
  shield:       { g: ['#4361EE', '#3A0CA3'], Icon: Shield,      stroke: 1.8 },
  bulb:         { g: ['#E040FB', '#AA00FF'], Icon: Lightbulb,   stroke: 1.8 },
  target:       { g: ['#E63946', '#9D0208'], Icon: Target,      stroke: 1.8 },
  mic:          { g: ['#C77DFF', '#9600FF'], Icon: Mic,         stroke: 1.8 },
  play:         { g: ['#C1440E', '#922B21'], Icon: Play,        stroke: 1.6 },
  smile:        { g: ['#FFB347', '#FF7B00'], Icon: Smile,       stroke: 1.8 },
  hash:         { g: ['#4CC9F0', '#0077B6'], Icon: Hash,        stroke: 2.0 },
  package:      { g: ['#4CC9F0', '#4361EE'], Icon: Package,     stroke: 1.8 },
  sun:          { g: ['#FFD60A', '#FF9500'], Icon: Sun,         stroke: 1.8 },
  calculator:   { g: ['#343A40', '#212529'], Icon: Calculator,  stroke: 1.8 },
  file:         { g: ['#E63946', '#A4133C'], Icon: FileText,    stroke: 1.8 },
  folder:       { g: ['#FFB347', '#F77F00'], Icon: Folder,      stroke: 1.8 },
  tick:         { g: ['#2DC653', '#12823B'], Icon: CheckCircle, stroke: 1.8 },
  wallet:       { g: ['#9B7D5C', '#6B4F3A'], Icon: Wallet,     stroke: 1.8 },
  copy:         { g: ['#FF6B6B', '#C1440E'], Icon: Copy,        stroke: 1.8 },
};

// ─── Optional: PNG overrides from 3dicons.co ─────────────────────────────────
// Add require() here once you've placed PNGs in src/assets/icons3d/
// Example:  bell: require('../assets/icons3d/bell.png'),
const ICON_PNG_MAP = {};

// ─── Sizes ───────────────────────────────────────────────────────────────────
const SIZE_MAP = {
  xs:  { container: 36, circle: 28, icon: 14 },
  sm:  { container: 44, circle: 34, icon: 17 },
  md:  { container: 56, circle: 44, icon: 22 },
  lg:  { container: 72, circle: 56, icon: 28 },
  xl:  { container: 88, circle: 68, icon: 34 },
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function Icon3D({
  name,
  size = 'md',
  style,
  iconColor = '#FFFFFF',
  card = false,          // wrap in white card like 3dicons.co UI
  cardPadding = 6,
}) {
  const cfg  = CONFIGS[name] ?? CONFIGS.scan;
  const dims = SIZE_MAP[size] ?? SIZE_MAP.md;
  const png  = ICON_PNG_MAP[name];

  const circle = (
    <LinearGradient
      colors={cfg.g}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      style={[
        styles.circle,
        {
          width:        dims.circle,
          height:       dims.circle,
          borderRadius: dims.circle / 2,
        },
      ]}
    >
      {/* Top-left gloss shimmer */}
      <View style={styles.gloss} />

      {png ? (
        <Image
          source={png}
          style={{ width: dims.icon * 1.5, height: dims.icon * 1.5 }}
          resizeMode="contain"
        />
      ) : (
        <cfg.Icon
          size={dims.icon}
          color={iconColor}
          strokeWidth={cfg.stroke}
        />
      )}
    </LinearGradient>
  );

  if (card) {
    return (
      <View
        style={[
          styles.card,
          {
            width:        dims.container,
            height:       dims.container,
            borderRadius: dims.container * 0.28,
            padding:      cardPadding,
          },
          style,
        ]}
      >
        {circle}
      </View>
    );
  }

  return (
    <View style={[{ width: dims.circle, height: dims.circle }, style]}>
      {circle}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     '#000000',
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.10,
    shadowRadius:    12,
    elevation:       5,
  },
  circle: {
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
  },
  gloss: {
    position:        'absolute',
    top:             3,
    left:            4,
    width:           '55%',
    height:          '40%',
    borderRadius:    999,
    backgroundColor: 'rgba(255,255,255,0.28)',
    transform:       [{ rotate: '-15deg' }],
  },
});
