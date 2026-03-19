// src/styles/theme.js
// Central design system for FRIDGR

export const colors = {
  // Backgrounds
  bgPrimary: '#0A2E1A',
  bgSecondary: '#0F3D22',
  bgCard: '#FFFFFF',
  bgCardAlt: '#F8FAF8',
  bgInput: '#1A4A2A',
  bgMuted: '#F3F4F6',

  // Brand
  green: '#22C55E',
  greenDark: '#16A34A',
  greenLight: '#DCFCE7',
  greenMid: '#4ADE80',
  greenAccent: '#86EFAC',

  // Text
  textPrimary: '#0F1714',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  textOnDark: 'rgba(255,255,255,0.85)',
  textOnDarkMuted: 'rgba(255,255,255,0.5)',

  // UI
  border: '#E5E7EB',
  borderDark: 'rgba(255,255,255,0.12)',

  // States
  error: '#EF4444',
  errorBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningText: '#92400E',
  success: '#22C55E',

  // Misc
  overlay: 'rgba(0,0,0,0.55)',
  star: '#F59E0B',
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
