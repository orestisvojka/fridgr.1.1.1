// src/constants/theme.js
// Premium FRIDGR Design System — Professional UI Standards

export const COLORS = {
  // Brand (exact palette)
  primary: '#4FF980',
  primaryMid: '#7CFFB2',
  primaryLight: '#B8FFD6',
  secondary: '#A7F3D0',
  primaryPale: '#E9FFF3',
  primaryFaint: '#F6FFF9',
  primaryDark: '#22C55E',
  primaryGradient: ['#7CFFB2', '#4FF980'],
  primaryGradientFull: ['#B8FFD6', '#7CFFB2', '#4FF980'],

  accent: '#FFE066',
  accentLight: '#FFF7B2',
  accentPale: '#FFFBE6',
  accentFaint: '#FFFEF6',

  background: '#FFFFFF',
  surface: '#F9FAFB',
  surface2: '#F3F4F6',
  surface3: '#E5E7EB',
  border: '#E5E7EB',
  borderLight: '#F1F5F9',
  borderStrong: '#CBD5E1',

  text: '#22292F',
  textSecondary: '#7B8A99',
  textTertiary: '#B0B8C1',
  textDisabled: '#E5E7EB',
  textInverse: '#FFFFFF',
  textPrimary: '#4FF980',
  textAccent: '#FFE066',

  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F97316',
  warningLight: '#FFEDD5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  overlay: 'rgba(15, 23, 42, 0.55)',
  overlayLight: 'rgba(15, 23, 42, 0.08)',
  overlayCard: 'rgba(15, 23, 42, 0.04)',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  star: '#FACC15',

  dark: {
    background: '#0F172A',
    surface: '#111827',
    surface2: '#1F2937',
    surface3: '#374151',
    border: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
  },

  onboarding: [
    ['#0F172A', '#14532D'],
    ['#111827', '#166534'],
    ['#0F172A', '#22C55E'],
    ['#14532D', '#FACC15'],
    ['#0F172A', '#16A34A'],
  ],

  recipePalettes: [
    { color: '#F97316', bg: '#FFF7ED', light: '#FFEDD5' },
    { color: '#22C55E', bg: '#ECFDF5', light: '#DCFCE7' },
    { color: '#FACC15', bg: '#FEFCE8', light: '#FEF9C3' },
    { color: '#EC4899', bg: '#FDF2F8', light: '#FCE7F3' },
    { color: '#3B82F6', bg: '#EFF6FF', light: '#DBEAFE' },
    { color: '#8B5CF6', bg: '#F5F3FF', light: '#EDE9FE' },
    { color: '#14B8A6', bg: '#F0FDFA', light: '#CCFBF1' },
    { color: '#EF4444', bg: '#FEF2F2', light: '#FEE2E2' },
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
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  accent: {
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

// ─── Difficulty Color Map ─────────────────────────────────────────────────────
export const DIFFICULTY_COLORS = {
  Easy:   { bg: '#ECFDF5', text: '#22C55E', dot: '#4ADE80' },
  Medium: { bg: '#FEFCE8', text: '#CA8A04', dot: '#FACC15' },
  Hard:   { bg: '#FEF2F2', text: '#EF4444', dot: '#F97316' },
};

// ─── Tab Bar ─────────────────────────────────────────────────────────────────
export const TAB_BAR = {
  height: 80,
  paddingBottom: 20,
  backgroundColor: '#FFFFFF',
  borderTopColor: '#E5E7EB',
  borderTopWidth: 1,
};

/** Resolved palette for light/dark (spread over COLORS). Use with useThemeColors(). */
export function resolveTheme(isDark) {
  if (!isDark) {
    return { ...COLORS, isDark: false };
  }
  const d = COLORS.dark;
  return {
    ...COLORS,
    isDark: true,
    background: d.background,
    surface: d.surface,
    surface2: d.surface2,
    surface3: d.surface3,
    border: d.border,
    borderLight: '#1F2937',
    borderStrong: '#4B5563',
    text: d.text,
    textSecondary: d.textSecondary,
    textTertiary: d.textTertiary,
    textDisabled: '#6B7280',
    overlayCard: 'rgba(255,255,255,0.06)',
  };
}

export default {
  COLORS,
  SPACING,
  RADIUS,
  FONT,
  SHADOWS,
  DIFFICULTY_COLORS,
  TAB_BAR,
  resolveTheme,
};
