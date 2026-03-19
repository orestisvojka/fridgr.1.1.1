// src/constants/routes.js
// Centralized route name constants

export const ROUTES = {
  // ─── Root ──────────────────────────────────────────────────────────────────
  ROOT:        'Root',
  SPLASH:      'Splash',

  // ─── Auth ──────────────────────────────────────────────────────────────────
  AUTH:        'Auth',
  WELCOME:     'Welcome',
  LOGIN:       'Login',
  SIGN_UP:     'SignUp',
  FORGOT_PW:   'ForgotPassword',

  // ─── Onboarding ────────────────────────────────────────────────────────────
  ONBOARDING:        'Onboarding',
  ONBOARDING_CAROUSEL: 'OnboardingCarousel',
  QUESTIONNAIRE:     'Questionnaire',

  // ─── Main Tabs ─────────────────────────────────────────────────────────────
  MAIN:      'Main',
  DASHBOARD: 'Dashboard',
  SCAN:      'Scan',
  RECIPES:   'Recipes',
  FAVORITES: 'Favorites',
  PROFILE:   'Profile',

  // ─── Recipe Flow (nested in stacks) ───────────────────────────────────────
  RESULTS: 'Results',
  DETAIL:  'Detail',
  COOK_MODE: 'CookMode',

  // ─── Settings & More ───────────────────────────────────────────────────────
  SETTINGS:     'Settings',
  SUBSCRIPTION: 'Subscription',
  EDIT_PROFILE: 'EditProfile',
  NOTIFICATIONS: 'Notifications',
  HELP:          'Help',
  SCAN_HISTORY:  'ScanHistory',
};

export default ROUTES;
