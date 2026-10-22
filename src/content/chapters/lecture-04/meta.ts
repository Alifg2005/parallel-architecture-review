import type { ChapterMeta } from '../../schema';

export const meta: ChapterMeta = {
  id: 'lecture-04',
  number: 4,
  title: 'DAGs, Coarse and Fine, Von Neumann Architecture, SISD, SIMD, MISD, MIMD',
  description:
    'The Von Neumann model and its bottleneck, concurrency vs parallelism, data- vs task-parallel problems, benchmarking and serial optimisation, granularity (coarse vs fine), and the DAG execution model.',
  estimatedMinutes: 30,
  topics: ['Von Neumann', "Flynn's taxonomy", 'Concurrency vs parallelism', 'Benchmarking', 'Granularity', 'DAG model'],
  objectives: [
    'Describe the fetch–decode–execute cycle, the Von Neumann bottleneck, and how modern CPUs add parallelism to the model.',
    "Classify architectures with Flynn's taxonomy (SISD, SIMD, MISD, MIMD).",
    'Distinguish concurrency (design) from parallelism (run time) and explain P ⊂ C.',
    'Define data-parallel and task-parallel problems and match them to GPUs or CPUs.',
    'Explain why Big-O alone is not enough, how to benchmark code, and how to optimise serial code with a profiling cycle.',
    'Compute granularity G = T_comp / T_comm and compare coarse- and fine-grained parallelism.',
    'Use a DAG to identify which tasks of an algorithm such as merge sort can run in parallel.',
  ],
  sourceNote:
    "Lecture 4 names SISD, SIMD, MISD and MIMD and points to an external video for the details. The Flynn's taxonomy section below is marked **Background**, because it is standard course knowledge rather than content from the slides.",
};
