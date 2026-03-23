// src/styles/theme.js
// Central design system for FRIDGR

export const colors = {
  // Backgrounds
  bgPrimary: '#FFFFFF', // Brightest background
  bgSecondary: '#F9FAFB',
  bgCard: '#F9FAFB',
  bgCardAlt: '#F6FFF9',
  bgInput: '#FFFFFF',
  bgMuted: '#E9FFF3',

  // Brand
  green: '#4FF980',      // Brighter Emerald Green (Primary)
  greenDark: '#22C55E',
  greenLight: '#B8FFD6',
  greenMid: '#7CFFB2',
  greenAccent: '#A7F3D0',

  // Dark Mode Foundations (for future use)
  darkBg: '#0F172A',
  darkCard: '#1E293B',

  // Text
  textPrimary: '#22292F',
  textSecondary: '#7B8A99',
  textMuted: '#B0B8C1',
  textInverse: '#FFFFFF',
  textOnDark: 'rgba(255,255,255,0.95)',
  textOnDarkMuted: 'rgba(255,255,255,0.7)',

  // UI
  border: '#E5E7EB',
  borderDark: '#F3F4F6',

  // States
  error: '#EF4444',
  errorBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningText: '#92400E',
  success: '#10B981',

  // Misc
  overlay: 'rgba(0,0,0,0.08)',
  star: '#FFE066',
};

export const icons = {
  size: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 32,
  },
  stroke: {
    thin: 1.5,
    regular: 2,
    bold: 2.5,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 50,
  circle: 9999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 36,
  hero: 48,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  green: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
};

// Recipe difficulty color map
export const difficultyColors = {
  Easy: { bg: '#DCFCE7', text: '#16A34A' },
  Medium: { bg: '#FEF3C7', text: '#D97706' },
  Hard: { bg: '#FEE2E2', text: '#DC2626' },
};

// Recipe accent palettes (cycled through recipes)
export const recipePalettes = [
  { color: '#FF6B35', bg: '#FFF3EE' },
  { color: '#4CAF50', bg: '#F0FFF0' },
  { color: '#FF9800', bg: '#FFF8E1' },
  { color: '#E91E63', bg: '#FCE4EC' },
  { color: '#9C27B0', bg: '#F3E5F5' },
  { color: '#2196F3', bg: '#E3F2FD' },
];
