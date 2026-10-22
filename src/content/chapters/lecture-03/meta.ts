import type { ChapterMeta } from '../../schema';

export const meta: ChapterMeta = {
  id: 'lecture-03',
  number: 3,
  title: 'Introduction to Parallel Computer Architecture and Programming',
  description:
    'Why we build parallel systems, the goals and types of parallelism, multi-core vs multiprocessor and shared vs distributed memory, and how to measure speedup, efficiency, scalability and FLOPS.',
  estimatedMinutes: 30,
  topics: ['Free lunch is over', 'Types of parallelism', 'GPUs', 'Shared vs distributed memory', 'Speedup & efficiency', 'FLOPS'],
  objectives: [
    'Explain the physical chain from smaller transistors to unreliable processors, and the role of Moore\'s Law.',
    'Explain "the end of the free lunch" and its consequences for software.',
    'State the goals of parallel computers and the ways to create task-level parallelism.',
    'Classify parallelism (instruction, data, task; bit / instruction / task granularity) and match techniques to each.',
    'Compare multi-core and multiprocessor systems, and shared, distributed and hybrid memory architectures, with their challenges.',
    'Calculate speedup, efficiency and FLOPS, and explain strong scaling.',
  ],
};
