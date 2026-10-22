#!/usr/bin/env node
/**
 * Scaffold a new lecture folder: npm run new-chapter -- <number> "<Title>"
 *
 * This only creates the file structure with the correct ids and types. The CONTENT (review,
 * essays, 20 quiz questions) must be written by the coding agent from the lecture source,
 * following AGENTS.md. The new chapter stays invalid (and `npm test` fails) until the quiz
 * has exactly 20 validated questions, which is intentional.
 *
 * It refuses to overwrite an existing chapter.
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const chaptersDir = join(root, 'src', 'content', 'chapters');

const [rawNumber, ...titleParts] = process.argv.slice(2);
const number = Number(rawNumber);
const title = titleParts.join(' ').trim();

if (!Number.isInteger(number) || number < 1 || number > 99 || !title) {
  console.error('Usage: npm run new-chapter -- <lecture number 1-99> "<Lecture title>"');
  process.exit(1);
}

const nn = String(number).padStart(2, '0');
const id = `lecture-${nn}`;
const dir = join(chaptersDir, id);

const existing = existsSync(chaptersDir) ? readdirSync(chaptersDir) : [];
if (existing.includes(id) || existsSync(dir)) {
  console.error(`✖ ${id} already exists. Refusing to overwrite existing content (see AGENTS.md §16 step 4).`);
  process.exit(1);
}

const q = (s) => JSON.stringify(s);
const files = {
  'meta.ts': `import type { ChapterMeta } from '../../schema';

export const meta: ChapterMeta = {
  id: '${id}',
  number: ${number},
  title: ${q(title)},
  description: 'TODO: one or two sentences summarising the lecture.',
  estimatedMinutes: 25,
  topics: [],
  objectives: [
    // TODO: at least 3 learning objectives
  ],
};
`,
  'review.ts': `import type { ReviewSection } from '../../schema';

// TODO: at least 3 sections. Block types: paragraph, list, definitions, table, code, callout, formula.
export const sections: ReviewSection[] = [];

// TODO: at least 3 exam points.
export const examPoints: string[] = [];

// TODO: at least 5 one-line revision facts.
export const quickRevision: string[] = [];
`,
  'essays.ts': `import type { EssayQuestion } from '../../schema';

// TODO: 5–10 essay questions with ids l${nn}-e01, l${nn}-e02, …
export const essays: EssayQuestion[] = [];
`,
  'quiz.ts': `import type { QuizQuestion } from '../../schema';

// TODO: EXACTLY 20 questions with ids l${nn}-q01 … l${nn}-q20.
// Four distinct options each, one correct \`answer\` index (0–3), an explanation and a topic.
// Balance the correct letters (no letter correct more than 8 times).
export const quiz: QuizQuestion[] = [];
`,
  'index.ts': `import type { Chapter } from '../../schema';
import { meta } from './meta';
import { examPoints, quickRevision, sections } from './review';
import { essays } from './essays';
import { quiz } from './quiz';

export const chapter: Chapter = { meta, sections, examPoints, quickRevision, essays, quiz };
`,
};

mkdirSync(dir, { recursive: true });
for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content, 'utf8');

console.log(`✔ Created src/content/chapters/${id}/ (meta, review, essays, quiz, index).`);
console.log(`  Next: write the content, add lecture ${number} to plannedLectures in src/content/course.ts if missing,`);
console.log('  then run: npm run typecheck && npm test && npm run build && npm run verify:build');
