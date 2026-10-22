import type { ChapterMeta } from '../../schema';

export const meta: ChapterMeta = {
  id: 'lecture-06',
  number: 6,
  title: 'Parallel Programming Using OpenMP',
  description:
    'OpenMP as a high-level alternative to Pthreads: directives, runtime routines, data-sharing clauses, critical/atomic/barrier/locks, sections, single vs master, the fork–join model, thread pools and nested parallelism.',
  estimatedMinutes: 40,
  topics: ['#pragma omp parallel', 'Data-sharing clauses', 'critical / atomic / locks', 'single vs master', 'Fork–join', 'Nested parallelism'],
  objectives: [
    'Describe what OpenMP is, its three components, and what it will and will not do for you.',
    'Explain why OpenMP is easier than Pthreads, and compile and verify an OpenMP program.',
    'Use the shared, private, firstprivate, lastprivate and reduction clauses correctly, and predict their results.',
    'Choose between critical, atomic, barrier and explicit locks for synchronisation.',
    'Use sections, single and master, and control parallelism with `if` and `num_threads`.',
    'Explain the fork–join execution model, thread pools and context-switch overhead.',
    'Explain nested parallelism, how to enable it, and when it helps or hurts.',
  ],
};
