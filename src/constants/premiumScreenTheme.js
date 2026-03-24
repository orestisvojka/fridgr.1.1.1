// src/constants/premiumScreenTheme.js
// Shared “questionnaire” visual system — gradients, glass, typography tokens for all screens.

/** Full-screen background (matches QuestionnaireScreen). */
export const PREMIUM_GRADIENT = ['#F0FFF4', '#E9FFF3', '#D4F8E8', '#06402B'];
export const PREMIUM_GRADIENT_START = { x: 0, y: 0 };
export const PREMIUM_GRADIENT_END = { x: 0.85, y: 1 };

/** Soft green haze at the top (same as questionnaire veil). */
export const PREMIUM_VEIL = {
  colors: ['rgba(6,64,43,0.12)', 'rgba(6,64,43,0)', 'transparent'],
  locations: [0, 0.35, 1],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

/** Compact hero bars (Dashboard, Profile, Recipes, Scan, Results, …). */
export const PREMIUM_HERO_COMPACT = ['#06402B', '#0D6B3F', '#116644'];
export const PREMIUM_HERO_COMPACT_START = { x: 0, y: 0 };
export const PREMIUM_HERO_COMPACT_END = { x: 1, y: 1 };

/** Wide marketing / subscription heroes. */
export const PREMIUM_BANNER = ['#F0FFF4', '#D4F8E8', '#06402B', '#052620'];
export const PREMIUM_BANNER_START = { x: 0, y: 0 };
export const PREMIUM_BANNER_END = { x: 1, y: 1 };

/** Onboarding carousel slides — same family as main gradient. */
export const PREMIUM_CAROUSEL_GRADIENTS = [
  ['#F0FFF4', '#D4F8E8', '#06402B'],
  ['#E9FFF3', '#C8F5DB', '#052620'],
  ['#F0FFF4', '#D4F8E8', '#0D6B3F'],
  ['#F6FFF9', '#D4F8E8', '#116644'],
  ['#E9FFF3', '#C8F5DB', '#06402B'],
];

/** Avatars and small circular brand marks. */
export const PREMIUM_AVATAR_GRADIENT = ['#06402B', '#052620'];

/** Primary CTA — solid vertical green (Continue, Sign in, Save, …). */
export const PREMIUM_CTA_VERTICAL = ['#06402B', '#0D6B3F'];
export const PREMIUM_CTA_VERTICAL_START = { x: 0, y: 0 };
export const PREMIUM_CTA_VERTICAL_END = { x: 0, y: 1 };

/** Icon rings / success badges on dark. */
export const PREMIUM_ICON_RING_GRADIENT = ['rgba(6,64,43,0.35)', 'rgba(13,107,63,0.15)'];

/** Soft icon tile on dark auth / forgot screens. */
export const PREMIUM_SOFT_ICON_GRADIENT = ['rgba(6,64,43,0.22)', 'rgba(13,107,63,0.42)'];

/** Favorites-style header (full-width rich bar). */
export const PREMIUM_HEADER_WIDE = ['#F0FFF4', '#D4F8E8', '#0D6B3F', '#06402B'];

export const PREMIUM = {
  rootBg: '#F0FFF4',
  text: '#06402B',
  textMuted: 'rgba(6,64,43,0.58)',
  iconMuted: 'rgba(6,64,43,0.95)',
  accent: '#06402B',
  accentSoft: 'rgba(6,64,43,0.22)',
  glass: 'rgba(6,64,43,0.08)',
  glassBorder: 'rgba(6,64,43,0.12)',
  footerBg: '#E9FFF3',
  btnEnabledTop: '#06402B',
  btnEnabledBottom: '#0D6B3F',
  btnDisabledBg: '#CCCCCC',
  btnDisabledBorder: '#AAAAAA',
  cardBg: 'rgba(249,250,251,0.85)',
  cardBorder: 'rgba(6,64,43,0.1)',
  inputBg: 'rgba(255,255,255,0.95)',
  backBtnBg: 'rgba(6,64,43,0.08)',
};
