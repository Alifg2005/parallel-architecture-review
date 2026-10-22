import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PROGRESS_KEY, getProgress, recordQuizAttempt, resetProgressCache, setReviewed } from './progress';

describe('progress', () => {
  beforeEach(() => resetProgressCache());

  it('records attempts and keeps the best score', () => {
    recordQuizAttempt('lecture-01', 12, 20);
    recordQuizAttempt('lecture-01', 17, 20);
    const r = recordQuizAttempt('lecture-01', 9, 20);
    expect(r).toMatchObject({ attempts: 3, bestScore: 17, lastScore: 9, total: 20 });
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).quizzes['lecture-01'].bestScore).toBe(17);
  });

  it('toggles the reviewed flag', () => {
    setReviewed('lecture-02', true);
    expect(getProgress().reviewed['lecture-02']).toBe(true);
    setReviewed('lecture-02', false);
    expect(getProgress().reviewed['lecture-02']).toBeUndefined();
  });

  it('falls back to empty progress when stored data is corrupted', () => {
    localStorage.setItem(PROGRESS_KEY, '{not json');
    expect(getProgress()).toEqual({ quizzes: {}, reviewed: {} });
  });

  it('keeps working in memory when storage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => recordQuizAttempt('lecture-03', 5, 20)).not.toThrow();
    expect(getProgress().quizzes['lecture-03']?.lastScore).toBe(5);
    spy.mockRestore();
  });
});
