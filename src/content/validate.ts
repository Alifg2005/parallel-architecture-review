import type { Chapter } from './schema';

export const QUIZ_LENGTH = 20;
export const MAX_SAME_LETTER = 8;

/** Returns a list of human-readable problems. An empty list means the chapter is valid. */
export function validateChapter(chapter: Chapter, folderName?: string): string[] {
  const errors: string[] = [];
  const { meta } = chapter;
  const where = meta?.id ?? folderName ?? 'unknown chapter';
  const err = (msg: string) => errors.push(`[${where}] ${msg}`);

  // Meta
  if (!/^lecture-\d{2}$/.test(meta.id)) err(`id "${meta.id}" must look like lecture-NN`);
  if (Number(meta.id.slice(-2)) !== meta.number) err(`number ${meta.number} does not match id ${meta.id}`);
  if (folderName && folderName !== meta.id) err(`folder "${folderName}" must equal id "${meta.id}"`);
  if (!meta.title.trim()) err('title is empty');
  if (!meta.description.trim()) err('description is empty');
  if (meta.objectives.length < 3) err('needs at least 3 objectives');
  if (!(meta.estimatedMinutes > 0)) err('estimatedMinutes must be positive');

  // Review
  if (chapter.sections.length < 3) err('needs at least 3 review sections');
  const sectionIds = new Set<string>();
  for (const s of chapter.sections) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id)) err(`section id "${s.id}" must be kebab-case`);
    if (sectionIds.has(s.id)) err(`duplicate section id "${s.id}"`);
    sectionIds.add(s.id);
    if (!s.title.trim()) err(`section "${s.id}" has no title`);
    if (s.blocks.length === 0) err(`section "${s.id}" has no blocks`);
    for (const b of s.blocks) {
      if (b.type === 'table' && b.rows.some((r) => r.length !== b.columns.length))
        err(`table in "${s.id}" has a row with the wrong number of cells`);
    }
  }
  if (chapter.examPoints.length < 3) err('needs at least 3 exam points');
  if (chapter.quickRevision.length < 5) err('needs at least 5 quick-revision points');

  // Essays
  if (chapter.essays.length < 5 || chapter.essays.length > 10)
    err(`needs 5–10 essay questions (has ${chapter.essays.length})`);
  const essayIds = new Set<string>();
  for (const e of chapter.essays) {
    if (essayIds.has(e.id)) err(`duplicate essay id "${e.id}"`);
    essayIds.add(e.id);
    if (!e.prompt.trim()) err(`essay ${e.id} has no prompt`);
    if (e.keyConcepts.length < 3) err(`essay ${e.id} needs at least 3 key concepts`);
    if (e.modelAnswer.length === 0 || e.modelAnswer.some((p) => !p.trim()))
      err(`essay ${e.id} needs a model answer`);
    if (!e.whyItMatters.trim()) err(`essay ${e.id} needs whyItMatters`);
  }

  // Quiz
  if (chapter.quiz.length !== QUIZ_LENGTH)
    err(`quiz must have exactly ${QUIZ_LENGTH} questions (has ${chapter.quiz.length})`);
  const qIds = new Set<string>();
  const prompts = new Set<string>();
  const letterCounts = [0, 0, 0, 0];
  for (const q of chapter.quiz) {
    if (qIds.has(q.id)) err(`duplicate question id "${q.id}"`);
    qIds.add(q.id);
    const normalized = q.prompt.trim().toLowerCase();
    if (!normalized) err(`question ${q.id} has no prompt`);
    if (prompts.has(normalized)) err(`question ${q.id} duplicates another prompt`);
    prompts.add(normalized);
    if (q.options.length !== 4) err(`question ${q.id} must have exactly 4 options`);
    if (q.options.some((o) => !o.trim())) err(`question ${q.id} has an empty option`);
    if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== q.options.length)
      err(`question ${q.id} has duplicate options`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3)
      err(`question ${q.id} has an invalid answer index ${String(q.answer)}`);
    else letterCounts[q.answer] = (letterCounts[q.answer] ?? 0) + 1;
    if (!q.explanation.trim()) err(`question ${q.id} has no explanation`);
    if (!q.topic.trim()) err(`question ${q.id} has no topic`);
  }
  letterCounts.forEach((n, i) => {
    if (n > MAX_SAME_LETTER) err(`option ${'ABCD'[i]} is correct ${n} times; max is ${MAX_SAME_LETTER}`);
  });

  return errors;
}
