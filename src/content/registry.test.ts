import { describe, expect, it } from 'vitest';
import { buildRegistry, chapters, getAdjacentChapters, getChapter, getCourseScope } from './registry';
import { chapter as lecture01 } from './chapters/lecture-01';
import type { Chapter } from './schema';

function asLecture(n: number): Chapter {
  const c = structuredClone(lecture01);
  const nn = String(n).padStart(2, '0');
  c.meta.id = `lecture-${nn}`;
  c.meta.number = n;
  return c;
}

describe('buildRegistry', () => {
  it('discovers chapters from module paths and sorts them by number', () => {
    const { chapters: found, errors } = buildRegistry({
      './chapters/lecture-07/index.ts': { chapter: asLecture(7) },
      './chapters/lecture-03/index.ts': { chapter: asLecture(3) },
    });
    expect(errors).toEqual([]);
    expect(found.map((c) => c.meta.id)).toEqual(['lecture-03', 'lecture-07']);
  });

  it('excludes invalid chapters and reports why', () => {
    const broken = asLecture(8);
    broken.quiz = broken.quiz.slice(0, 5);
    const { chapters: found, errors } = buildRegistry({
      './chapters/lecture-08/index.ts': { chapter: broken },
      './chapters/lecture-09/index.ts': { chapter: asLecture(9) },
    });
    expect(found.map((c) => c.meta.id)).toEqual(['lecture-09']);
    expect(errors.join()).toMatch(/lecture-08.*exactly 20/);
  });

  it('reports modules that do not export a chapter', () => {
    const { chapters: found, errors } = buildRegistry({ './chapters/lecture-10/index.ts': {} });
    expect(found).toHaveLength(0);
    expect(errors[0]).toMatch(/lecture-10/);
  });

  it('rejects a second chapter with the same lecture number', () => {
    const a = asLecture(11);
    const b = asLecture(11);
    const { chapters: found, errors } = buildRegistry({
      './chapters/lecture-11/index.ts': { chapter: a },
      './chapters/lecture-11b/index.ts': { chapter: b },
    });
    expect(found).toHaveLength(1);
    expect(errors.join()).toMatch(/duplicate/);
  });
});

describe('registry lookups', () => {
  it('finds existing chapters and returns undefined for missing ones', () => {
    expect(getChapter('lecture-01')?.meta.title).toBe('Why Parallel Computing?');
    expect(getChapter('lecture-99')).toBeUndefined();
    expect(getChapter(undefined)).toBeUndefined();
  });

  it('returns neighbours for navigation', () => {
    expect(getAdjacentChapters('lecture-01').prev).toBeUndefined();
    expect(getAdjacentChapters('lecture-01').next?.meta.id).toBe('lecture-02');
    const last = chapters.at(-1)!;
    expect(getAdjacentChapters(last.meta.id).next).toBeUndefined();
    expect(getAdjacentChapters('nope')).toEqual({});
  });

  it('merges the planned course scope with available chapters', () => {
    const scope = getCourseScope();
    expect(scope.slice(0, 6).map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(scope.slice(0, 6).every((s) => s.chapter)).toBe(true);
    // Every available chapter appears in the scope, even if it is not in plannedLectures.
    for (const c of chapters) expect(scope.some((s) => s.chapter === c)).toBe(true);
  });
});
