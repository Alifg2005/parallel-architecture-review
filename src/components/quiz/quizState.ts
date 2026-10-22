import type { QuizResult, Selection } from '../../lib/quiz';

export type QuizPhase = 'answering' | 'summary' | 'submitted';

export interface QuizState {
  phase: QuizPhase;
  current: number;
  selections: Selection[];
  result: QuizResult | null;
}

export type QuizAction =
  | { type: 'select'; question: number; option: number }
  | { type: 'goto'; question: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'openSummary' }
  | { type: 'closeSummary' }
  | { type: 'submit'; result: QuizResult }
  | { type: 'retry' };

export function initialQuizState(total: number): QuizState {
  return { phase: 'answering', current: 0, selections: Array<Selection>(total).fill(null), result: null };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  const last = state.selections.length - 1;
  switch (action.type) {
    case 'select': {
      if (state.phase === 'submitted') return state; // answers are locked after submission
      const selections = state.selections.slice();
      selections[action.question] = action.option;
      return { ...state, selections };
    }
    case 'goto':
      if (state.phase === 'submitted') return state;
      return { ...state, phase: 'answering', current: Math.min(Math.max(action.question, 0), last) };
    case 'next':
      return state.phase === 'answering' ? { ...state, current: Math.min(state.current + 1, last) } : state;
    case 'prev':
      return state.phase === 'answering' ? { ...state, current: Math.max(state.current - 1, 0) } : state;
    case 'openSummary':
      return state.phase === 'answering' ? { ...state, phase: 'summary' } : state;
    case 'closeSummary':
      return state.phase === 'summary' ? { ...state, phase: 'answering' } : state;
    case 'submit':
      // Only the first submission counts; repeated clicks are ignored.
      return state.phase === 'submitted' ? state : { ...state, phase: 'submitted', result: action.result };
    case 'retry':
      return initialQuizState(state.selections.length);
  }
}
