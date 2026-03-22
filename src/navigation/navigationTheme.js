import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export function buildNavigationTheme(colors, isDark) {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.borderLight,
      notification: colors.primary,
    },
  };
}
