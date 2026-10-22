import type { ReviewSection } from '../../schema';

export const sections: ReviewSection[] = [
  {
    id: 'von-neumann',
    title: 'The Von Neumann architecture and its bottleneck',
    blocks: [
      {
        type: 'paragraph',
        text: 'In the Von Neumann architecture, the CPU processes instructions **sequentially**, repeating the **fetch–decode–execute** cycle:',
      },
      {
        type: 'definitions',
        items: [
          { term: 'Fetch', definition: 'The CPU retrieves an instruction from memory.' },
          { term: 'Decode', definition: 'The CPU interprets what the instruction means.' },
          { term: 'Execute', definition: 'The CPU performs the action the instruction specifies.' },
        ],
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'Von Neumann bottleneck',
        text: 'Because instructions and data move between the CPU and memory one step at a time, the **speed of data transfer between the CPU and memory becomes the limiting factor**. Strictly sequential processing also wastes work that could otherwise be done simultaneously.',
      },
      {
        type: 'paragraph',
        text: 'The original model is not designed for parallelism, but modern adaptations add it in several ways:',
      },
      {
        type: 'table',
        columns: ['Adaptation', 'How it adds parallelism'],
        rows: [
          ['Pipelining', 'Splits fetch–decode–execute into stages, so different instructions are in different stages at the same time. This increases throughput.'],
          ['Multi-core processors', 'Several cores on one chip, each following the Von Neumann model, run different tasks independently. This is **true parallel execution**.'],
          ['SIMD', 'Some instructions operate on multiple data points at once, which is useful in graphics and scientific computing.'],
          ['Hyper-threading', 'One core runs multiple threads, **mimicking** parallelism by switching between them efficiently, even though they share the core.'],
        ],
      },
    ],
  },
  {
    id: 'flynn',
    title: "Flynn's taxonomy: SISD, SIMD, MISD, MIMD (background)",
    summary: 'The lecture lists these four classes and asks you to research their pros and cons. Here is the standard summary.',
    blocks: [
      {
        type: 'table',
        columns: ['Class', 'Meaning', 'Example', 'Pros', 'Cons'],
        rows: [
          ['SISD', 'Single Instruction, Single Data', 'A classic single-core Von Neumann CPU', 'Simple to program and design', 'No parallelism, so performance is limited'],
          ['SIMD', 'Single Instruction, Multiple Data', 'Vector units (SSE/AVX), GPUs', 'Very efficient for data-parallel work. One control unit drives many ALUs.', 'Poor for branching or divergent code. Needs uniform work.'],
          ['MISD', 'Multiple Instruction, Single Data', 'Rare. Fault-tolerant systems running redundant computations on the same data.', 'Redundancy and reliability', 'Few practical uses, so rarely built'],
          ['MIMD', 'Multiple Instruction, Multiple Data', 'Multi-core CPUs, clusters', 'Flexible. Each processor runs its own program on its own data.', 'Needs synchronisation and communication, and is harder to program'],
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        text: '**Background:** this table is standard course knowledge. The slides only name the four classes and link to an external video. Lecture 2 covers SIMD in depth.',
      },
    ],
  },
  {
    id: 'concurrency-parallelism',
    title: 'Concurrency vs parallelism',
    blocks: [
      {
        type: 'definitions',
        items: [
          {
            term: 'Concurrency',
            definition:
              'A property of a **program, at design level**: two or more tasks can be **in progress** at the same time. They are not necessarily executing at the same instant. On a single core, they may simply take turns.',
          },
          {
            term: 'Parallelism',
            definition:
              'A **run-time** property: two or more tasks are **executing simultaneously**. It requires appropriate hardware, such as multiple processors or cores, a multi-core CPU or a GPU.',
          },
        ],
      },
      {
        type: 'formula',
        label: 'Relationship',
        expression: 'P ⊂ C',
        note: 'Parallelism requires concurrency, but concurrency does not require parallelism. "In progress" is not the same as "being executed".',
      },
      {
        type: 'callout',
        tone: 'example',
        text: 'Two tasks interleaved on one core are **concurrent but not parallel**. The same two tasks running on two cores at once are **both concurrent and parallel**.',
      },
    ],
  },
  {
    id: 'problem-types',
    title: 'Parallel computing, data-parallel and task-parallel problems',
    blocks: [
      {
        type: 'definitions',
        items: [
          {
            term: 'Parallel computing',
            definition: 'Solving a problem of size n by dividing its domain into **k ≥ 2 parts** and solving them with **p physical processors simultaneously**.',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'Identifying the problem type is essential when designing a parallel algorithm. If a problem P with domain D is parallelisable, D can be decomposed into k sub-problems:',
      },
      { type: 'formula', expression: 'D = d₁ + d₂ + … + d_k = Σ dᵢ' },
      {
        type: 'table',
        columns: ['', 'Data-parallel problem', 'Task-parallel problem'],
        rows: [
          ['Domain D is made of', 'Data elements', 'Functions'],
          ['Solving it means', 'Applying **one kernel function f** to the whole domain', 'Applying **each function** to a **common stream of data S**'],
          ['Formula', 'f(D) = f(d₁) + f(d₂) + … + f(d_k)', 'D(S) = d₁(S) + d₂(S) + … + d_k(S)'],
          ['Best suited to', '**GPU**: all threads execute the same instructions on different data', '**CPU**: each thread can execute a different task'],
          ['Typical example', 'Computational physics problems', 'Independent stages or functions over the same input'],
        ],
      },
    ],
  },
  {
    id: 'complexity-benchmarking',
    title: 'Complexity, benchmarking and timing',
    blocks: [
      {
        type: 'paragraph',
        text: '**Sequential algorithms** are analysed with **time complexity**: the number of operations relative to input size, written in **Big-O** notation, which ignores constants and lower-order terms. Examples: merge sort is O(n log n), and bubble sort is O(n²). Such algorithms cannot use multiple processors.',
      },
      {
        type: 'paragraph',
        text: '**Parallel algorithms** split the problem into smaller tasks that run simultaneously, and can achieve large speedups. Their actual execution time also depends on how tasks are divided and on **communication overhead**, so they need **benchmarking**: measuring the real execution time of the sequential and parallel versions, accounting for speedup, overhead and processor utilisation.',
      },
      {
        type: 'code',
        language: 'c',
        title: 'Timing the sequential version (C++)',
        code: `#include <ctime>   // clock(), CLOCKS_PER_SEC

clock_t start = clock();
sequentialSum(arr, SIZE);          // run the sequential sum
clock_t end = clock();
double sequential_elapsed = double(end - start) / CLOCKS_PER_SEC;
printf("Sequential Time taken: %.6f seconds\\n", sequential_elapsed);`,
        explanation: [
          'Read the clock before and after the work, then divide the difference by `CLOCKS_PER_SEC` to get seconds.',
          'Time the parallel version the same way, but watch for **false sharing and race conditions**, which are covered later. Bad parallelism does not scale.',
          'Note: `clock()` measures **CPU time**. In a multi-threaded program it can add up the time of all threads, so a wall-clock timer such as `omp_get_wtime()` is the better choice for parallel runs.',
        ],
      },
      {
        type: 'table',
        caption: 'Timing methods compared in the lecture.',
        columns: ['Method', 'Header', 'Precision', 'Measures', 'Portability'],
        rows: [
          ['`clock()`', '`<ctime>`', 'Milliseconds', 'CPU time', 'Cross-platform'],
          ['`std::chrono`', '`<chrono>`', 'Nanoseconds', 'Wall-clock / CPU time', 'Cross-platform'],
          ['`gettimeofday()`', '`<sys/time.h>`', 'Microseconds', 'Wall-clock time', 'POSIX'],
          ['`clock_gettime()`', '`<time.h>`', 'Nanoseconds', 'Wall-clock time', 'POSIX'],
          ['`omp_get_wtime()`', '`<omp.h>`', 'High precision', 'Wall-clock time', 'OpenMP-supported'],
          ['`MPI_Wtime()`', '`<mpi.h>`', 'High precision', 'Wall-clock time', 'MPI-supported'],
        ],
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'Why theoretical complexity alone is not enough',
        items: [
          'Real performance depends on the hardware: number of cores, clock speed and memory bandwidth.',
          'Managing parallel tasks, synchronising data and communicating between processors adds **overhead** that reduces the actual speedup.',
          '**Memory bandwidth** can bottleneck parallel algorithms, and disk or network access can make code slow regardless of its Big-O.',
          'So **combine theoretical analysis with benchmarking** to find bottlenecks that Big-O does not capture.',
        ],
      },
    ],
  },
  {
    id: 'serial-optimisation',
    title: 'Serial code optimisation (before you parallelise)',
    blocks: [
      {
        type: 'list',
        items: [
          'Two approaches to the serial problem: **rewrite** serial programs to be parallel, or write **translation programs** that convert serial programs to parallel automatically. Automatic translation is very difficult and has had limited success.',
          'Some constructs can be recognised automatically and converted, but the result is often **very inefficient**. Sometimes the best parallel solution is to step back and devise an **entirely new algorithm**.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Knuth: "Premature optimization is the root of all evil."',
        text: 'Do not optimise everything from the start. Assuming you already have the best algorithm, improve performance **incrementally** by finding the **hotspots**, the critical parts of the code where the time goes. A hotspot may or may not be parallelisable, depending on the nature of its work.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Profile:** run the program with a profiler (in C/C++: `gprof`, `perf`, `valgrind`). Example: a function computing air pressure at each grid point takes 80% of the runtime.',
          '**Find the critical code:** focus on that function. Is it doing redundant or unnecessary work?',
          '**Optimise:** rewrite it for efficiency.',
          '**Repeat:** profile again. If a new bottleneck appears, repeat the cycle. Do **not** optimise parts that are not bottlenecks.',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Cache thrashing from a poor access pattern',
        code: `int matrix[1024][1024];

// Poor access pattern (cache unfriendly)
for (int i = 0; i < 1024; i++)
    for (int j = 0; j < 1024; j++)
        matrix[j][i] = i + j;   // walks down a column

// Better access pattern (cache friendly)
for (int i = 0; i < 1024; i++)
    for (int j = 0; j < 1024; j++)
        matrix[i][j] = i + j;   // walks along a row`,
        explanation: [
          'C stores 2-D arrays in **row-major** order: `matrix[i][0..1023]` are adjacent in memory.',
          '`matrix[j][i]` with `j` in the inner loop jumps a whole row (4 KB) on every access, so each access touches a new cache line, which is **cache thrashing**.',
          '`matrix[i][j]` walks consecutive addresses, so each cache line loaded is fully used.',
          'The lecture\'s sample run shows the cache-friendly loop about **10× faster** (≈0.012 s vs ≈0.123 s).',
        ],
      },
    ],
  },
  {
    id: 'granularity',
    title: 'Granularity: coarse vs fine',
    blocks: [
      {
        type: 'paragraph',
        text: '**Granularity** is the ratio of **computation** (useful work done by each process or thread) to **communication** (overhead for coordination, data sharing or synchronisation).',
      },
      {
        type: 'formula',
        label: 'Granularity',
        expression: 'G = T_comp / T_comm',
        note: 'T_comp is the time spent computing a task. T_comm is the time spent exchanging data between processors.',
      },
      {
        type: 'paragraph',
        text: 'To measure it in practice, profile computation time and communication time using timers such as `MPI_Wtime()` and the OpenMP timers, or tools such as Vampir, Intel VTune and Valgrind. A **higher G** means more computation per unit of communication, which usually gives **better parallel performance** because there is less overhead.',
      },
      {
        type: 'table',
        columns: ['', 'Coarse grain (high G)', 'Fine grain (low G)'],
        rows: [
          ['Work between communication events', 'Relatively **large**', 'Relatively **small**'],
          ['Tasks', 'A few large tasks', 'Many small tasks assigned to many processors'],
          ['Advantage', '**Low** communication and synchronisation overhead', 'Work can be spread across many processors'],
          ['Risk', '**Load imbalance**: some tasks process most of the data while others sit idle', 'Communication overhead can dominate, especially as you scale'],
        ],
      },
    ],
  },
  {
    id: 'dag-model',
    title: 'The DAG execution model',
    blocks: [
      {
        type: 'paragraph',
        text: 'A **DAG (Directed Acyclic Graph)** represents the **dependencies between tasks** in an algorithm. It shows the scheduler which tasks can run in parallel and which must wait.',
      },
      {
        type: 'definitions',
        items: [
          { term: 'Node', definition: 'A task, such as splitting an array, sorting a subarray or merging two subarrays.' },
          { term: 'Edge', definition: 'A dependency. For example, both halves must be sorted before they can be merged.' },
          {
            term: 'Parallelism in a DAG',
            definition: 'Tasks with **no dependency on each other** (for example, tasks at the same level) can execute in parallel, such as the left and right halves in merge sort.',
          },
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Merge sort as a DAG (split levels)',
        code: `              A
           /     \\
          B       C
         / \\     / \\
        D   E   F   G
       /\\  /\\  /\\  /\\
      H I J K L M N O`,
        explanation: [
          'Each level of splits is independent. B and C can run in parallel, and so can D, E, F and G.',
          'Merges flow back up: a node can merge only after both of its children have finished.',
          'With **2 cores**, B and C run in parallel. With **4 cores**, D–G can run at the same time. The DAG tells the scheduler this.',
        ],
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'Benchmarking lesson (merge sort)',
        items: [
          'For **small** problems, parallel code may **not** beat sequential code because of overhead.',
          'For **large** problems, parallelism can greatly reduce execution time **if the work is evenly distributed** among threads.',
        ],
      },
      {
        type: 'definitions',
        items: [
          { term: 'Communication', definition: 'One or more cores send their results (for example, partial sums) to another core.' },
          { term: 'Load balancing', definition: 'Share the work evenly so that no core is heavily loaded while others are idle.' },
          { term: 'Synchronisation', definition: 'Each core works at its own pace, so make sure no core gets too far ahead of the rest.' },
        ],
      },
    ],
  },
];

export const examPoints: string[] = [
  'Von Neumann bottleneck = **CPU–memory data transfer speed** limits performance in a sequential fetch–decode–execute machine.',
  'Pipelining, multi-core, SIMD and hyper-threading add parallelism to the Von Neumann model. Hyper-threading only **mimics** parallelism by switching threads.',
  'Concurrency = **design** (tasks in progress together). Parallelism = **run time** (tasks executing simultaneously). **P ⊂ C.**',
  'Data-parallel means one kernel f over all data, which suits the **GPU**. Task-parallel means many functions over one data stream, which suits the **CPU**.',
  '`clock()` measures **CPU time**. Use wall-clock timers (`omp_get_wtime`, `MPI_Wtime`) for parallel code.',
  'Profiling cycle: **profile → find critical code → optimise → repeat**. Do not optimise non-bottlenecks (Knuth).',
  '**G = T_comp / T_comm.** High G means coarse grain (low overhead, risk of load imbalance). Low G means fine grain (high communication overhead).',
  'In a DAG, nodes are tasks and edges are dependencies. Independent nodes can run in parallel. Small problems may not benefit from parallelism.',
];

export const quickRevision: string[] = [
  'Fetch, then decode, then execute.',
  'Multi-core means each core is its own Von Neumann machine.',
  'In Flynn\'s taxonomy, SIMD covers GPUs and vector units, and MIMD covers multi-core CPUs and clusters.',
  'Concurrency does not require parallelism. Parallelism requires concurrency.',
  'Parallel computing divides the domain into k ≥ 2 parts solved on p processors simultaneously.',
  'Merge sort is O(n log n). Bubble sort is O(n²).',
  'Profilers: gprof, perf, valgrind.',
  'C arrays are row-major, so loop over the last index innermost.',
  'Automatic serial-to-parallel translation has had limited success.',
  'Coordination needs communication, load balancing and synchronisation.',
];
