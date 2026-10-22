import type { ReviewSection } from '../../schema';

export const sections: ReviewSection[] = [
  {
    id: 'why-more-performance',
    title: 'Why we keep needing more performance',
    blocks: [
      {
        type: 'paragraph',
        text: 'Computational power keeps increasing, but so does the size of our problems. Past performance gains made previously impossible problems solvable (the lecture\'s example is **decoding the human genome**). Many harder problems are still waiting: **climate modelling, protein folding, drug discovery, energy research and data analysis**.',
      },
      {
        type: 'paragraph',
        text: 'Until recently, performance increases came mainly from the rising **density of transistors**, the building block of a processor. That approach has inherent physical problems.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Smaller transistors → faster processors.',
          'Faster processors → increased power consumption.',
          'Increased power consumption → increased heat.',
          'Increased heat → **unreliable processors**.',
        ],
      },
      {
        type: 'definitions',
        items: [
          {
            term: 'Moore\'s Law',
            definition:
              'The observation, from Gordon Moore\'s 1965 paper "Cramming more components onto integrated circuits", that has guided the semiconductor industry for decades: the number of components on a chip keeps increasing exponentially. Many now predict it will slow or end as silicon reaches its physical limits, and the industry is exploring alternatives such as **quantum computing**.',
          },
        ],
      },
    ],
  },
  {
    id: 'free-lunch',
    title: 'The end of the free lunch',
    blocks: [
      {
        type: 'list',
        items: [
          'Moving to multi-core marks **"the end of the free lunch"**: applications no longer speed up automatically as clock rates increase.',
          'To exploit multiple cores, applications must be **rewritten using parallel programming techniques**. This may eventually affect much or all of the software industry.',
          'Adding processors does not help if programmers are unaware of them or do not know how to use them. **Serial programs do not benefit** in most cases.',
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        text: 'The lecture quotes Steve Jobs: the industry is adding "more and more cores, but nobody knows how to program those things." The point is that the bottleneck has moved from hardware to software.',
      },
    ],
  },
  {
    id: 'goals',
    title: 'Why parallel computers? Goals',
    summary: 'Parallelism means doing multiple things (instructions, operations, tasks) at the same time.',
    blocks: [
      {
        type: 'table',
        columns: ['Goal', 'How parallelism helps'],
        rows: [
          ['**Improve performance** (main goal)', 'Reduce execution time or increase task throughput. Execution time is governed by **Amdahl\'s Law**, which is covered later in the course.'],
          ['Reduce power consumption', '**4N units at frequency F/4 consume less power than N units at frequency F**, while offering the same peak throughput.'],
          ['Improve cost efficiency and scalability, reduce complexity', 'It is harder to design one unit that performs as well as N simpler units.'],
          ['Improve dependability', '**Redundant execution in space**: the same work runs on multiple units, so a fault can be detected or tolerated.'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Why do 4N slow units use less power? (Background)',
        text: 'The slide asks "Why?" without answering. Standard background: the dynamic power of a chip grows with clock frequency and with the **square of the supply voltage**. Units running at a lower frequency can run at a lower voltage, so many slow units can match the throughput of fewer fast ones while using less total power.',
      },
    ],
  },
  {
    id: 'creating-tasks',
    title: 'Task-level parallelism: creating tasks',
    blocks: [
      {
        type: 'table',
        columns: ['Approach', 'How', 'When it is easy or hard'],
        rows: [
          ['Partition one problem into related tasks (threads), **explicitly**', 'Parallel programming', 'Easy when tasks are natural in the problem (web or database queries). Difficult when task boundaries are unclear.'],
          ['Partition one problem **transparently / implicitly**', '**Thread-level speculation**: partition a single thread speculatively', 'No programmer effort, but relies on speculation.'],
          ['Run **many independent tasks (processes)** together', 'Multiprogramming', 'Easy when there are many processes (batch simulations, different users, cloud workloads). **It does not improve the performance of a single task.**'],
        ],
      },
    ],
  },
  {
    id: 'types-of-parallelism',
    title: 'Types and granularity of parallelism',
    blocks: [
      {
        type: 'table',
        columns: ['Type', 'What runs in parallel', 'How it is exploited'],
        rows: [
          ['Instruction-level parallelism', 'Different instructions within one stream', 'Pipelining, out-of-order execution, speculative execution, VLIW'],
          ['Data parallelism', 'The same operation on different pieces of data', 'SIMD: vector processing, array processing'],
          ['Task-level parallelism', 'Different tasks or threads', 'Multithreading, multiprocessing'],
        ],
      },
      {
        type: 'definitions',
        items: [
          { term: 'Bit-level parallelism', definition: 'Processing multiple bits of data at once (for example, wider words).' },
          { term: 'Instruction-level parallelism', definition: 'Executing different instructions from the **same** instruction stream in parallel.' },
          { term: 'Task-level parallelism', definition: 'Executing **separate** instruction streams in parallel.' },
        ],
      },
    ],
  },
  {
    id: 'processor-kinds',
    title: 'Many kinds of processors, and GPUs',
    blocks: [
      {
        type: 'paragraph',
        text: 'Parallel systems use **CPUs, GPUs, FPGAs (Field-Programmable Gate Arrays) and computer clusters**. Several kinds exist for the following reasons:',
      },
      {
        type: 'list',
        items: [
          '**Task specialisation:** general-purpose computing, data-parallel work and custom hardware acceleration need different designs.',
          '**Efficiency and power:** FPGAs can be very power-efficient because they are customised to the exact task. CPUs balance performance and power for everyday work.',
          '**Scalability:** in HPC, mixing processors lets each task go to the best-suited unit. For example, CPUs manage scheduling and coordination while GPUs do the data crunching.',
          '**Innovation and market demand:** new processor types appear to optimise computations that general-purpose CPUs handle inefficiently.',
        ],
      },
      {
        type: 'definitions',
        items: [
          {
            term: 'GPU',
            definition:
              'A widely available **massively parallel processor**. Instead of a few complex superscalar cores, it uses **many simple cores** (the NVIDIA GTX 680 has 1,536 "CUDA cores"). It is small enough for a desktop yet can handle **thousands of threads**, and it is no longer restricted to graphics.',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'GPUs came from two unrelated needs. **Computational science** needs to solve the largest problems in reasonable time (galaxy formation, molecular dynamics, climate). The **video-game industry** needs real-time, photo-realistic graphics on consumer hardware, which led to the graphics accelerator. Together these produced the GPU: supercomputer-like parallelism at the price of a desktop.',
      },
    ],
  },
  {
    id: 'multicore-multiprocessor',
    title: 'Single-core, multi-core and multiprocessor',
    blocks: [
      {
        type: 'definitions',
        items: [
          { term: 'Single-core processor', definition: 'Executes one instruction stream at a time. Performance is limited for multitasking and parallel work.' },
          {
            term: 'Multi-core processor',
            definition: 'Multiple processing cores on **one chip**. Each core executes independently, and all cores share the same physical memory and on-chip resources.',
          },
          {
            term: 'Multiprocessor architecture',
            definition:
              'Multiple **physical processors** (each possibly multi-core) in one system. They can be **tightly coupled** (shared memory) or **loosely coupled** (each processor has its own memory).',
          },
        ],
      },
      {
        type: 'table',
        caption: 'The hardware hierarchy shown in the lecture.',
        columns: ['Level', 'Contains'],
        rows: [
          ['Core', 'Registers, execution units, L1 and L2 cache'],
          ['Chip', 'Many cores (up to 64 in the example) plus a shared L3 cache'],
          ['Node', 'For example 2 sockets (chips) + memory + I/O'],
          ['Supercomputer', 'Many nodes + a high-performance network + storage'],
        ],
      },
    ],
  },
  {
    id: 'memory-architectures',
    title: 'Shared, distributed and hybrid memory',
    blocks: [
      {
        type: 'table',
        columns: ['Architecture', 'Idea', 'Examples'],
        rows: [
          ['Shared memory', 'Multiple cores or processors access the **same** memory', 'Modern laptops, desktops, smartphones'],
          ['Distributed memory', 'Each processor has its **own** memory, and processors are connected over a network', 'Cloud computing, distributed rendering, shared-resource systems'],
          ['Hybrid', 'Shared-memory machines connected into a distributed network. **Most "distributed" systems are actually hybrids.**', 'Thousands of multi-core machines working on one problem'],
        ],
      },
      {
        type: 'paragraph',
        text: '**Distributed computing** spreads tasks across independent systems connected by a network. **Parallel computing** performs simultaneous computations within a system (multi-core or multiprocessor). They complement each other in hybrid systems.',
      },
      {
        type: 'definitions',
        items: [
          {
            term: 'Cache coherence (shared memory)',
            definition:
              'Each core has local caches of the shared memory. Keeping these copies consistent, so every core sees the most up-to-date data, needs a protocol such as **MESI (Modified, Exclusive, Shared, Invalid)**.',
          },
          {
            term: 'Memory bandwidth (shared memory)',
            definition: 'As the number of cores grows, so does the demand for bandwidth. If memory cannot supply data fast enough, cores stall and efficiency drops.',
          },
          {
            term: 'Tightly coupled multiprocessor',
            definition:
              'Shared memory, with the same coherence and bandwidth issues made more complex by multiple processors (some designs are **NUMA**). The advantage is **faster access to shared data**.',
          },
          {
            term: 'Loosely coupled multiprocessor',
            definition: 'Distributed memory. **No cache-coherence mechanism is needed**, but data must be shared by **message passing** (for example, **MPI**).',
          },
        ],
      },
    ],
  },
  {
    id: 'performance-metrics',
    title: 'Measuring performance: speedup, efficiency, scalability',
    blocks: [
      {
        type: 'paragraph',
        text: 'Common metrics include speedup, efficiency, scalability, load balancing, communication overhead, Amdahl\'s and Gustafson\'s laws, latency, bandwidth, overhead, throughput, FLOPS and power consumption (performance per watt). This lecture focuses on the first few.',
      },
      {
        type: 'formula',
        label: 'Speedup',
        expression: 'S(N) = T(1 processor) / T(N processors)',
        note: 'Run the program sequentially (without `#pragma omp parallel`), run the parallel version, and compare the times. For a **fair** comparison, use the best-known algorithm on each system.',
      },
      {
        type: 'formula',
        label: 'Efficiency',
        expression: 'E(N) = S(N) / N        (0 ≤ E ≤ 1)',
        note: 'E = 1 means all threads are fully utilised. E = 0.5 means only half of the potential benefit is realised (for example, because of communication overhead or load imbalance).',
      },
      {
        type: 'callout',
        tone: 'example',
        title: 'Worked example',
        text: 'A program takes 120 s sequentially and 20 s on 8 threads. Speedup = 120 / 20 = **6**. Efficiency = 6 / 8 = **0.75 (75%)**.',
      },
      {
        type: 'definitions',
        items: [
          {
            term: 'Scalability',
            definition:
              'How well performance improves as resources (cores or processors) are added. Measure it by running with 1, 2, 4, 8 … threads. A well-scaling program shows only a small drop in efficiency as threads increase.',
          },
          {
            term: 'Strong scaling',
            definition: 'The **problem size stays constant** as processors are added, so the run time should decrease proportionally.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'Scalability limits',
        items: [
          'Good speedup on a few cores does not guarantee good scaling to many.',
          '**Fine-grained** tasks can suffer from too much communication overhead as the processor count grows.',
          'Programs with **high data dependency** are hard to parallelise efficiently, because processors wait for each other\'s results.',
        ],
      },
    ],
  },
  {
    id: 'flops',
    title: 'FLOPS',
    blocks: [
      {
        type: 'paragraph',
        text: '**FLOPS (floating-point operations per second)** measures performance, usually the **peak theoretical** performance of a core, processor or system. It is widely used in HPC. To measure it, count the floating-point operations and divide by the time taken.',
      },
      {
        type: 'formula',
        label: 'Per core (traditional)',
        expression: 'FLOPS_core = FLOPs/cycle × cycles/second',
      },
      {
        type: 'formula',
        label: 'Per node (multi-core)',
        expression: 'FLOPS_node = FLOPs/cycle × cycles/second × cores/node',
      },
      {
        type: 'formula',
        label: 'Whole system',
        expression: 'FLOPS_system = FLOPs/cycle × cycles/second × cores/node × nodes/system',
        note: 'For an HPC installation, the lecture also gives **FLOPS = racks × FLOPS_system**, which assumes every rack contributes equally (uniform, well-balanced hardware).',
      },
      {
        type: 'callout',
        tone: 'example',
        title: 'Worked example',
        text: 'Cores run at 2.5 GHz and can do 16 FLOPs per cycle, with 8 cores per node: FLOPS_node = 16 × 2.5×10⁹ × 8 = **320 GFLOPS**.',
      },
      {
        type: 'paragraph',
        text: '**Looking ahead:** traditional processors may be reaching their limits. Quantum computers could vastly enhance parallel computation. The lecture cites Google\'s (then unofficial) "quantum supremacy" claim of finishing in 4 minutes what a top supercomputer would need 10,000 years for. Each added qubit doubles the number of states that can be represented (2ⁿ).',
      },
    ],
  },
];

export const examPoints: string[] = [
  'Physics chain: smaller transistors → faster → more power → more heat → **unreliable processors**.',
  '"End of the free lunch": software no longer speeds up automatically and must be rewritten to be parallel. Serial programs do not benefit.',
  'Main goal of parallelism = performance (execution time or throughput). Other goals: lower power (4N units at F/4 < N units at F), cost and scalability, dependability (redundancy in space).',
  'Running many independent processes is easy, but **does not speed up a single task**.',
  'ILP → pipelining, out-of-order, speculation, VLIW. Data parallelism → SIMD (vector or array). Task parallelism → multithreading or multiprocessing.',
  'Tightly coupled = shared memory (needs cache coherence, e.g. MESI). Loosely coupled = distributed memory (needs message passing, e.g. MPI).',
  'Speedup = T₁ / T_N. Efficiency = Speedup / N. Strong scaling keeps the problem size fixed.',
  'FLOPS_node = FLOPs/cycle × cycles/s × cores/node. Multiply by nodes/system for the whole system.',
];

export const quickRevision: string[] = [
  'Human genome decoding is the lecture\'s example of a problem solved thanks to past performance gains.',
  'Moore\'s Law comes from Moore\'s 1965 paper, and is expected to slow.',
  'Thread-level speculation partitions a single thread speculatively.',
  'Bit-, instruction- and task-level parallelism are the three granularity levels.',
  'GPU: many simple cores, thousands of threads (GTX 680 has 1,536 CUDA cores).',
  'GPUs were born from computational science plus video games.',
  'Hierarchy: core → chip → node → supercomputer.',
  'Laptops and phones are shared memory. Clouds are distributed memory. Most real systems are hybrid.',
  'MESI states: Modified, Exclusive, Shared, Invalid.',
  'Efficiency of 1.0 means perfect use. 0.5 means half the potential is realised.',
  'Fair speedup uses the best-known algorithm on each system.',
];
