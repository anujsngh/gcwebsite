import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ContrastMode = 'normal' | 'high-contrast' | 'yellow-black';
export type FontSize = 'normal' | 'large' | 'x-large';
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontFamily = 'default' | 'dyslexic';

interface AccessibilityState {
  themeMode: ThemeMode;
  contrastMode: ContrastMode;
  fontSize: FontSize;
  fontFamily: FontFamily;
  reducedMotion: boolean;
}

interface AccessibilityContextValue extends AccessibilityState {
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  setContrastMode: (mode: ContrastMode) => void;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setReducedMotion: (value: boolean) => void;
  resetAll: () => void;
}

const DEFAULT_STATE: AccessibilityState = {
  themeMode: 'system',
  contrastMode: 'normal',
  fontSize: 'normal',
  fontFamily: 'default',
  reducedMotion: false,
};

const STORAGE_KEY = 'gcwebsite-a11y-prefs';

const getSystemTheme = (): 'light' | 'dark' => {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const loadFromStorage = (): AccessibilityState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AccessibilityState>;
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_STATE;
};

export const AccessibilityContext = createContext<AccessibilityContextValue>({
  ...DEFAULT_STATE,
  resolvedTheme: 'light',
  setThemeMode: () => {},
  setContrastMode: () => {},
  setFontSize: () => {},
  setFontFamily: () => {},
  setReducedMotion: () => {},
  resetAll: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(loadFromStorage);
  const [systemDark, setSystemDark] = useState<boolean>(getSystemTheme() === 'dark');

  // Listen for OS-level dark/light theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Derive the resolved theme — used both for DOM updates and for exposing to consumers
  const resolvedTheme: 'light' | 'dark' =
    state.contrastMode !== 'normal'
      ? 'light'
      : state.themeMode === 'system'
      ? (systemDark ? 'dark' : 'light')
      : state.themeMode === 'dark'
      ? 'dark'
      : 'light';

  // Apply data-* attributes to <html> whenever any relevant value changes.
  // Deliberately depend on state fields individually + systemDark to avoid
  // stale-closure issues with a derived const in the dependency array.
  useEffect(() => {
    const html = document.documentElement;

    // Theme: compute directly from primitives here to guarantee freshness
    let theme: string;
    if (state.contrastMode === 'high-contrast') {
      theme = 'high-contrast';
    } else if (state.contrastMode === 'yellow-black') {
      theme = 'yellow-black';
    } else if (state.themeMode === 'system') {
      theme = systemDark ? 'dark' : 'light';
    } else {
      // 'light' or 'dark' stored directly
      theme = state.themeMode;
    }
    html.setAttribute('data-theme', theme);

    // Font size
    if (state.fontSize === 'normal') {
      html.removeAttribute('data-font-size');
    } else {
      html.setAttribute('data-font-size', state.fontSize);
    }

    // Font family
    if (state.fontFamily === 'default') {
      html.removeAttribute('data-font-family');
    } else {
      html.setAttribute('data-font-family', state.fontFamily);
    }

    // Reduced motion
    if (state.reducedMotion) {
      html.setAttribute('data-reduced-motion', 'true');
    } else {
      html.removeAttribute('data-reduced-motion');
    }
  }, [
    state.themeMode,
    state.contrastMode,
    state.fontSize,
    state.fontFamily,
    state.reducedMotion,
    systemDark,
  ]);

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setState(prev => ({ ...prev, themeMode: mode }));
  }, []);

  const setContrastMode = useCallback((mode: ContrastMode) => {
    setState(prev => ({ ...prev, contrastMode: mode }));
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    setState(prev => ({ ...prev, fontSize: size }));
  }, []);

  const setFontFamily = useCallback((family: FontFamily) => {
    setState(prev => ({ ...prev, fontFamily: family }));
  }, []);

  const setReducedMotion = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, reducedMotion: value }));
  }, []);

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        resolvedTheme,
        setThemeMode,
        setContrastMode,
        setFontSize,
        setFontFamily,
        setReducedMotion,
        resetAll,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
