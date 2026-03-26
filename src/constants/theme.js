// src/constants/theme.js
// FRIDGR Design System — Warm Cream + Sage Green (matches mockup)

export const COLORS = {
  // ─── Brand Green (sage forest) ────────────────────────────────────────
  primary:            '#3E6B50',
  primaryMid:         '#4A7C5E',
  primaryLight:       '#5D9070',
  primaryPale:        '#D0E8D8',
  primaryFaint:       '#EDF5F0',
  primaryDark:        '#2C4D38',
  primaryGradient:    ['#3E6B50', '#2C4D38'],
  primaryGradientFull:['#5D9070', '#3E6B50', '#2C4D38'],

  // ─── Warm Amber Accent ────────────────────────────────────────────────
  accent:             '#C09A42',
  accentLight:        '#E8D090',
  accentPale:         '#FAF0D0',
  accentFaint:        '#FDF8EC',

  // ─── Backgrounds — Warm Cream ─────────────────────────────────────────
  background:         '#F9F7F2',
  surface:            '#FFFFFF',
  surface2:           '#F4F1EA',
  surface3:           '#EDE8DF',
  border:             '#E4DDD2',
  borderLight:        '#EAE6DD',
  borderStrong:       '#CEC8BC',

  // ─── Text ─────────────────────────────────────────────────────────────
  text:               '#1E1E1C',
  textSecondary:      '#4A4A46',
  textTertiary:       '#8A8A84',
  textDisabled:       '#C4C0B8',
  textInverse:        '#FFFFFF',
  textPrimary:        '#3E6B50',
  textAccent:         '#C09A42',

  // ─── Semantic ─────────────────────────────────────────────────────────
  success:            '#3E6B50',
  successLight:       '#D0E8D8',
  warning:            '#C09A42',
  warningLight:       '#FAF0D0',
  error:              '#B84040',
  errorLight:         '#FCECEC',
  info:               '#2E6DA4',
  infoLight:          '#E4EEF8',

  // ─── Overlays ─────────────────────────────────────────────────────────
  overlay:            'rgba(30, 30, 28, 0.5)',
  overlayLight:       'rgba(30, 30, 28, 0.06)',
  overlayCard:        'rgba(30, 30, 28, 0.03)',

  // ─── Base ─────────────────────────────────────────────────────────────
  white:              '#FFFFFF',
  black:              '#1E1E1C',
  transparent:        'transparent',
  star:               '#C09A42',

  // ─── Dark Mode ────────────────────────────────────────────────────────
  dark: {
    background:    'rgba(14, 20, 16, 0.97)',
    surface:       'rgba(20, 28, 22, 0.90)',
    surface2:      'rgba(30, 40, 32, 0.90)',
    surface3:      'rgba(44, 56, 46, 0.92)',
    border:        '#2E4038',
    text:          '#F2F5F0',
    textSecondary: '#A0AEA4',
    textTertiary:  '#6A7A70',
  },

  // ─── Onboarding Slides ────────────────────────────────────────────────
  onboarding: [
    ['#1A2E22', '#2C4D38'],
    ['#1A2E22', '#3E6B50'],
    ['#1A2E22', '#4A7C5E'],
    ['#2C4D38', '#C09A42'],
    ['#1A2E22', '#3E6B50'],
  ],

  // ─── Recipe Card Palettes ─────────────────────────────────────────────
  recipePalettes: [
    { color: '#B85030', bg: '#FFF3EE', light: '#FFE4DA' },
    { color: '#3E6B50', bg: '#EDF5F0', light: '#D0E8D8' },
    { color: '#C09A42', bg: '#FAF0D0', light: '#F0DFA0' },
    { color: '#B83870', bg: '#FAF0F6', light: '#F5DAEA' },
    { color: '#2E6DA4', bg: '#E8F0F8', light: '#D0E2F4' },
    { color: '#7048AC', bg: '#F2EEF8', light: '#E2D8F4' },
    { color: '#2C8A78', bg: '#E8F5F2', light: '#C8EAE4' },
    { color: '#9E3828', bg: '#FBF0EE', light: '#F5DCDA' },
  ],
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const SPACING = {
  xxs:     2,
  xs:      4,
  sm:      8,
  md:      12,
  lg:      16,
  xl:      20,
  xxl:     24,
  xxxl:    32,
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
  display: { fontSize: 40, fontWeight: '800', letterSpacing: -1.5, lineHeight: 46 },
  hero:    { fontSize: 32, fontWeight: '800', letterSpacing: -1,   lineHeight: 38 },
  h1:      { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, lineHeight: 34 },
  h2:      { fontSize: 24, fontWeight: '700', letterSpacing: -0.3, lineHeight: 30 },
  h3:      { fontSize: 20, fontWeight: '700', letterSpacing: -0.2, lineHeight: 26 },
  h4:      { fontSize: 18, fontWeight: '600', letterSpacing: -0.1, lineHeight: 24 },
  h5:      { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  body:            { fontSize: 15, fontWeight: '400', lineHeight: 23 },
  bodyMedium:      { fontSize: 15, fontWeight: '500', lineHeight: 23 },
  bodySemiBold:    { fontSize: 15, fontWeight: '600', lineHeight: 23 },
  bodySmall:       { fontSize: 13, fontWeight: '400', lineHeight: 20 },
  bodySmallMedium: { fontSize: 13, fontWeight: '500', lineHeight: 20 },
  label:      { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  labelSmall: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  caption:       { fontSize: 11, fontWeight: '400', lineHeight: 16 },
  captionMedium: { fontSize: 11, fontWeight: '500', lineHeight: 16 },
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const SHADOWS = {
  none: {},
  xs: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 12,
  },
  green: {
    shadowColor: '#3E6B50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  accent: {
    shadowColor: '#C09A42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
};

// ─── Difficulty Colors ────────────────────────────────────────────────────────
export const DIFFICULTY_COLORS = {
  Easy:   { bg: '#EDF5F0', text: '#3E6B50', dot: '#5D9070' },
  Medium: { bg: '#FAF0D0', text: '#8A6820', dot: '#C09A42' },
  Hard:   { bg: '#FCECEC', text: '#8A2828', dot: '#B84040' },
};

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
export const TAB_BAR = {
  height:          78,
  paddingBottom:   18,
  backgroundColor: '#FFFFFF',
  borderTopColor:  '#E4DDD2',
  borderTopWidth:  1,
};

export function resolveTheme(isDark) {
  if (!isDark) return { ...COLORS, isDark: false };
  const d = COLORS.dark;
  return {
    ...COLORS,
    isDark: true,
    background:   d.background,
    surface:      d.surface,
    surface2:     d.surface2,
    surface3:     d.surface3,
    border:       d.border,
    borderLight:  '#233030',
    borderStrong: '#3A5048',
    text:         d.text,
    textSecondary: d.textSecondary,
    textTertiary:  d.textTertiary,
    textDisabled:  '#4A5A50',
    overlayCard:   'rgba(255,255,255,0.05)',
  };
}

export default { COLORS, SPACING, RADIUS, FONT, SHADOWS, DIFFICULTY_COLORS, TAB_BAR, resolveTheme };
