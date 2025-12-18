/**
 * useTheme Hook
 * Feature: 009-apple-hig-ui-redesign
 * Dark mode theme management based on Apple HIG
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ThemeMode, EffectiveTheme } from '@/types/theme';

const STORAGE_KEY = 'theme-preference';

/**
 * Detect system color scheme preference
 */
function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light';

  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (error) {
    console.warn('Failed to detect system theme:', error);
  }

  return 'light';
}

/**
 * Load theme preference from localStorage
 */
function loadThemeFromStorage(): ThemeMode {
  if (typeof window === 'undefined') return 'system';

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to load theme from storage:', error);
  }

  return 'system';
}

/**
 * Save theme preference to localStorage
 */
function saveThemeToStorage(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to storage:', error);
  }
}

/**
 * Apply theme to DOM
 */
function applyThemeToDOM(effectiveTheme: EffectiveTheme): void {
  if (typeof window === 'undefined') return;

  if (effectiveTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

/**
 * useTheme Hook
 *
 * Manages theme state (light/dark/system) with localStorage persistence
 * and automatic system preference detection.
 *
 * @returns Theme state and control functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Current theme: {effectiveTheme}</p>
 *       <button onClick={toggleTheme}>Toggle Theme</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme() {
  // Initialize theme from storage (client-side only)
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<EffectiveTheme>('light');
  const [isClient, setIsClient] = useState(false);

  // Determine effective theme
  const effectiveTheme: EffectiveTheme = theme === 'system' ? systemTheme : theme;

  // Client-side initialization
  useEffect(() => {
    setIsClient(true);
    const storedTheme = loadThemeFromStorage();
    const detectedSystemTheme = getSystemTheme();

    setThemeState(storedTheme);
    setSystemTheme(detectedSystemTheme);

    // Apply initial theme
    const initialEffectiveTheme = storedTheme === 'system' ? detectedSystemTheme : storedTheme;
    applyThemeToDOM(initialEffectiveTheme);
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    if (!isClient) return;

    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        const newSystemTheme: EffectiveTheme = e.matches ? 'dark' : 'light';
        setSystemTheme(newSystemTheme);

        // If theme is set to system, apply the new system theme
        if (theme === 'system') {
          applyThemeToDOM(newSystemTheme);
        }
      };

      // Initial check
      handleChange(mediaQuery);

      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } catch (error) {
      console.warn('Failed to listen to system theme changes:', error);
    }
  }, [isClient, theme]);

  // Apply theme when it changes
  useEffect(() => {
    if (!isClient) return;
    applyThemeToDOM(effectiveTheme);
  }, [isClient, effectiveTheme]);

  /**
   * Set theme mode
   */
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    saveThemeToStorage(newTheme);

    // Immediately apply theme
    const newEffectiveTheme = newTheme === 'system' ? getSystemTheme() : newTheme;
    applyThemeToDOM(newEffectiveTheme);
  }, []);

  /**
   * Toggle between light and dark themes
   * (does not affect system mode)
   */
  const toggleTheme = useCallback(() => {
    const currentEffective = theme === 'system' ? systemTheme : theme;
    const newTheme: ThemeMode = currentEffective === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, systemTheme, setTheme]);

  return {
    /** Current theme mode (light, dark, or system) */
    theme,
    /** Effective theme being applied (resolved from system if mode='system') */
    effectiveTheme,
    /** Set theme mode */
    setTheme,
    /** Toggle between light and dark */
    toggleTheme,
  };
}
