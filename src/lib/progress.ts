import { useSyncExternalStore } from 'react';
import { readJson, removeKey, writeJson } from './storage';

export const PROGRESS_KEY = 'pca-progress-v1';

export interface QuizRecord {
  attempts: number;
  bestScore: number;
  lastScore: number;
  total: number;
  lastAttemptAt: string;
}

export interface Progress {
  quizzes: Record<string, QuizRecord>;
  reviewed: Record<string, boolean>;
}

const EMPTY: Progress = { quizzes: {}, reviewed: {} };

function isProgress(v: unknown): v is Progress {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Partial<Progress>;
  return (
    typeof p.quizzes === 'object' && p.quizzes !== null && typeof p.reviewed === 'object' && p.reviewed !== null
  );
}

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function load(): Progress {
  if (!cache) cache = readJson(PROGRESS_KEY, EMPTY, isProgress);
  return cache;
}

function save(next: Progress) {
  cache = next;
  writeJson(PROGRESS_KEY, next); // if storage is unavailable, progress still lives for this session
  listeners.forEach((l) => l());
}

export function getProgress(): Progress {
  return load();
}

export function recordQuizAttempt(chapterId: string, correct: number, total: number, now = new Date()): QuizRecord {
  const current = load();
  const prev = current.quizzes[chapterId];
  const record: QuizRecord = {
    attempts: (prev?.attempts ?? 0) + 1,
    bestScore: Math.max(prev?.bestScore ?? 0, correct),
    lastScore: correct,
    total,
    lastAttemptAt: now.toISOString(),
  };
  save({ ...current, quizzes: { ...current.quizzes, [chapterId]: record } });
  return record;
}

export function setReviewed(chapterId: string, reviewed: boolean) {
  const current = load();
  const next = { ...current.reviewed };
  if (reviewed) next[chapterId] = true;
  else delete next[chapterId];
  save({ ...current, reviewed: next });
}

export function resetProgress() {
  removeKey(PROGRESS_KEY);
  cache = null;
  listeners.forEach((l) => l());
}

/** Test helper: drop the in-memory cache so the next read goes back to storage. */
export function resetProgressCache() {
  cache = null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}
