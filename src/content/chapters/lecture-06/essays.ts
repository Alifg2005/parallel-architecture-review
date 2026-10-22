import type { EssayQuestion } from '../../schema';

export const essays: EssayQuestion[] = [
  {
    id: 'l06-e01',
    style: 'define-explain',
    prompt: 'What is OpenMP? Describe its three components, and state what OpenMP will and will not do for the programmer.',
    keyConcepts: ['Shared-memory, multi-threaded API', 'Directives ≈80%', 'Library calls ≈19%', 'Environment variables ≈1%', 'Serial and parallel regions', 'No dependency detection, no guaranteed speedup, no race freedom'],
    modelAnswer: [
      'OpenMP (Open Multi-Processing) is an open, standard, high-level API for writing multi-threaded **shared-memory** programs in C/C++ or Fortran. It requires compiler support.',
      'It has three components: **compiler directives** (about 80%, for example `#pragma omp parallel`), **runtime library routines** (about 19%, for example `omp_get_thread_num()`), and **environment variables** (about 1%, for example `OMP_NUM_THREADS`).',
      'OpenMP **will** let the programmer divide a program into serial and parallel regions instead of managing individual threads, hide stack management, and provide synchronisation constructs.',
      'OpenMP **will not** parallelise or detect dependencies, guarantee speedup, or make the program free of data races. Correctness remains the programmer\'s responsibility.',
    ],
    whyItMatters: 'The "will not" list is a favourite exam point, because it stops you treating OpenMP as automatic parallelisation.',
    structure: ['Definition', 'Three components with examples', 'Will', 'Will not'],
  },
  {
    id: 'l06-e02',
    style: 'compare-contrast',
    prompt: 'Compare writing "Hello world from each thread" with Pthreads and with OpenMP. Why is OpenMP considered easier, and what bug does the Pthreads version contain?',
    keyConcepts: ['Manual create/join', 'void* casting', 'Passing &i is error-prone', '#pragma omp parallel private(tid)', 'omp_get_thread_num', 'Implicit join'],
    modelAnswer: [
      'With **Pthreads**, the programmer declares arrays of `pthread_t`, loops to call `pthread_create` with a start routine of type `void *(void *)`, casts the argument back inside the routine, and loops again to call `pthread_join`. That is many calls, with explicit typecasting and careful memory management.',
      'The lecture\'s version passes `&i`, the address of the loop variable, to every thread. The threads read `i` later, after the loop may have changed it, so they can print wrong or duplicate IDs. Passing `&thread_ids[i]` would fix it.',
      'With **OpenMP**, the serial program gains one directive: `#pragma omp parallel private(tid)` forks a team, each thread gets its own `tid`, calls `omp_get_thread_num()`, and prints. The join happens implicitly at the end of the block.',
      'OpenMP is easier because thread creation, argument passing and joining are handled by the compiler and runtime. Synchronisation is still the programmer\'s concern.',
    ],
    whyItMatters: 'It shows why the course moves from Pthreads to OpenMP, and tests code reading in both models.',
  },
  {
    id: 'l06-e03',
    style: 'compare-contrast',
    prompt: 'Explain the OpenMP data-sharing attributes shared, private, firstprivate, lastprivate and reduction. Give the result of a small example for each where possible.',
    keyConcepts: ['shared: one copy, race risk', 'private: uninitialised copy', 'firstprivate: initialised copy', 'lastprivate: last iteration copied out', 'reduction: copies combined'],
    modelAnswer: [
      '**shared:** all threads access the same variable. For example, `sum += 10` from every thread updates one `sum`, but without protection this is a race.',
      '**private:** each thread gets its own **uninitialised** copy. For example, `x = omp_get_thread_num()` gives each thread its own x, and the original is unaffected.',
      '**firstprivate:** like private, but each copy is **initialised** from the value before the region. With x = 5, every thread prints 5.',
      '**lastprivate:** like private, but after a loop or sections, the value from the **last iteration** is copied back. In `for (i = 0; i < 4; i++) x = i;`, x ends as 3.',
      '**reduction(op:v):** each thread accumulates into a private copy, and at the end the copies are combined with op into v. `reduction(+:sum)` over i = 0…99 gives 4950 without a race.',
    ],
    whyItMatters: 'Choosing the right clause is the most common source of OpenMP bugs, and the most common "predict the output" question.',
  },
  {
    id: 'l06-e04',
    style: 'compare-contrast',
    prompt: 'Compare critical sections, atomic operations and explicit locks in OpenMP. When would you use each?',
    keyConcepts: ['critical: any block, one thread at a time', 'Named vs unnamed', 'atomic: single scalar update, cheap', 'expr not atomic', 'Locks: init/set/unset/destroy/test', 'Fine-grained control'],
    modelAnswer: [
      '`#pragma omp critical` lets only one thread at a time execute a block of any size. Unnamed critical sections are mutually exclusive across the whole program, while named ones exclude only sections with the same name. They are easy to write and suit protecting small pieces of code, but they can carry more overhead and offer less control.',
      '`#pragma omp atomic` protects a **single update of a scalar variable** (`x += e`, `x++`, …). It is often implemented with one hardware instruction, so it is cheaper than critical. Only the update is atomic, not the evaluation of the expression.',
      '**Explicit locks** (`omp_init_lock`, `omp_set_lock`, `omp_unset_lock`, `omp_destroy_lock`, `omp_test_lock`) are lock variables managed by the programmer. They give fine-grained control, for example over which data each lock protects, or trying a lock without waiting. They suit larger or more complex synchronisation.',
      'Rule of thumb: use atomic for a single counter, critical for a short block, and locks when you need precise control.',
    ],
    whyItMatters: 'Synchronisation choices affect both correctness and performance. The lecture\'s comparison table is likely to be examined.',
  },
  {
    id: 'l06-e05',
    style: 'compare-contrast',
    prompt: 'Distinguish the single, master and barrier directives. Use the lecture\'s preprocessing / reading / processing example.',
    keyConcepts: ['single: one arbitrary thread', 'Implicit wait after single', 'master: thread 0 only', 'No wait after master', 'barrier: all must arrive'],
    modelAnswer: [
      '`#pragma omp single` makes exactly one thread, whichever arrives first and not necessarily the master, execute the block. The other threads **wait** at the end of the single block until it completes. In the example, input is read once (by Thread 4 in the sample run) before anyone starts processing.',
      '`#pragma omp master` makes only the master thread (ID 0) execute the block. The other threads **do not wait**, and no synchronisation occurs. In the example, Thread 0 prints "notifying input consumed" while other threads may already be processing.',
      '`#pragma omp barrier` is an explicit synchronisation point that every thread in the team must reach before any can continue. For example, all threads add their partial results to `sum` before anyone uses `sum` in part 2.',
    ],
    whyItMatters: 'Single and master look alike, and examiners test the "who executes / who waits" difference directly.',
  },
  {
    id: 'l06-e06',
    style: 'process',
    prompt: 'Describe the OpenMP fork–join execution model, including what happens at the start and end of a parallel region and how thread pools reduce overhead.',
    keyConcepts: ['Master thread runs serial code', 'Fork a team at the parallel region', 'Code duplicated across threads', 'Implied barrier / join', 'Only the master continues', 'Thread pool reuse; workers spin'],
    modelAnswer: [
      'Execution begins with a single **master thread** that runs the serial parts of the program.',
      'At a parallel construct, the master **forks** a team of threads (by default, one per core) and becomes the team\'s master. The code inside the region is duplicated, and every thread executes it.',
      'At the end of the region there is an **implied barrier**: the threads synchronise and **join**, and only the master continues with the next serial part. The lecture\'s example forks teams of 3, 4 and 2 threads in turn, printing serial lines in between.',
      'Creating and destroying threads for every region would be expensive, so implementations keep a **thread pool**: workers are created once, spin waiting for the next fork, and are reused. Creating many more threads than cores still hurts, because of context switches (saving and restoring thread state).',
    ],
    whyItMatters: 'Fork–join is the core mental model of OpenMP. It explains implicit barriers and why only the master thread runs serial code.',
  },
  {
    id: 'l06-e07',
    style: 'advantages-limitations',
    prompt: 'What is nested parallelism in OpenMP? How is it enabled, what are its advantages and drawbacks, and when should it be used?',
    keyConcepts: ['Parallel region inside a parallel region', 'omp_set_nested(1)', 'Finer granularity / control', 'Thread explosion, context switching', 'Frequent joins', 'Matrix multiply, QuickSort, multi-level simulations'],
    modelAnswer: [
      'Nested parallelism allows threads inside a parallel region to fork their own teams, creating nested parallel regions. It is enabled with `omp_set_nested(1)`. With 2 outer threads that each start an inner team of 2, there are 4 inner executions.',
      '**Advantages:** better control of algorithms with several levels of parallelism, the ability to give different tasks different amounts of parallelism, and the ability to adapt to available resources.',
      '**Drawbacks:** the thread count multiplies quickly, which leads to diminishing returns from context switching and resource contention. Each extra level adds more joins, which can slow the program.',
      'Use it only when a task inside a parallel region genuinely needs more parallelism, for example matrix multiplication (rows, then elements), recursive QuickSort, or simulations with nested subsystems.',
    ],
    whyItMatters: 'It tests your judgement about thread counts, which ties back to oversubscription and context-switch overhead.',
  },
  {
    id: 'l06-e08',
    style: 'trace-code',
    prompt: 'Trace the program below on 8 threads. What is the final value of shared_var, why is the critical directive needed, and is the order of the thread lines fixed?',
    code: `int shared_var = 0, private_var = 0;
#pragma omp parallel shared(shared_var) private(private_var)
{
    private_var = omp_get_thread_num();
    #pragma omp critical
    { shared_var += private_var; }
    printf("Thread %d, private_var: %d\\n", omp_get_thread_num(), private_var);
}
printf("Final shared_var: %d\\n", shared_var);`,
    keyConcepts: ['private copy per thread', 'IDs 0..7', 'Sum = 28', 'Critical prevents lost updates', 'Nondeterministic print order', 'Final line after implicit join'],
    modelAnswer: [
      'Each of the 8 threads has its own `private_var`, set to its ID (0 to 7). Each adds its ID to the single shared `shared_var`.',
      'The final value is 0 + 1 + … + 7 = **28**, printed once by the master after the region\'s implicit join.',
      '`shared_var += private_var` is a read-modify-write. Without `critical` (or `atomic`, or a `reduction`), two threads could read the same old value and one addition would be lost, giving a total below 28. The critical section serialises these updates.',
      'The order of the "Thread k" lines is **not fixed**. It depends on scheduling, as the lecture\'s sample output (0, 6, 4, 3, …) shows.',
    ],
    whyItMatters: 'It combines data-sharing clauses, synchronisation and fork–join in one short trace, which makes it a typical exam item.',
  },
  {
    id: 'l06-e09',
    style: 'process',
    prompt: 'How can a programmer control the number of threads and the granularity of OpenMP parallel regions? Include how to decide on a sensible thread count.',
    keyConcepts: ['omp_set_num_threads', 'num_threads clause', 'if clause', 'OMP_NUM_THREADS', 'Cores vs logical processors', 'omp_get_num_procs'],
    modelAnswer: [
      '**Thread count:** call `omp_set_num_threads(n)` before a region (runtime routine), add a `num_threads(n)` clause to one region, or set the `OMP_NUM_THREADS` environment variable. Otherwise OpenMP uses its default, typically the number of cores. `omp_set_num_threads(omp_get_num_procs())` matches threads to available processors.',
      '**Granularity:** the `if(expr)` clause (for example, `#pragma omp parallel if(n > 5)`) disables parallel execution when the input is too small to benefit, avoiding overhead.',
      '**Choosing a count:** check physical cores and logical processors (for example, with `wmic`, CPU Get NumberOfCores, NumberOfLogicalProcessors). If logical processors are double the cores, hyper-threading is on. Using more threads than logical processors adds context switching and contention, so a thread count equal to or slightly above the logical processor count is usually best.',
    ],
    whyItMatters: 'It connects OpenMP controls to the hardware topics (cores, hyper-threading) and to granularity from Lecture 4.',
  },
];
