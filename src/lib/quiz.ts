import type { QuizQuestion } from '../content/schema';

/** A student's answer: the selected option index, or null when unanswered. */
export type Selection = number | null;

export type QuestionOutcome = 'correct' | 'incorrect' | 'unanswered';

export interface QuizResult {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  /** Rounded to the nearest whole percent of `total` (unanswered questions earn nothing). */
  percentage: number;
  outcomes: QuestionOutcome[];
}

/**
 * Scoring rule: one point per question whose selection equals the stored answer key.
 * Unanswered questions earn nothing. The score is never derived from how many were answered.
 */
export function scoreQuiz(questions: readonly QuizQuestion[], selections: readonly Selection[]): QuizResult {
  const outcomes: QuestionOutcome[] = questions.map((q, i) => {
    const s = selections[i];
    if (s === null || s === undefined) return 'unanswered';
    return s === q.answer ? 'correct' : 'incorrect';
  });
  const correct = outcomes.filter((o) => o === 'correct').length;
  const unanswered = outcomes.filter((o) => o === 'unanswered').length;
  const total = questions.length;
  return {
    total,
    correct,
    incorrect: total - correct - unanswered,
    unanswered,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    outcomes,
  };
}

export interface PerformanceBand {
  label: string;
  message: string;
  tone: 'good' | 'warm' | 'bad';
}

export function performanceBand(percentage: number): PerformanceBand {
  if (percentage >= 90)
    return {
      label: 'Exam ready',
      message: 'Excellent command of this lecture. Skim the explanations for anything you guessed.',
      tone: 'good',
    };
  if (percentage >= 75)
    return {
      label: 'Strong',
      message: 'Solid understanding. Review what you missed and the exam points on the review page.',
      tone: 'good',
    };
  if (percentage >= 50)
    return {
      label: 'Getting there',
      message: 'The core ideas are forming. Re-read the sections behind your incorrect answers, then retry.',
      tone: 'warm',
    };
  return {
    label: 'Needs review',
    message: 'Work through the lecture review first, then come back and retry the quiz.',
    tone: 'bad',
  };
}
