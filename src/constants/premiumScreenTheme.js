// src/constants/premiumScreenTheme.js
// Shared “questionnaire” visual system — gradients, glass, typography tokens for all screens.

/** Full-screen background (matches QuestionnaireScreen). */
export const PREMIUM_GRADIENT = ['#070A08', '#0C1420', '#0F2918', '#14532D'];
export const PREMIUM_GRADIENT_START = { x: 0, y: 0 };
export const PREMIUM_GRADIENT_END = { x: 0.85, y: 1 };

/** Soft green haze at the top (same as questionnaire veil). */
export const PREMIUM_VEIL = {
  colors: ['rgba(74,222,128,0.12)', 'rgba(74,222,128,0)', 'transparent'],
  locations: [0, 0.35, 1],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

/** Compact hero bars (Dashboard, Profile, Recipes, Scan, Results, …). */
export const PREMIUM_HERO_COMPACT = ['#070A08', '#0F2918', '#166534'];
export const PREMIUM_HERO_COMPACT_START = { x: 0, y: 0 };
export const PREMIUM_HERO_COMPACT_END = { x: 1, y: 1 };

/** Wide marketing / subscription heroes. */
export const PREMIUM_BANNER = ['#070A08', '#0F2918', '#15803D', '#22C55E'];
export const PREMIUM_BANNER_START = { x: 0, y: 0 };
export const PREMIUM_BANNER_END = { x: 1, y: 1 };

/** Onboarding carousel slides — same family as main gradient. */
export const PREMIUM_CAROUSEL_GRADIENTS = [
  ['#070A08', '#0C1420', '#14532D'],
  ['#08120C', '#0F2918', '#166534'],
  ['#050A07', '#0F3D22', '#15803D'],
  ['#070A08', '#0F172A', '#134E2C'],
  ['#060D09', '#0D3321', '#16A34A'],
];

/** Avatars and small circular brand marks. */
export const PREMIUM_AVATAR_GRADIENT = ['#22C55E', '#15803D'];

/** Primary CTA — solid vertical green (Continue, Sign in, Save, …). */
export const PREMIUM_CTA_VERTICAL = ['#22C55E', '#15803D'];
export const PREMIUM_CTA_VERTICAL_START = { x: 0, y: 0 };
export const PREMIUM_CTA_VERTICAL_END = { x: 0, y: 1 };

/** Icon rings / success badges on dark. */
export const PREMIUM_ICON_RING_GRADIENT = ['rgba(74,222,128,0.35)', 'rgba(34,197,94,0.15)'];

/** Soft icon tile on dark auth / forgot screens. */
export const PREMIUM_SOFT_ICON_GRADIENT = ['rgba(74,222,128,0.22)', 'rgba(21,128,61,0.42)'];

/** Favorites-style header (full-width rich bar). */
export const PREMIUM_HEADER_WIDE = ['#070A08', '#0C1420', '#0F2918', '#166534'];

export const PREMIUM = {
  rootBg: '#070A08',
  text: '#F8FAFC',
  textMuted: 'rgba(248,250,252,0.58)',
  iconMuted: 'rgba(148,163,184,0.95)',
  accent: '#4ADE80',
  accentSoft: 'rgba(74,222,128,0.22)',
  glass: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.12)',
  footerBg: '#080C0A',
  btnEnabledTop: '#22C55E',
  btnEnabledBottom: '#15803D',
  btnDisabledBg: '#1E293B',
  btnDisabledBorder: '#334155',
  cardBg: 'rgba(15,23,42,0.55)',
  cardBorder: 'rgba(255,255,255,0.1)',
  inputBg: 'rgba(30,41,59,0.9)',
  backBtnBg: 'rgba(15,23,42,0.85)',
};
