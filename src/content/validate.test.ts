import { describe, expect, it } from 'vitest';
import { chapters, registryErrors } from './registry';
import { QUIZ_LENGTH, validateChapter } from './validate';
import { chapter as lecture01 } from './chapters/lecture-01';
import type { Chapter } from './schema';

const clone = (c: Chapter): Chapter => structuredClone(c);

describe('all registered chapters', () => {
  it('registry reports no validation errors', () => {
    expect(registryErrors).toEqual([]);
  });

  it('discovers the six initial lectures (and any later ones) in order', () => {
    const numbers = chapters.map((c) => c.meta.number);
    expect(numbers.slice(0, 6)).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
  });

  describe.each(chapters.map((c) => [c.meta.id, c] as const))('%s', (_id, chapter) => {
    it('passes validateChapter', () => {
      expect(validateChapter(chapter, chapter.meta.id)).toEqual([]);
    });

    it(`has exactly ${QUIZ_LENGTH} questions`, () => {
      expect(chapter.quiz).toHaveLength(QUIZ_LENGTH);
    });

    it('every question has four distinct options, a valid answer key and an explanation', () => {
      for (const q of chapter.quiz) {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options.map((o) => o.trim().toLowerCase())).size).toBe(4);
        expect([0, 1, 2, 3]).toContain(q.answer);
        expect(q.options[q.answer]?.trim()).toBeTruthy();
        expect(q.explanation.trim().length).toBeGreaterThan(10);
      }
    });

    it('has 5–10 essay questions with model answers', () => {
      expect(chapter.essays.length).toBeGreaterThanOrEqual(5);
      expect(chapter.essays.length).toBeLessThanOrEqual(10);
      for (const e of chapter.essays) expect(e.modelAnswer.length).toBeGreaterThan(0);
    });

    it('never references local files or the private folder in its content', () => {
      const text = JSON.stringify(chapter);
      expect(text).not.toMatch(/private-material/i);
      expect(text).not.toMatch(/\.pdf|\.pptx/i);
    });
  });
});

describe('validateChapter catches broken content', () => {
  it('flags a quiz with 19 questions', () => {
    const c = clone(lecture01);
    c.quiz.pop();
    expect(validateChapter(c).join()).toMatch(/exactly 20/);
  });

  it('flags duplicate options', () => {
    const c = clone(lecture01);
    c.quiz[0]!.options = ['Same', 'same', 'Other', 'Another'];
    expect(validateChapter(c).join()).toMatch(/duplicate options/);
  });

  it('flags an invalid answer index', () => {
    const c = clone(lecture01);
    (c.quiz[0] as { answer: number }).answer = 4;
    expect(validateChapter(c).join()).toMatch(/invalid answer index/);
  });

  it('flags a missing explanation', () => {
    const c = clone(lecture01);
    c.quiz[3]!.explanation = '  ';
    expect(validateChapter(c).join()).toMatch(/no explanation/);
  });

  it('flags duplicate question prompts', () => {
    const c = clone(lecture01);
    c.quiz[1]!.prompt = c.quiz[0]!.prompt;
    expect(validateChapter(c).join()).toMatch(/duplicates another prompt/);
  });

  it('flags an id / number / folder mismatch', () => {
    const c = clone(lecture01);
    c.meta.number = 2;
    const errors = validateChapter(c, 'lecture-09').join();
    expect(errors).toMatch(/does not match id/);
    expect(errors).toMatch(/folder "lecture-09"/);
  });

  it('flags answer keys concentrated on one letter', () => {
    const c = clone(lecture01);
    c.quiz.forEach((q) => {
      const correct = q.options[q.answer]!;
      const others = q.options.filter((_, i) => i !== q.answer);
      q.options = [correct, ...others] as typeof q.options;
      q.answer = 0;
    });
    expect(validateChapter(c).join()).toMatch(/option A is correct 20 times/);
  });
});
