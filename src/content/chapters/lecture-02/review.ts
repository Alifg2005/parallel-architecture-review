import type { ReviewSection } from '../../schema';

const SINX = `void sinx(int N, int terms, float* x, float* result)
{
   for (int i = 0; i < N; i++)
   {
      float value = x[i];
      float numer = x[i] * x[i] * x[i];
      int denom = 6;   // 3!
      int sign = -1;

      for (int j = 1; j <= terms; j++)
      {
         value += sign * numer / denom;
         numer *= x[i] * x[i];
         denom *= (2*j+2) * (2*j+3);
         sign *= -1;
      }
      result[i] = value;
   }
}`;

export const sections: ReviewSection[] = [
  {
    id: 'running-example',
    title: 'The running example: sin(x) for an array',
    summary: 'One small program is reused throughout the lecture to show each kind of parallel hardware.',
    blocks: [
      {
        type: 'paragraph',
        text: 'The program computes sin(x) with a Taylor expansion, **sin(x) = x − x³/3! + x⁵/5! − x⁷/7! + …**, for every element of an array of N floats. Each array element is processed by the same loop body.',
      },
      {
        type: 'code',
        language: 'c',
        title: 'sinx.c (sequential)',
        code: SINX,
        explanation: [
          'The outer loop runs over the N array elements. The inner loop adds `terms` Taylor terms for one element.',
          'Iterations of the **outer** loop are independent: element i never needs the result of element k. This is what makes the program parallelisable.',
          'Compiled, each outer-loop iteration becomes an **instruction stream** of scalar instructions that loads `x[i]`, does the arithmetic and stores `result[i]`.',
        ],
      },
      {
        type: 'code',
        language: 'asm',
        title: 'Compiled loop body (simplified)',
        code: `ld   r0, addr[r1]
mul  r1, r0, r0
mul  r1, r1, r0
...
st   addr[r2], r0`,
      },
    ],
  },
  {
    id: 'simple-and-superscalar',
    title: 'Simple and superscalar processors',
    blocks: [
      {
        type: 'definitions',
        items: [
          { term: 'Fetch/Decode', definition: 'Determines which instruction to run next and what it means.' },
          { term: 'ALU (Execute)', definition: 'Performs the operation the instruction specifies.' },
          {
            term: 'Execution context',
            definition: 'The state needed to run an instruction stream: registers, program counter (PC) and related state.',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'The "very simple processor" executes **one instruction per clock**. The PC steps through `ld`, `mul`, `mul`, … one at a time.',
      },
      {
        type: 'paragraph',
        text: 'A **superscalar** processor has two (or more) fetch/decode units and execution units, so it can **decode and execute two instructions per clock** from the *same* instruction stream when they are independent. This exploits **ILP**.',
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'No ILP here',
        text: 'In the first three instructions, each `mul` needs the result of the previous instruction (`r0` → `r1` → `r1`). They form a dependency chain, so a superscalar processor **cannot** run them in parallel. ILP only helps when nearby instructions are independent.',
      },
      {
        type: 'paragraph',
        text: 'Before the multi-core era, most of a chip\'s transistors were spent making a **single instruction stream run fast**: a big data cache, out-of-order control logic, a fancy branch predictor and a memory prefetcher. More transistors meant smarter versions of these, and smaller transistors also allowed higher clock frequencies.',
      },
    ],
  },
  {
    id: 'multi-core',
    title: 'Idea #1: more, simpler cores',
    blocks: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Idea #1',
        text: 'Use the growing transistor count to add **more cores**, instead of spending it on increasingly sophisticated logic that accelerates one instruction stream (out-of-order and speculative execution).',
      },
      {
        type: 'paragraph',
        text: 'Suppose each simpler core runs a single instruction stream at **0.75×** the speed of the original "fancy" core. Two such cores give a potential speedup of **2 × 0.75 = 1.5**.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'But the program expresses no parallelism',
        text: 'The unmodified `sinx` compiled with gcc runs as **one thread on one core**. On the simpler cores it now has a "speedup" of **0.75**, which means it is **slower**. Extra cores only help if software exposes parallel work.',
      },
      {
        type: 'code',
        language: 'c',
        title: 'Expressing parallelism with pthreads',
        code: `typedef struct {
   int N;
   int terms;
   float* x;
   float* result;
} my_args;

void parallel_sinx(int N, int terms, float* x, float* result)
{
   pthread_t thread_id;
   my_args args;

   args.N = N/2;
   args.terms = terms;
   args.x = x;
   args.result = result;

   pthread_create(&thread_id, NULL, my_thread_start, &args); // launch thread
   sinx(N - args.N, terms, x + args.N, result + args.N);      // do work
   pthread_join(thread_id, NULL);
}

void my_thread_start(void* thread_arg)
{
   my_args* thread_args = (my_args*)thread_arg;
   sinx(thread_args->N, thread_args->terms, thread_args->x, thread_args->result); // do work
}`,
        explanation: [
          'The arguments are packed into a struct because a pthread start routine receives a single `void*` argument.',
          'The new thread computes the **first half** (N/2 elements). The main thread computes the **second half** itself, using the offset pointers `x + args.N`.',
          '`pthread_join` makes the main thread wait for the helper thread before returning. Lecture 5 covers these calls in detail.',
          'Note: a real pthread start routine is declared as returning `void*`. The slide shortens this.',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Data-parallel expression (fictitious language)',
        code: `void sinx(int N, int terms, float* x, float* result)
{
   // declare independent loop iterations
   forall (int i from 0 to N-1)
   {
      /* ... same loop body ... */
   }
}`,
        explanation: [
          '`forall` lets the programmer **declare** that the loop iterations are independent.',
          'With that information, a compiler could automatically generate parallel threaded code, and SIMD vector code too.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Scaling up: 4 cores compute 4 elements in parallel, and 16 cores give **16 simultaneous instruction streams**. Real examples from the lecture include a 6-core Intel "Coffee Lake" Core i7 with an integrated GPU, an NVIDIA GTX 1080 with 20 replicated processing cores ("SMs"), the 76-core Intel Xeon Phi "Knights Landing" and the dual-core Apple A9.',
      },
    ],
  },
  {
    id: 'simd',
    title: 'Idea #2: SIMD processing',
    blocks: [
      {
        type: 'paragraph',
        text: 'The sinx loop has another useful property: **every iteration does the same thing** (evaluate sin of one input). Parallelism is across iterations of the loop.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Idea #2',
        text: '**Amortise the cost and complexity of managing an instruction stream across many ALUs.** One fetch/decode unit drives, for example, 8 ALUs. The **same instruction is broadcast to all ALUs** and executed in parallel on different data. This is **SIMD: Single Instruction, Multiple Data**.',
      },
      {
        type: 'table',
        columns: ['Version', 'Processes', 'Registers / instructions'],
        rows: [
          ['Scalar program', 'One array element at a time', 'Scalar instructions on scalar registers (for example, 32-bit floats)'],
          ['Vector program (AVX)', 'Eight array elements at once', 'Vector instructions on 256-bit vector registers (`vloadps`, `vmulps`, `vstoreps`)'],
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Vector program using AVX intrinsics',
        code: `#include <immintrin.h>

void sinx(int N, int terms, float* x, float* result)
{
   float three_fact = 6;  // 3!
   for (int i = 0; i < N; i += 8)
   {
      __m256 origx = _mm256_load_ps(&x[i]);
      __m256 value = origx;
      __m256 numer = _mm256_mul_ps(origx, _mm256_mul_ps(origx, origx));
      __m256 denom = _mm256_broadcast_ss(&three_fact);
      int sign = -1;

      for (int j = 1; j <= terms; j++)
      {
         // value += sign * numer / denom
         __m256 tmp = _mm256_div_ps(_mm256_mul_ps(_mm256_set1ps(sign), numer), denom);
         value = _mm256_add_ps(value, tmp);

         numer = _mm256_mul_ps(numer, _mm256_mul_ps(origx, origx));
         denom = _mm256_mul_ps(denom, _mm256_broadcast_ss((2*j+2) * (2*j+3)));
         sign *= -1;
      }
      _mm256_store_ps(&result[i], value);
   }
}`,
        explanation: [
          '`__m256` is a 256-bit vector holding **8 × 32-bit floats**, so the loop advances by `i += 8`.',
          '`_mm256_load_ps` / `_mm256_store_ps` move 8 consecutive floats between memory and a vector register.',
          '`_mm256_mul_ps`, `_mm256_div_ps` and `_mm256_add_ps` operate on all 8 lanes with one instruction.',
          '`_mm256_broadcast_ss` copies one scalar into all 8 lanes.',
          'This code is reproduced from the slide to show the idea. It is simplified, and some calls are not exactly what a compiler accepts (the real intrinsic is `_mm256_set1_ps`, and `broadcast_ss` takes a pointer). The concept is what matters for the exam.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Combining both ideas: **16 SIMD cores × 8 ALUs = 128 elements in parallel**, with 16 simultaneous instruction streams. A data-parallel `forall` lets a compiler generate **both** multi-core parallel code and SIMD vector instructions within each core.',
      },
    ],
  },
  {
    id: 'divergence',
    title: 'Conditional execution, masking and divergence',
    blocks: [
      {
        type: 'code',
        language: 'c',
        title: 'Per-element logic with a branch',
        code: `float x = A[i];
if (x > 0) {
   float tmp = exp(x, 5.f);
   tmp *= kMyConst1;
   x = tmp + kMyConst2;
} else {
   float tmp = kMyConst1;
   x = 2.f * tmp;
}
result[i] = x;`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'All 8 ALUs evaluate the condition. Some lanes are **T** (true) and others **F** (false), for example T T F T F F F F.',
          'The SIMD unit runs the **if** block for all lanes, but **masks (discards)** the output of the lanes where the condition was false.',
          'It then runs the **else** block, masking the lanes where the condition was true.',
          'After the branch, all lanes continue at **full performance**.',
        ],
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'Cost of divergence',
        text: 'Not all ALUs do useful work during a divergent branch. The **worst case is 1/8 of peak performance** on an 8-wide unit, when each lane takes a different path and only one lane is useful at a time.',
      },
      {
        type: 'definitions',
        items: [
          {
            term: 'Instruction stream coherence ("coherent execution")',
            definition:
              'The same instruction sequence applies to all elements operated on simultaneously. It is **necessary for efficient use of SIMD** resources. It is **not necessary for efficient parallelisation across cores**, because each core can fetch and decode a different instruction stream.',
          },
          { term: 'Divergent execution', definition: 'A lack of instruction stream coherence.' },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Do not confuse instruction stream coherence with **cache coherence**, which is about keeping cached copies of memory consistent across cores (Lecture 3 mentions MESI).',
      },
    ],
  },
  {
    id: 'simd-on-cpus',
    title: 'SIMD on modern CPUs',
    blocks: [
      {
        type: 'table',
        columns: ['Instruction set', 'Width', 'Lanes'],
        rows: [
          ['SSE', '128-bit', '4 × 32-bit or 2 × 64-bit (4-wide float vectors)'],
          ['AVX', '256-bit', '8 × 32-bit or 4 × 64-bit (8-wide float vectors)'],
        ],
      },
      {
        type: 'list',
        items: [
          'Vector instructions are **generated by the compiler**:',
          'when the programmer **explicitly requests** them using intrinsics,',
          'when parallelism is **conveyed through language semantics** (the `forall` example),',
          'or when parallelism is **inferred by dependency analysis** of loops. This is hard, and even the best compilers struggle on arbitrary C/C++.',
          '**"Explicit SIMD"**: the SIMD parallelisation happens at **compile time**, so you can inspect the binary and see the vector instructions (`vstoreps`, `vmulps`, …).',
        ],
      },
    ],
  },
  {
    id: 'memory',
    title: 'Part 2: Accessing memory',
    blocks: [
      {
        type: 'definitions',
        items: [
          {
            term: 'Memory latency',
            definition: 'The time for a memory request (load or store) from a processor to be serviced by the memory system. Example: 100 cycles or 100 ns.',
          },
          { term: 'Memory bandwidth', definition: 'The rate at which the memory system can provide data to a processor. Example: 20 GB/s.' },
          {
            term: 'Stall',
            definition:
              'A processor stalls when it cannot run the next instruction in a stream because of a **dependency on a previous instruction**. Memory access is a major source of stalls, because memory access times are on the order of **hundreds of cycles**.',
          },
        ],
      },
      {
        type: 'code',
        language: 'asm',
        title: 'A dependency that causes a stall',
        code: `ld  r0 mem[r2]
ld  r1 mem[r3]
add r0, r0, r1   ; cannot execute until both loads complete`,
      },
      {
        type: 'paragraph',
        text: 'A typical cache hierarchy from the lecture has a private **L1 (32 KB)** and **L2 (256 KB)** cache per core, a shared **L3 (8 MB)** cache, and DDR3 DRAM (gigabytes) connected at about **25 GB/s**.',
      },
      {
        type: 'table',
        columns: ['Technique', 'Effect on stalls', 'Caveat'],
        rows: [
          ['Caches', '**Reduce** the length of stalls (reduce latency). They also provide high-bandwidth data transfer to the CPU.', 'Help only when the data is already resident in the cache.'],
          ['Prefetching', '**Hides** latency: hardware analyses access patterns, predicts upcoming accesses and loads data early, so later loads become cache hits.', 'A wrong guess can **reduce** performance by wasting bandwidth and polluting caches.'],
          ['Multi-threading', '**Hides** stalls: the core keeps several execution contexts and switches to another thread while one waits on a long-latency operation.', 'The programmer must create **more threads than cores**.'],
        ],
      },
    ],
  },
  {
    id: 'summary-techniques',
    title: 'Summary: four ways to exploit independent operations',
    blocks: [
      {
        type: 'table',
        columns: ['Technique', 'What it is', 'Who maps the parallelism?'],
        rows: [
          ['Superscalar execution', 'Multiple instructions per clock from the **same** thread (ILP)', 'Usually **not** the programmer. Hardware or compiler detects ILP (manual loop unrolling can help).'],
          ['SIMD execution', 'The same instruction on multiple data elements in vector registers. Fetch/decode cost is amortised over many ALUs.', 'Compiler in simple cases. In practice the programmer, via vector instructions or a high-level data-parallel language (for example ISPC, CUDA).'],
          ['Multi-core execution', 'Multiple, mostly independent cores, each running its own instruction stream', 'The **programmer** defines threads (pthreads, ISPC tasks, OpenMP `#pragma`).'],
          ['Multi-threaded execution', 'A core keeps execution contexts (PC, registers, …) for several threads and interleaves them to hide stalls', 'The programmer defines threads, and must create **more threads than cores**.'],
        ],
      },
      {
        type: 'table',
        caption: 'Processor examples from the lecture.',
        columns: ['Processor', 'Cores', 'Per core'],
        rows: [
          ['Intel Core i7', '4 cores', '2 threads (Hyper-Threading), 8-wide AVX or 4-wide SSE SIMD, superscalar'],
          ['NVIDIA GTX 980', '16 "SMM" cores', 'Up to 64 warps (a warp = 32 "CUDA threads"), 32-wide SIMD, multiple instructions per clock'],
          ['Intel Xeon Phi', '61 cores', '4 threads, 16-wide SIMD'],
        ],
      },
    ],
  },
];

export const examPoints: string[] = [
  'A superscalar core needs **independent** instructions. A dependency chain such as `ld → mul → mul` gives no ILP.',
  'Idea #1 (more, simpler cores) gives **2 × 0.75 = 1.5** potential speedup, but an unmodified sequential program runs on one core at **0.75×** and becomes slower.',
  'Idea #2 (SIMD): one fetch/decode drives many ALUs, and the same instruction is broadcast to all of them. AVX = 256-bit = 8 floats, SSE = 128-bit = 4 floats.',
  'Divergent branches are handled by **masking**. Worst case on 8-wide SIMD is **1/8 of peak**.',
  'Coherent execution is required for efficient **SIMD**, not for efficient **multi-core**. Instruction coherence ≠ cache coherence.',
  'Latency = **time** per request (cycles or ns). Bandwidth = **rate** of data delivery (GB/s).',
  'Caches **reduce** latency. Prefetching and multi-threading **hide** latency. A bad prefetch can hurt.',
  'Superscalar parallelism is found by hardware. Multi-core and multi-threading need **programmer-defined threads**.',
];

export const quickRevision: string[] = [
  'An execution context is the PC, registers and other state of one instruction stream.',
  'A simple processor runs 1 instruction per clock. A 2-wide superscalar core runs up to 2.',
  'Pre multi-core, transistors went into caches, out-of-order logic, branch prediction and prefetchers.',
  'Two 0.75× cores give 1.5× potential.',
  '`forall` declares loop iterations independent.',
  'In SIMD, the same instruction runs on multiple data elements.',
  '16 cores × 8 ALUs = 128 elements in parallel, with 16 instruction streams.',
  'Masking discards the output of inactive lanes.',
  'A stall happens when the next instruction depends on one that is still pending.',
  'Hierarchy: L1 32 KB → L2 256 KB → L3 8 MB → DRAM.',
  'Prefetching guesses future accesses.',
  'Hardware multi-threading switches threads on long-latency stalls.',
];
