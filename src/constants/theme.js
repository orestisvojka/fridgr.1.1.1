// src/constants/theme.js
// Premium FRIDGR Design System — Professional UI Standards

export const COLORS = {
  // ─── Brand Primary (Forest Green) ────────────────────────────────────────
  primary: '#15803D',
  primaryMid: '#16A34A',
  primaryLight: '#22C55E',
  primaryPale: '#DCFCE7',
  primaryFaint: '#F0FDF4',
  primaryDark: '#14532D',
  primaryGradient: ['#15803D', '#16A34A'],
  primaryGradientFull: ['#0F4C25', '#15803D', '#16A34A'],

  // ─── Accent (Warm Amber / Food Tone) ─────────────────────────────────────
  accent: '#D97706',
  accentLight: '#F59E0B',
  accentPale: '#FEF3C7',
  accentFaint: '#FFFBEB',

  // ─── Warm Neutrals (Stone Palette) ───────────────────────────────────────
  background:   '#FAFAF9',
  surface:      '#FFFFFF',
  surface2:     '#F5F4F0',
  surface3:     '#ECEAE6',
  border:       '#E2DFD8',
  borderLight:  '#F0EDE8',
  borderStrong: '#C4BFB8',

  // ─── Text ─────────────────────────────────────────────────────────────────
  text:          '#1C1917',
  textSecondary: '#78716C',
  textTertiary:  '#A8A29E',
  textDisabled:  '#D6D3D0',
  textInverse:   '#FFFFFF',
  textPrimary:   '#15803D',
  textAccent:    '#D97706',

  // ─── Status ───────────────────────────────────────────────────────────────
  success:      '#15803D',
  successLight: '#DCFCE7',
  warning:      '#D97706',
  warningLight: '#FEF3C7',
  error:        '#DC2626',
  errorLight:   '#FEE2E2',
  info:         '#0284C7',
  infoLight:    '#E0F2FE',

  // ─── Overlays ─────────────────────────────────────────────────────────────
  overlay:      'rgba(28, 25, 23, 0.65)',
  overlayLight: 'rgba(28, 25, 23, 0.12)',
  overlayCard:  'rgba(28, 25, 23, 0.04)',

  // ─── Utility ──────────────────────────────────────────────────────────────
  white:       '#FFFFFF',
  black:       '#000000',
  transparent: 'transparent',
  star:        '#F59E0B',

  // ─── Dark Mode Surface ────────────────────────────────────────────────────
  dark: {
    background:    '#100F0C',
    surface:       '#1A1814',
    surface2:      '#242018',
    surface3:      '#302C26',
    border:        '#3D3830',
    text:          '#F5F2ED',
    textSecondary: '#A8A29E',
    textTertiary:  '#6B6560',
  },

  // ─── Onboarding Gradient Stops ────────────────────────────────────────────
  onboarding: [
    ['#0F4C25', '#0A2E16'],
    ['#14532D', '#0F3D22'],
    ['#15803D', '#14532D'],
    ['#0D3321', '#16A34A'],
    ['#0A1F13', '#15803D'],
  ],

  // ─── Recipe Accent Palettes ───────────────────────────────────────────────
  recipePalettes: [
    { color: '#EA580C', bg: '#FFF7ED', light: '#FFEDD5' },
    { color: '#15803D', bg: '#F0FDF4', light: '#DCFCE7' },
    { color: '#D97706', bg: '#FFFBEB', light: '#FEF3C7' },
    { color: '#DB2777', bg: '#FDF2F8', light: '#FCE7F3' },
    { color: '#7C3AED', bg: '#F5F3FF', light: '#EDE9FE' },
    { color: '#0284C7', bg: '#F0F9FF', light: '#E0F2FE' },
    { color: '#0F766E', bg: '#F0FDFA', light: '#CCFBF1' },
    { color: '#BE123C', bg: '#FFF1F2', light: '#FFE4E6' },
  ],
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const SPACING = {
  xxs:    2,
  xs:     4,
  sm:     8,
  md:    12,
  lg:    16,
  xl:    20,
  xxl:   24,
  xxxl:  32,
  section: 40,
  screen:  20,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  full: 999,
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const FONT = {
  // Display
  display: {
    fontSize: 40, fontWeight: '800',
    letterSpacing: -1.5, lineHeight: 46,
  },
  hero: {
    fontSize: 32, fontWeight: '800',
    letterSpacing: -1, lineHeight: 38,
  },
  // Headings
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3, lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '700', letterSpacing: -0.2, lineHeight: 26 },
  h4: { fontSize: 18, fontWeight: '600', letterSpacing: -0.1, lineHeight: 24 },
  h5: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  // Body
  body:           { fontSize: 15, fontWeight: '400', lineHeight: 23 },
  bodyMedium:     { fontSize: 15, fontWeight: '500', lineHeight: 23 },
  bodySemiBold:   { fontSize: 15, fontWeight: '600', lineHeight: 23 },
  bodySmall:      { fontSize: 13, fontWeight: '400', lineHeight: 20 },
  bodySmallMedium:{ fontSize: 13, fontWeight: '500', lineHeight: 20 },
  // Labels
  label:      { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  labelSmall: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  // Caption
  caption:       { fontSize: 11, fontWeight: '400', lineHeight: 16 },
  captionMedium: { fontSize: 11, fontWeight: '500', lineHeight: 16 },
};

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const SHADOWS = {
  none: {},
  xs: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.11,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 12,
  },
  green: {
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  accent: {
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

// ─── Difficulty Color Map ─────────────────────────────────────────────────────
export const DIFFICULTY_COLORS = {
  Easy:   { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  Medium: { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B' },
  Hard:   { bg: '#FFF1F2', text: '#BE123C', dot: '#F43F5E' },
};

// ─── Tab Bar ─────────────────────────────────────────────────────────────────
export const TAB_BAR = {
  height: 80,
  paddingBottom: 20,
  backgroundColor: '#FFFFFF',
  borderTopColor: '#F0EDE8',
  borderTopWidth: 1,
};

export default {
  COLORS,
  SPACING,
  RADIUS,
  FONT,
  SHADOWS,
  DIFFICULTY_COLORS,
  TAB_BAR,
};
