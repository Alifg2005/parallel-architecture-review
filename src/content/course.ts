/**
 * Course-level facts. This is the only shared file that changes when a lecture beyond the planned
 * list is added (append to `plannedLectures`). See AGENTS.md §11.
 */

export const course = {
  owner: 'ALi Feras Alghanim',
  name: 'Parallel Computer Architecture',
  tagline:
    'Lecture reviews, essay practice and 20-question quizzes for every available lecture, so you can revise the ideas, rehearse written answers and check yourself before the exam.',
} as const;

export const midterm = {
  week: 'Week 9',
  day: 'To be announced',
  duration: 'To be announced',
  lectures: [1, 2, 3, 4, 5, 6],
} as const;

export interface PlannedLecture {
  number: number;
  title: string;
}

/** Intended course scope. Availability is derived from the chapter registry, never set here. */
export const plannedLectures: PlannedLecture[] = [
  { number: 1, title: 'Why Parallel Computing?' },
  { number: 2, title: 'MultiCore Processors' },
  { number: 3, title: 'Introduction to Parallel Computer Architecture and Programming' },
  { number: 4, title: 'DAGs, Coarse and Fine, Von Neumann Architecture, SISD, SIMD, MISD, MIMD' },
  { number: 5, title: 'PThreads' },
  { number: 6, title: 'Parallel Programming Using OpenMP' },
];
