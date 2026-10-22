import type { EssayQuestion } from '../../schema';

export const essays: EssayQuestion[] = [
  {
    id: 'l04-e01',
    style: 'define-explain',
    prompt: 'Describe the Von Neumann fetch–decode–execute cycle and the Von Neumann bottleneck. How do modern processors introduce parallelism into this model?',
    keyConcepts: ['Fetch, decode, execute', 'Sequential processing', 'CPU–memory transfer limits speed', 'Pipelining', 'Multi-core', 'SIMD', 'Hyper-threading'],
    modelAnswer: [
      'A Von Neumann CPU repeatedly **fetches** an instruction from memory, **decodes** it to determine what it means, and **executes** the action. Instructions are processed sequentially.',
      'The **Von Neumann bottleneck** arises because instructions and data must travel between the CPU and memory, so the speed of that transfer limits overall performance. Sequential processing also cannot exploit work that could be done simultaneously.',
      'Modern CPUs adapt the model. **Pipelining** overlaps the stages of different instructions to raise throughput. **Multi-core** chips contain several Von Neumann cores that run tasks truly in parallel. **SIMD** instructions process multiple data points at once. **Hyper-threading** lets one core run several threads by switching between them efficiently, which mimics parallelism.',
    ],
    whyItMatters: 'It links classic architecture to parallel architecture. Examiners expect you to name the bottleneck precisely (CPU–memory transfer).',
    structure: ['Explain the cycle', 'Define the bottleneck', 'Give four adaptations, one sentence each'],
  },
  {
    id: 'l04-e02',
    style: 'define-explain',
    prompt: "Background question: explain Flynn's taxonomy (SISD, SIMD, MISD, MIMD), giving an example and one advantage and one limitation of each.",
    keyConcepts: ['Instruction streams vs data streams', 'SISD: single-core', 'SIMD: vector units, GPUs', 'MISD: rare, redundancy', 'MIMD: multi-core, clusters'],
    modelAnswer: [
      'Flynn classifies computers by the number of **instruction streams** and **data streams** they process at once.',
      '**SISD** (single instruction, single data) is a classic sequential CPU. It is simple, but offers no parallelism.',
      '**SIMD** (single instruction, multiple data) covers vector units and GPUs. One control unit drives many ALUs, which is efficient for data-parallel work, but branching (divergence) wastes lanes.',
      '**MISD** (multiple instruction, single data) is rare. It can provide redundancy for fault tolerance, but it has few practical uses.',
      '**MIMD** (multiple instruction, multiple data) covers multi-core CPUs and clusters. It is flexible because each processor runs its own program, but it requires synchronisation and communication, which makes it harder to program.',
    ],
    whyItMatters: 'The lecture asks you to research the pros and cons of these four classes, so expect a question on them. This answer uses standard background material rather than slide content.',
  },
  {
    id: 'l04-e03',
    style: 'compare-contrast',
    prompt: 'Distinguish concurrency from parallelism, and explain the statement P ⊂ C.',
    keyConcepts: ['Concurrency: design-level property', 'Tasks in progress vs executing', 'Parallelism: run-time property', 'Requires multiple cores/processors', 'Parallelism requires concurrency'],
    modelAnswer: [
      '**Concurrency** is a property of how a program is designed: two or more tasks can be in progress at the same time, each able to progress without waiting for the others to finish. They need not run at the same instant. On a single core, they may take turns.',
      '**Parallelism** is a run-time property: two or more tasks actually execute simultaneously. This is only possible with suitable hardware, such as multiple cores, multiple processors or GPUs.',
      '**P ⊂ C** means that every parallel execution is concurrent (tasks running simultaneously are certainly in progress together), but a concurrent program need not run in parallel. For example, two interleaved tasks on one core are concurrent but not parallel.',
    ],
    whyItMatters: 'This distinction is frequently confused. The subset relation is a compact way to show that you understand it.',
  },
  {
    id: 'l04-e04',
    style: 'compare-contrast',
    prompt: 'Define data-parallel and task-parallel problems using the lecture\'s notation, and explain which hardware (CPU or GPU) suits each.',
    keyConcepts: ['Domain decomposition D = Σ dᵢ', 'f(D) = Σ f(dᵢ)', 'D(S) = Σ dᵢ(S)', 'GPU: same instructions, different data', 'CPU: different task per thread'],
    modelAnswer: [
      'Parallel computing divides a problem\'s domain D into k ≥ 2 parts, D = d₁ + … + d_k, solved by p processors simultaneously.',
      'A problem is **data-parallel** when D consists of data elements and the solution applies one kernel f to all of them: f(D) = f(d₁) + … + f(d_k). Computational physics problems are typical examples. They suit the **GPU**, whose architecture works best when all threads execute the same instructions on different data.',
      'A problem is **task-parallel** when D consists of functions applied to a common data stream S: D(S) = d₁(S) + … + d_k(S). It suits the **CPU**, which allows each thread to execute a different task.',
    ],
    whyItMatters: 'Identifying the problem type is the first step in choosing an algorithm and hardware. The formulas show precision.',
  },
  {
    id: 'l04-e05',
    style: 'discuss',
    prompt: 'Why is theoretical complexity (Big-O) alone not enough to judge parallel algorithms? How should benchmarking be used?',
    keyConcepts: ['Big-O ignores constants', 'Hardware: cores, clock, bandwidth', 'Parallel overhead: synchronisation, communication', 'I/O limits', 'Benchmark sequential vs parallel', 'Combine both'],
    modelAnswer: [
      'Big-O describes how operation counts grow with input size, ignoring constants and lower-order terms. That is useful for choosing algorithms, but it ignores how real systems behave.',
      'Parallel performance depends on the number of cores, clock speeds and especially **memory bandwidth**. Managing tasks, synchronising data and communicating between processors adds **overhead** that reduces speedup. Disk or network access can dominate regardless of complexity.',
      '**Benchmarking** measures the actual execution times of the sequential and parallel versions with a suitable (wall-clock) timer, revealing speedup, overhead and utilisation. Practitioners should combine complexity analysis, which shows scaling behaviour, with benchmarking, which shows real bottlenecks.',
    ],
    whyItMatters: 'It explains why the course measures speedup and efficiency empirically instead of trusting asymptotic analysis.',
  },
  {
    id: 'l04-e06',
    style: 'process',
    prompt: 'Explain Knuth\'s advice "premature optimization is the root of all evil" and describe the iterative cycle for optimising serial code before parallelising it.',
    keyConcepts: ['Best algorithm first', 'Hotspots', 'Profile (gprof, perf, valgrind)', 'Find critical code', 'Optimise', 'Repeat', 'Ignore non-bottlenecks'],
    modelAnswer: [
      'Knuth\'s advice warns against optimising code before you know where the time goes. Start from the best algorithm, then improve performance incrementally and deliberately.',
      'The cycle: (1) **profile** the program with tools such as gprof, perf or valgrind (for example, finding that an air-pressure function takes 80% of the runtime); (2) **identify the critical code**, the hotspot, and look for redundant work; (3) **optimise** it; (4) **repeat**, because a new bottleneck may appear.',
      'Parts that are not bottlenecks are left alone. Hotspots are also where parallelisation is considered, but whether a hotspot can be parallelised depends on the nature of its work.',
    ],
    whyItMatters: 'Serial optimisation comes before parallelisation. Parallelising inefficient code just multiplies the waste.',
  },
  {
    id: 'l04-e07',
    style: 'trace-code',
    prompt: 'Explain why the first loop below causes cache thrashing and the second does not.',
    code: `for (int i = 0; i < 1024; i++)
    for (int j = 0; j < 1024; j++)
        matrix[j][i] = i + j;   // version 1

for (int i = 0; i < 1024; i++)
    for (int j = 0; j < 1024; j++)
        matrix[i][j] = i + j;   // version 2`,
    keyConcepts: ['Row-major storage', 'Stride between accesses', 'Cache lines', 'Spatial locality', 'Measured ~10× difference'],
    modelAnswer: [
      'C stores 2-D arrays in **row-major** order, so the elements of one row are adjacent in memory.',
      'In version 1 the inner loop varies the **row** index j, so consecutive accesses are 1024 ints (4 KB) apart. Each access touches a different cache line, and lines are evicted before their other elements are used. This is cache thrashing.',
      'Version 2 varies the **column** index in the inner loop, so it walks consecutive addresses. Every cache line loaded is fully used (good spatial locality).',
      'The lecture\'s run shows the cache-friendly version roughly 10× faster, even though both loops do exactly the same amount of work in Big-O terms.',
    ],
    whyItMatters: 'It is a concrete example of why real performance differs from theoretical complexity, and of the memory issues raised in Lecture 2.',
  },
  {
    id: 'l04-e08',
    style: 'compare-contrast',
    prompt: 'Define granularity and compare coarse-grained and fine-grained parallelism. How can granularity be measured in practice?',
    keyConcepts: ['G = T_comp / T_comm', 'High G = coarse', 'Low G = fine', 'Load imbalance', 'Communication overhead', 'Profiling timers/tools'],
    modelAnswer: [
      'Granularity is the ratio of computation to communication: **G = T_comp / T_comm**, where T_comp is the time spent on useful work and T_comm is the time spent exchanging data or synchronising.',
      '**Coarse-grained** parallelism (high G) splits the program into a few large tasks with lots of computation between communication events. Overhead is low, but load imbalance can leave some processors idle while others process most of the data.',
      '**Fine-grained** parallelism (low G) splits the program into many small tasks spread over many processors. This allows wide distribution, but communication and synchronisation overhead can dominate, especially as the system scales.',
      'To measure G, profile computation and communication separately using `MPI_Wtime()`, OpenMP timers or tools such as Vampir, Intel VTune or Valgrind. Higher G usually gives better parallel performance.',
    ],
    whyItMatters: 'Granularity is in the lecture title and connects directly to scalability (Lecture 3) and to choosing task sizes in OpenMP.',
  },
  {
    id: 'l04-e09',
    style: 'process',
    prompt: 'Explain the DAG execution model using merge sort. How does a DAG help a scheduler, and what happens with 2 cores versus 4 cores?',
    keyConcepts: ['Nodes = tasks', 'Edges = dependencies', 'Independent nodes run in parallel', 'Levels of the split tree', 'Merge waits for children', 'Overhead for small inputs'],
    modelAnswer: [
      'A DAG (directed acyclic graph) models an algorithm as **nodes** (tasks such as split, sort or merge) connected by **edges** (dependencies). An edge from X to Y means Y cannot start until X has finished.',
      'In merge sort, the array splits into halves, quarters and so on. Tasks on the same level do not depend on each other, so they can run in parallel. A merge must wait until both halves beneath it are sorted.',
      'A scheduler uses the DAG to see which tasks are ready. With **2 cores**, the two halves are processed in parallel. With **4 cores**, the four quarters can be processed at the same time. Further down the tree there are more ready tasks than cores.',
      'Benchmarking shows that for small arrays the overhead can make the parallel version slower, while for large arrays with evenly distributed work it reduces execution time significantly.',
    ],
    whyItMatters: 'DAGs are the standard way to reason about dependencies and available parallelism in an algorithm.',
  },
];
