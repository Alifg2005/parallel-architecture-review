import { useSyncExternalStore } from 'react';
import { readString, writeString } from './storage';

export type Theme = 'light' | 'dark';
export const THEME_KEY = 'pca-theme';

/** Saved preference, else the system preference. Mirrors the inline script in index.html. */
export function resolveInitialTheme(): Theme {
  const saved = readString(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}

const listeners = new Set<() => void>();

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'dark' || attr === 'light' ? attr : resolveInitialTheme();
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
  writeString(THEME_KEY, theme);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme, (): Theme => 'light');
  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return { theme, toggle };
}
