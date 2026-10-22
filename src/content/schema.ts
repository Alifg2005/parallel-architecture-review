/**
 * Content schema shared by every lecture. See AGENTS.md §6 for the validation rules.
 * Strings may use the RichText inline syntax: **bold** and `code`.
 */

export type ChapterId = `lecture-${string}`;

export interface ChapterMeta {
  /** Stable id, `lecture-NN`. Must equal the folder name. */
  id: ChapterId;
  /** Lecture number as taught in the course. */
  number: number;
  title: string;
  /** One or two sentences shown on the home page and lecture header. */
  description: string;
  /** Realistic time to read the review page carefully, in minutes. */
  estimatedMinutes: number;
  /** Short topic labels shown as chips. */
  topics: string[];
  /** What the student should be able to do after studying. */
  objectives: string[];
  /** Optional honest note about the source material (e.g. a topic only referenced, not taught). */
  sourceNote?: string;
}

export type CalloutTone = 'exam' | 'tip' | 'warning' | 'note' | 'example';
export type CodeLanguage = 'c' | 'asm' | 'text' | 'shell';

export type ReviewBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'definitions'; items: { term: string; definition: string }[] }
  | { type: 'table'; caption?: string; columns: string[]; rows: string[][] }
  | {
      type: 'code';
      language: CodeLanguage;
      title?: string;
      code: string;
      /** Bullet points walking through the code. */
      explanation?: string[];
    }
  | { type: 'callout'; tone: CalloutTone; title?: string; text?: string; items?: string[] }
  | { type: 'formula'; label?: string; expression: string; note?: string };

export interface ReviewSection {
  /** Kebab-case anchor id, unique within the chapter. */
  id: string;
  title: string;
  /** Optional one-line lead under the heading. */
  summary?: string;
  blocks: ReviewBlock[];
}

export type EssayStyle =
  | 'define-explain'
  | 'compare-contrast'
  | 'process'
  | 'advantages-limitations'
  | 'discuss'
  | 'trace-code';

export interface EssayQuestion {
  id: string;
  style: EssayStyle;
  prompt: string;
  /** Concepts a marker expects to see. */
  keyConcepts: string[];
  /** Model answer as paragraphs (or point-form lines). */
  modelAnswer: string[];
  /** Why these concepts matter / what the question is really testing. */
  whyItMatters: string;
  /** Suggested outline for writing the answer. */
  structure?: string[];
  /** Optional code the question refers to. */
  code?: string;
}

export type AnswerIndex = 0 | 1 | 2 | 3;

export interface QuizQuestion {
  id: string;
  prompt: string;
  /** Optional code snippet shown with the question. */
  code?: string;
  options: [string, string, string, string];
  /** Index into `options` of the single correct answer. */
  answer: AnswerIndex;
  explanation: string;
  /** Short topic tag used in the results breakdown. */
  topic: string;
}

export interface Chapter {
  meta: ChapterMeta;
  sections: ReviewSection[];
  examPoints: string[];
  quickRevision: string[];
  essays: EssayQuestion[];
  quiz: QuizQuestion[];
}

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const ESSAY_STYLE_LABELS: Record<EssayStyle, string> = {
  'define-explain': 'Define & explain',
  'compare-contrast': 'Compare & contrast',
  process: 'Describe a process',
  'advantages-limitations': 'Advantages & limitations',
  discuss: 'Discuss',
  'trace-code': 'Trace / interpret code',
};
