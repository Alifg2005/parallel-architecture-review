import type { ChapterMeta } from '../../schema';

export const meta: ChapterMeta = {
  id: 'lecture-05',
  number: 5,
  title: 'PThreads',
  description:
    'Parallel programming in C with POSIX threads: spotting parallelisable code, creating and joining threads, race conditions, mutexes and critical sections, deadlock, and passing arguments to threads.',
  estimatedMinutes: 35,
  topics: ['pthread_create', 'pthread_join', 'Race conditions', 'Mutex', 'Deadlock', 'Passing arguments'],
  objectives: [
    'Recognise loops whose iterations are independent and can therefore be parallelised.',
    'Explain the program → process → thread hierarchy and why threads suit parallel work.',
    'Compare Pthreads and OpenMP and choose between them.',
    'Use `pthread_create` and `pthread_join` correctly, and predict the output when the main thread does not wait.',
    'Explain race conditions and protect a critical section with a mutex (init → lock → unlock → destroy).',
    'Recognise the deadlock caused by a missing unlock, and apply mutex best practices.',
    'Pass values to a thread through its `void*` argument.',
  ],
};
