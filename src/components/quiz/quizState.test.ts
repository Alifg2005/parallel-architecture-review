import { describe, expect, it } from 'vitest';
import { initialQuizState, quizReducer, type QuizState } from './quizState';
import type { QuizResult } from '../../lib/quiz';

const fakeResult = (correct: number): QuizResult => ({
  total: 20,
  correct,
  incorrect: 20 - correct,
  unanswered: 0,
  percentage: correct * 5,
  outcomes: [],
});

describe('quizReducer', () => {
  it('starts on question 1 with nothing answered', () => {
    const s = initialQuizState(20);
    expect(s).toMatchObject({ phase: 'answering', current: 0, result: null });
    expect(s.selections.every((x) => x === null)).toBe(true);
  });

  it('keeps navigation within bounds', () => {
    let s = initialQuizState(20);
    s = quizReducer(s, { type: 'prev' });
    expect(s.current).toBe(0);
    for (let i = 0; i < 30; i++) s = quizReducer(s, { type: 'next' });
    expect(s.current).toBe(19);
    s = quizReducer(s, { type: 'goto', question: 7 });
    expect(s.current).toBe(7);
    s = quizReducer(s, { type: 'goto', question: 99 });
    expect(s.current).toBe(19);
  });

  it('allows changing an answer before submission', () => {
    let s = initialQuizState(20);
    s = quizReducer(s, { type: 'select', question: 2, option: 1 });
    s = quizReducer(s, { type: 'select', question: 2, option: 3 });
    expect(s.selections[2]).toBe(3);
  });

  it('opens and closes the summary, and goto from the summary returns to answering', () => {
    let s = initialQuizState(20);
    s = quizReducer(s, { type: 'openSummary' });
    expect(s.phase).toBe('summary');
    s = quizReducer(s, { type: 'goto', question: 4 });
    expect(s).toMatchObject({ phase: 'answering', current: 4 });
  });

  it('ignores a second submission and locks answers afterwards', () => {
    let s: QuizState = quizReducer(initialQuizState(20), { type: 'submit', result: fakeResult(12) });
    s = quizReducer(s, { type: 'submit', result: fakeResult(20) });
    expect(s.result?.correct).toBe(12);
    const before = s.selections;
    s = quizReducer(s, { type: 'select', question: 0, option: 2 });
    expect(s.selections).toBe(before);
  });

  it('retry resets everything', () => {
    let s = quizReducer(initialQuizState(20), { type: 'select', question: 0, option: 1 });
    s = quizReducer(s, { type: 'submit', result: fakeResult(1) });
    s = quizReducer(s, { type: 'retry' });
    expect(s).toEqual(initialQuizState(20));
  });
});
