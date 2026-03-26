// src/constants/premiumScreenTheme.js
// Shared premium visual tokens — gradients, glass, typography.

/** Splash screen — warm cream (matches mockup screen2.png) */
export const PREMIUM_GRADIENT = ['#F9F7F2', '#F4F1EA', '#EDE8DF'];
export const PREMIUM_GRADIENT_START = { x: 0, y: 0 };
export const PREMIUM_GRADIENT_END   = { x: 0.6, y: 1 };

/** Soft sage haze at the top */
export const PREMIUM_VEIL = {
  colors:    ['rgba(62,107,80,0.06)', 'rgba(62,107,80,0)', 'transparent'],
  locations: [0, 0.35, 1],
  start:     { x: 0.5, y: 0 },
  end:       { x: 0.5, y: 1 },
};

/** Compact dark hero bars (Scan, Results, Profile, Favorites, Recipes…) */
export const PREMIUM_HERO_COMPACT       = ['#2C4D38', '#3E6B50', '#4A7C5E'];
export const PREMIUM_HERO_COMPACT_START = { x: 0, y: 0 };
export const PREMIUM_HERO_COMPACT_END   = { x: 1, y: 1 };

/** Light hero for Dashboard header */
export const PREMIUM_HERO_LIGHT       = ['#FFFFFF', '#F9F7F2'];
export const PREMIUM_HERO_LIGHT_START = { x: 0, y: 0 };
export const PREMIUM_HERO_LIGHT_END   = { x: 0, y: 1 };

/** Wide marketing / subscription heroes */
export const PREMIUM_BANNER       = ['#EDF5F0', '#D0E8D8', '#3E6B50', '#2C4D38'];
export const PREMIUM_BANNER_START = { x: 0, y: 0 };
export const PREMIUM_BANNER_END   = { x: 1, y: 1 };

/** Onboarding carousel slides */
export const PREMIUM_CAROUSEL_GRADIENTS = [
  ['#EDF5F0', '#D0E8D8', '#3E6B50'],
  ['#F4F1EA', '#D0E8D8', '#2C4D38'],
  ['#EDF5F0', '#D0E8D8', '#4A7C5E'],
  ['#F9F7F2', '#D0E8D8', '#3E6B50'],
  ['#F4F1EA', '#D0E8D8', '#2C4D38'],
];

/** Avatar gradient */
export const PREMIUM_AVATAR_GRADIENT = ['#3E6B50', '#2C4D38'];

/** Primary CTA vertical — solid sage green */
export const PREMIUM_CTA_VERTICAL       = ['#3E6B50', '#2C4D38'];
export const PREMIUM_CTA_VERTICAL_START = { x: 0, y: 0 };
export const PREMIUM_CTA_VERTICAL_END   = { x: 0, y: 1 };

/** Icon rings / success badges */
export const PREMIUM_ICON_RING_GRADIENT = ['rgba(62,107,80,0.30)', 'rgba(74,124,94,0.12)'];

/** Soft icon tile on auth screens */
export const PREMIUM_SOFT_ICON_GRADIENT = ['rgba(62,107,80,0.18)', 'rgba(74,124,94,0.38)'];

/** Favorites / wide header */
export const PREMIUM_HEADER_WIDE = ['#EDF5F0', '#D0E8D8', '#4A7C5E', '#3E6B50'];

export const PREMIUM = {
  rootBg:          '#F9F7F2',
  text:            '#3E6B50',
  textMuted:       'rgba(62,107,80,0.55)',
  iconMuted:       'rgba(62,107,80,0.90)',
  accent:          '#3E6B50',
  accentSoft:      'rgba(62,107,80,0.18)',
  glass:           'rgba(62,107,80,0.07)',
  glassBorder:     'rgba(62,107,80,0.12)',
  footerBg:        '#EDF5F0',
  btnEnabledTop:    '#3E6B50',
  btnEnabledBottom: '#2C4D38',
  btnDisabledBg:    '#CCCCCC',
  btnDisabledBorder:'#AAAAAA',
  cardBg:          'rgba(255,255,255,0.95)',
  cardBorder:      'rgba(62,107,80,0.10)',
  inputBg:         'rgba(255,255,255,0.96)',
  backBtnBg:       'rgba(62,107,80,0.08)',
};
