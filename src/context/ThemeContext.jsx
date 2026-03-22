// src/context/ThemeContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolveTheme, COLORS } from '../constants/theme';

const STORAGE_KEY = '@fridgr_dark_mode';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDarkState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && v !== null) setIsDarkState(v === '1');
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const setIsDark = useCallback(async (next) => {
    setIsDarkState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => setIsDark(!isDark), [isDark, setIsDark]);

  const colors = useMemo(() => resolveTheme(isDark), [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      ready,
      colors,
      setIsDark,
      toggle,
    }),
    [isDark, ready, colors, setIsDark, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** Drop-in replacement for static COLORS in screens — call at top of component. */
export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}

export { COLORS };
