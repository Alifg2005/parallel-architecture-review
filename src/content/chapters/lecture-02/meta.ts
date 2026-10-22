import type { ChapterMeta } from '../../schema';

export const meta: ChapterMeta = {
  id: 'lecture-02',
  number: 2,
  title: 'MultiCore Processors',
  description:
    'Inside a modern processor: superscalar execution, multiple cores, SIMD units and divergence, then memory latency, bandwidth, caches, prefetching and multi-threading.',
  estimatedMinutes: 30,
  topics: ['Superscalar', 'Multi-core', 'SIMD / AVX', 'Divergence', 'Latency & bandwidth', 'Caches & prefetching'],
  objectives: [
    'Trace how a simple processor executes a compiled instruction stream, and what a superscalar core adds.',
    'Explain "Idea #1" (more, simpler cores) and why an unmodified sequential program does not benefit from it.',
    'Express the same loop with pthreads, with a data-parallel `forall`, and with AVX intrinsics.',
    'Explain "Idea #2" (SIMD), how conditional code is handled with masking, and the cost of divergence.',
    'Distinguish coherent from divergent execution, and instruction-stream coherence from cache coherence.',
    'Define memory latency, bandwidth and stalls, and explain how caches, prefetching and multi-threading help.',
    'Compare superscalar, SIMD, multi-core and multi-threaded execution, including who is responsible for each.',
  ],
};
