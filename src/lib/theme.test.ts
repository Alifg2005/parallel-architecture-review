import { describe, expect, it, vi } from 'vitest';
import { THEME_KEY, applyTheme, resolveInitialTheme, setTheme } from './theme';

function mockSystemDark(dark: boolean) {
  return vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: dark && query.includes('dark'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

describe('theme', () => {
  it('follows the system preference when nothing is saved', () => {
    const spy = mockSystemDark(true);
    expect(resolveInitialTheme()).toBe('dark');
    spy.mockRestore();
    const spy2 = mockSystemDark(false);
    expect(resolveInitialTheme()).toBe('light');
    spy2.mockRestore();
  });

  it('prefers the saved theme over the system preference', () => {
    const spy = mockSystemDark(true);
    localStorage.setItem(THEME_KEY, 'light');
    expect(resolveInitialTheme()).toBe('light');
    spy.mockRestore();
  });

  it('ignores corrupted saved values', () => {
    const spy = mockSystemDark(false);
    localStorage.setItem(THEME_KEY, 'purple');
    expect(resolveInitialTheme()).toBe('light');
    spy.mockRestore();
  });

  it('setTheme applies the attribute and persists it', () => {
    setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('does not throw when localStorage is unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => setTheme('dark')).not.toThrow();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    spy.mockRestore();
  });
});
