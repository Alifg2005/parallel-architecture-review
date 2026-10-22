import { describe, expect, it } from 'vitest';
import { performanceBand, scoreQuiz } from './quiz';
import { chapter } from '../content/chapters/lecture-02';

const questions = chapter.quiz;
const key = questions.map((q) => q.answer);
const wrong = (a: number) => (a + 1) % 4;

describe('scoreQuiz', () => {
  it('scores a perfect attempt as 20/20 = 100%', () => {
    const r = scoreQuiz(questions, key);
    expect(r).toMatchObject({ total: 20, correct: 20, incorrect: 0, unanswered: 0, percentage: 100 });
  });

  it('scores an all-wrong attempt as 0', () => {
    const r = scoreQuiz(questions, key.map(wrong));
    expect(r).toMatchObject({ correct: 0, incorrect: 20, unanswered: 0, percentage: 0 });
  });

  it('gives unanswered questions no credit', () => {
    const selections = key.map((a, i) => (i < 10 ? a : null));
    const r = scoreQuiz(questions, selections);
    expect(r).toMatchObject({ correct: 10, incorrect: 0, unanswered: 10, percentage: 50 });
    expect(r.outcomes.slice(10).every((o) => o === 'unanswered')).toBe(true);
  });

  it('does not score from the number of answered questions', () => {
    // Every question answered, but only 3 correctly.
    const selections = key.map((a, i) => (i < 3 ? a : wrong(a)));
    const r = scoreQuiz(questions, selections);
    expect(r.correct).toBe(3);
    expect(r.incorrect).toBe(17);
    expect(r.percentage).toBe(15);
  });

  it('treats a missing selection array entry as unanswered', () => {
    const r = scoreQuiz(questions, []);
    expect(r).toMatchObject({ correct: 0, unanswered: 20 });
  });

  it('reports a per-question outcome aligned with the answer key', () => {
    const selections = [key[0]!, wrong(key[1]!), null];
    const r = scoreQuiz(questions.slice(0, 3), selections);
    expect(r.outcomes).toEqual(['correct', 'incorrect', 'unanswered']);
  });
});

describe('performanceBand', () => {
  it.each([
    [100, 'Exam ready'],
    [90, 'Exam ready'],
    [80, 'Strong'],
    [55, 'Getting there'],
    [10, 'Needs review'],
  ])('%i%% → %s', (pct, label) => {
    expect(performanceBand(pct).label).toBe(label);
  });
});
