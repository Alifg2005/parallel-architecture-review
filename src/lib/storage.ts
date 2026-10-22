/**
 * Safe wrappers around localStorage. Storage can be unavailable (private mode, blocked site data,
 * quota). Every function here degrades gracefully and never throws.
 */

function getStore(): Storage | null {
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readString(key: string): string | null {
  try {
    return getStore()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): boolean {
  try {
    const store = getStore();
    if (!store) return false;
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readJson<T>(key: string, fallback: T, isValid: (v: unknown) => v is T): T {
  const raw = readString(key);
  if (raw === null) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  return writeString(key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  try {
    getStore()?.removeItem(key);
  } catch {
    /* storage unavailable — nothing to remove */
  }
}
