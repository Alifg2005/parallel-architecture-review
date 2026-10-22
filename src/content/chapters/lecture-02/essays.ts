import type { EssayQuestion } from '../../schema';

export const essays: EssayQuestion[] = [
  {
    id: 'l02-e01',
    style: 'process',
    prompt: 'Using the sin(x) array example, describe how performance can be improved step by step: a simple core, a superscalar core, multiple cores, and SIMD. Explain what each step requires from the program.',
    keyConcepts: ['One instruction per clock', 'Superscalar needs independent instructions (ILP)', 'Multi-core needs explicit threads / independent iterations', 'SIMD: same instruction on many data elements', 'Amortised fetch/decode'],
    modelAnswer: [
      '**Simple core:** one fetch/decode unit and one ALU execute one instruction per clock. Each array element is processed by a compiled stream of scalar instructions.',
      '**Superscalar core:** it can decode and execute two (or more) instructions per clock from the same thread, but only when they are independent. In the sinx loop body the first instructions form a dependency chain, so there is little ILP to exploit.',
      '**Multi-core (Idea #1):** transistors are spent on more, simpler cores. Two cores at 0.75× each give 1.5× potential, but only if the program exposes parallelism, for example by splitting the array between threads with pthreads or declaring independent iterations with `forall`. The unmodified program runs on one core and is slower.',
      '**SIMD (Idea #2):** one instruction stream drives many ALUs. With AVX, each instruction processes 8 floats, so each outer-loop step handles 8 array elements (`i += 8`). This works because every iteration performs the same operations. Combining both ideas (for example, 16 cores × 8 lanes) processes 128 elements at once.',
    ],
    whyItMatters: 'This progression is the backbone of the lecture. A strong answer links each hardware idea to the property of the program it depends on: ILP, independent iterations, or identical work per element.',
    structure: ['Simple core baseline', 'Superscalar and its ILP requirement', 'Multi-core and the need to express parallelism', 'SIMD and identical work per element', 'Combined effect'],
  },
  {
    id: 'l02-e02',
    style: 'compare-contrast',
    prompt: 'Compare superscalar, SIMD, multi-core and multi-threaded execution. For each, state what it is and who is responsible for mapping the parallelism.',
    keyConcepts: ['Superscalar: ILP, hardware/compiler', 'SIMD: vector instructions, compiler or programmer', 'Multi-core: independent instruction streams, programmer threads', 'Multi-threading: interleaved contexts hide stalls', 'More threads than cores'],
    modelAnswer: [
      '**Superscalar** executes multiple instructions per clock from one thread by exploiting ILP. Mapping is usually not the programmer\'s job, because hardware or the compiler detects independent instructions (manual loop unrolling can help).',
      '**SIMD** executes the same instruction on multiple data elements in vector registers, amortising fetch/decode across ALUs. Compilers can vectorise simple loops, but in practice the programmer often uses intrinsics or a data-parallel language (ISPC, CUDA).',
      '**Multi-core** places several mostly independent cores on a chip, each running its own instruction stream. The programmer must define independent threads (pthreads, OpenMP `#pragma`, ISPC tasks).',
      '**Multi-threaded execution** keeps several execution contexts on one core and switches between threads when one stalls on a long-latency operation, which hides stalls. The programmer must create **more threads than cores** for this to help.',
    ],
    whyItMatters: 'The lecture\'s summary table is a likely exam source. The "who is responsible" column is often what separates full marks from partial marks.',
  },
  {
    id: 'l02-e03',
    style: 'define-explain',
    prompt: 'Explain how a SIMD processor executes code containing an if/else branch. What is the performance cost, and what is the worst case on an 8-wide unit?',
    keyConcepts: ['Condition evaluated per lane', 'Masking / discarding results', 'Both paths executed', 'Not all ALUs do useful work', 'Worst case 1/8 of peak', 'Full speed after the branch'],
    modelAnswer: [
      'All lanes share one instruction stream, so they cannot jump to different code. Each lane evaluates the condition, producing a mask (for example T T F T F F F F).',
      'The unit then executes the **if** block for all lanes but **discards (masks) the results** in lanes where the condition was false. Next it executes the **else** block and masks the lanes where the condition was true. After the branch, all lanes continue together at full performance.',
      'During the branch, some ALUs do no useful work, so throughput drops. In the worst case, on an 8-wide unit, only one lane does useful work at a time, giving **1/8 of peak performance**.',
    ],
    whyItMatters: 'Divergence is the main limitation of SIMD and GPUs. Understanding masking explains why data-parallel code should avoid lane-dependent branches.',
  },
  {
    id: 'l02-e04',
    style: 'compare-contrast',
    prompt: 'Distinguish coherent execution from divergent execution. Why is coherence essential for SIMD but not for multi-core parallelism? How does it differ from cache coherence?',
    keyConcepts: ['Same instruction sequence for all elements', 'Divergence = lack of coherence', 'SIMD lanes share fetch/decode', 'Each core has its own fetch/decode', 'Cache coherence is about memory consistency'],
    modelAnswer: [
      '**Coherent execution** (instruction stream coherence) means the same instruction sequence applies to all elements being processed at the same time. **Divergent execution** is the lack of it: different elements need different instructions.',
      'SIMD lanes share a single fetch/decode unit, so they can only be fully used when all lanes need the same instruction. Coherence is therefore necessary for efficient SIMD.',
      'Cores each have their own fetch/decode unit, so each core can follow a completely different instruction stream. Coherence is not needed for efficient multi-core parallelism.',
      '**Cache coherence** is unrelated: it concerns keeping copies of the same memory location consistent across the caches of different cores.',
    ],
    whyItMatters: 'The lecture explicitly warns against confusing the two "coherence" terms, which makes this a classic trap question.',
  },
  {
    id: 'l02-e05',
    style: 'define-explain',
    prompt: 'Define memory latency, memory bandwidth and a processor stall. Explain how caches and prefetching each address stalls.',
    keyConcepts: ['Latency: time to service a request', 'Bandwidth: rate of data delivery', 'Stall: dependency on a previous instruction', 'Caches reduce latency', 'Prefetching hides latency', 'Wrong prefetch hurts'],
    modelAnswer: [
      '**Memory latency** is the time for a load or store request to be serviced by the memory system (for example, 100 cycles). **Memory bandwidth** is the rate at which memory can supply data (for example, 20 GB/s).',
      'A **stall** occurs when the processor cannot execute the next instruction because it depends on a previous one, for example an `add` that needs two values still being loaded. Since memory accesses take hundreds of cycles, they are a major cause of stalls.',
      '**Caches** keep recently used data close to the core (L1, L2, L3), so accesses that hit are much faster. Caches **reduce** stall length, and they also provide high bandwidth to the CPU.',
      '**Prefetching** predicts which data will be needed soon and loads it into the cache in advance, so later loads hit. It **hides** latency rather than reducing it. A wrong prediction wastes bandwidth and pollutes the cache, which can lower performance.',
    ],
    whyItMatters: 'The latency/bandwidth distinction is used throughout the course (and in MPI performance later). "Reduce" versus "hide" is a precise distinction examiners like.',
  },
  {
    id: 'l02-e06',
    style: 'discuss',
    prompt: 'Two simpler cores, each 0.75× as fast as one complex core, offer a potential 1.5× speedup, yet an unmodified program becomes slower. Discuss what this shows about multi-core processors and software.',
    keyConcepts: ['2 × 0.75 = 1.5 potential', 'Single-threaded program uses one core', 'Speedup of 0.75', 'Need to express parallelism', 'pthreads / forall'],
    modelAnswer: [
      'The potential comes from running two instruction streams at once: 2 × 0.75 = 1.5. A program compiled from sequential C, however, is a **single thread**, so it runs on only one of the simpler cores and achieves 0.75× of the original speed.',
      'Hardware parallelism is therefore useless unless software exposes parallel work. The programmer must divide the work, for example by creating a pthread to process half of the array, or by using a language construct such as `forall` that declares iterations independent so the compiler can generate threads.',
      'This is the "end of the free lunch": since the multi-core shift, programs no longer get faster automatically. They must be written to be parallel.',
    ],
    whyItMatters: 'It connects the hardware story of Lectures 1 and 2 to the programming lectures (pthreads, OpenMP).',
  },
  {
    id: 'l02-e07',
    style: 'trace-code',
    prompt: 'Interpret the AVX version of sinx. Why does the loop use `i += 8`, and what do `_mm256_load_ps`, `_mm256_mul_ps`, `_mm256_broadcast_ss` and `_mm256_store_ps` do?',
    code: `for (int i = 0; i < N; i += 8) {
   __m256 origx = _mm256_load_ps(&x[i]);
   __m256 numer = _mm256_mul_ps(origx, _mm256_mul_ps(origx, origx));
   __m256 denom = _mm256_broadcast_ss(&three_fact);
   /* ... */
   _mm256_store_ps(&result[i], value);
}`,
    keyConcepts: ['__m256 = 256-bit = 8 floats', 'One instruction, 8 lanes', 'Load/store 8 consecutive floats', 'Broadcast a scalar to all lanes', 'Explicit SIMD via intrinsics'],
    modelAnswer: [
      'A `__m256` value is a 256-bit vector register holding **8 single-precision floats**. Each iteration therefore processes 8 array elements, and the loop advances by 8.',
      '`_mm256_load_ps(&x[i])` loads `x[i]` … `x[i+7]` into one vector. `_mm256_mul_ps` multiplies two vectors lane by lane, so `numer` gets x³ for all 8 elements with one instruction each step.',
      '`_mm256_broadcast_ss(&three_fact)` copies the scalar 6 (3!) into all 8 lanes so that it can be used in vector arithmetic. `_mm256_store_ps(&result[i], value)` writes the 8 results back.',
      'This is **explicit SIMD**: the programmer requests vector instructions through intrinsics, and the compiled binary contains instructions such as `vmulps` and `vstoreps`.',
    ],
    whyItMatters: 'Reading vector code shows that you understand SIMD lanes concretely, not just the acronym.',
  },
];
