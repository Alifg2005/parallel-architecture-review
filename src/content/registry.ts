import type { Chapter } from './schema';
import { plannedLectures, type PlannedLecture } from './course';
import { validateChapter } from './validate';

interface ChapterModule {
  chapter?: Chapter;
}

export interface RegistryResult {
  chapters: Chapter[];
  errors: string[];
}

/**
 * Builds the registry from a map of `./chapters/<folder>/index.ts` modules.
 * Invalid chapters are excluded (and reported) so one broken lecture never takes the site down.
 */
export function buildRegistry(modules: Record<string, ChapterModule>): RegistryResult {
  const chapters: Chapter[] = [];
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenNumbers = new Set<number>();

  for (const [path, mod] of Object.entries(modules)) {
    const folder = path.split('/').at(-2);
    const chapter = mod.chapter;
    if (!chapter) {
      errors.push(`[${folder}] index.ts does not export \`chapter\``);
      continue;
    }
    const problems = validateChapter(chapter, folder);
    if (seenIds.has(chapter.meta.id)) problems.push(`[${chapter.meta.id}] duplicate chapter id`);
    if (seenNumbers.has(chapter.meta.number))
      problems.push(`[${chapter.meta.id}] duplicate lecture number ${chapter.meta.number}`);
    if (problems.length) {
      errors.push(...problems);
      continue;
    }
    seenIds.add(chapter.meta.id);
    seenNumbers.add(chapter.meta.number);
    chapters.push(chapter);
  }

  chapters.sort((a, b) => a.meta.number - b.meta.number);
  return { chapters, errors };
}

const registry = buildRegistry(
  import.meta.glob<ChapterModule>('./chapters/*/index.ts', { eager: true }),
);

if (registry.errors.length && import.meta.env.DEV) {
  console.error('Chapter validation failed:\n' + registry.errors.join('\n'));
}

export const chapters: readonly Chapter[] = registry.chapters;
export const registryErrors: readonly string[] = registry.errors;

export function getChapter(id: string | undefined): Chapter | undefined {
  return chapters.find((c) => c.meta.id === id);
}

export function getAdjacentChapters(id: string): { prev?: Chapter; next?: Chapter } {
  const i = chapters.findIndex((c) => c.meta.id === id);
  if (i === -1) return {};
  return { prev: chapters[i - 1], next: chapters[i + 1] };
}

export interface ScopeEntry extends PlannedLecture {
  chapter?: Chapter;
}

/**
 * Planned lectures merged with available chapters. Chapters not in the planned list are still
 * included so a newly added lecture is never hidden.
 */
export function getCourseScope(): ScopeEntry[] {
  const entries: ScopeEntry[] = plannedLectures.map((p) => ({
    ...p,
    chapter: chapters.find((c) => c.meta.number === p.number),
  }));
  for (const c of chapters) {
    if (!entries.some((e) => e.number === c.meta.number)) {
      entries.push({ number: c.meta.number, title: c.meta.title, chapter: c });
    }
  }
  return entries.sort((a, b) => a.number - b.number);
}
