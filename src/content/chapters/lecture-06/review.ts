import type { ReviewSection } from '../../schema';

export const sections: ReviewSection[] = [
  {
    id: 'what-is-openmp',
    title: 'What is OpenMP?',
    blocks: [
      {
        type: 'paragraph',
        text: '**OpenMP (Open Multi-Processing)** is an open specification and the "standard" API for writing **multi-threaded, shared-memory** programs. It is a **high-level** API with three components:',
      },
      {
        type: 'table',
        columns: ['Component', 'Share of the API', 'Example'],
        rows: [
          ['Compiler (preprocessor) directives', '≈ 80%', '`#pragma omp parallel`'],
          ['Runtime library calls', '≈ 19%', '`omp_get_thread_num()`'],
          ['Environment variables', '≈ 1%', '`OMP_NUM_THREADS`'],
        ],
      },
      {
        type: 'paragraph',
        text: 'The **solution stack** has layers. At the top, the end user runs the application. The programmer uses directives with the compiler, the OpenMP library and environment variables. Below that, the OpenMP runtime library and OS support for shared memory and threading sit on hardware with processors 1…N sharing a **single address space**.',
      },
      {
        type: 'table',
        columns: ['OpenMP will…', 'OpenMP will NOT…'],
        rows: [
          ['Let you split a program into **serial and parallel regions**, rather than managing T concurrently executing threads', 'Parallelise or even **detect dependencies**'],
          ['Hide stack management', '**Guarantee speedup**'],
          ['Provide **synchronisation constructs**', 'Provide **freedom from data races**'],
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        text: 'OpenMP is portable with a "light" syntax, but it **requires compiler support** (C/C++ or Fortran), and exact behaviour can depend on the implementation.',
      },
    ],
  },
  {
    id: 'why-not-pthreads',
    title: 'Why not just use Pthreads?',
    blocks: [
      {
        type: 'list',
        items: [
          'Pthreads libraries are **hard to use**: there are many calls for initialisation, synchronisation, thread creation, condition variables and so on.',
          'The programmer must write code with multiple threads in mind, and **synchronisation adds a new dimension of program correctness**.',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'The old way: Pthreads',
        code: `#define NUM_THREADS 4
void *run(void *threadID) {
    int tid = *((int *)threadID);
    printf("Hello, world from pthread %d\\n", tid);
    pthread_exit(NULL);
}
int main(void) {
    pthread_t threads[NUM_THREADS];
    int thread_ids[NUM_THREADS];
    for (int i = 0; i < NUM_THREADS; i++) {
        thread_ids[i] = i;
        pthread_create(&threads[i], NULL, run, &i);   // passes &i (error-prone!)
    }
    for (int i = 0; i < NUM_THREADS; i++)
        pthread_join(threads[i], NULL);
    return 0;
}`,
        explanation: [
          'Tedious: manual creation and joining, typecasting, and careful memory management.',
          'Bug risk: passing `&i` means every thread reads the **same** loop variable, which may already have changed. Passing `&thread_ids[i]` would be correct.',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'OpenMP instead: serial code plus a directive',
        code: `#include <omp.h>
#include <stdio.h>

int main(void) {
    int tid;
    omp_set_num_threads(4);              // request 4 threads

    /* Fork a team of threads; each gets its own copy of tid */
    #pragma omp parallel private(tid)
    {
        tid = omp_get_thread_num();      // which thread am I?
        printf("Hello, world from thread = %d\\n", tid);
    }   /* All threads synchronise; the master thread continues */
    return 0;
}`,
        explanation: [
          '**Directive:** `#pragma omp parallel` forks a team of threads to run the block. `private(tid)` gives each thread its own `tid`.',
          '**Runtime routine:** `omp_get_thread_num()` returns the calling thread\'s number. The master is **0**, and the others are numbered sequentially.',
          '`omp_set_num_threads(4)` is called before the region. Without it, OpenMP uses its default, typically the number of cores the system reports.',
          'Precision note: the slide labels `omp_set_num_threads` as an environment variable. It is actually a **runtime library routine**. The equivalent environment variable is `OMP_NUM_THREADS`.',
        ],
      },
    ],
  },
  {
    id: 'syntax-and-compiling',
    title: 'Directive syntax and compiling',
    blocks: [
      {
        type: 'formula',
        label: 'Directive format',
        expression: '#pragma omp <directive-name> [clause [clause] ...]',
        note: '`#pragma omp` is required for every C/C++ OpenMP directive. The directive name must come next, before any clauses. Clauses are optional and can appear in any order. Example: `#pragma omp parallel num_threads(4) shared(list)`.',
      },
      {
        type: 'paragraph',
        text: '`#pragma` is the C standard\'s way of giving the compiler extra information beyond the language itself. Pragmas are compiler-specific. The **parallel** pragma instructs **every thread to execute all of the code inside the block**.',
      },
      {
        type: 'code',
        language: 'shell',
        title: 'Compile with GCC / G++',
        code: `g++ -fopenmp example.cpp -o program
./program`,
        explanation: [
          '`-fopenmp` enables OpenMP support. Most modern gcc/g++ installations need nothing else.',
          'Without the flag, the pragmas are ignored and the program runs serially.',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Check whether OpenMP is available',
        code: `#include <stdio.h>
int main(void) {
#ifdef _OPENMP
    printf("OpenMP is supported! Version: %d\\n", _OPENMP);
#else
    printf("OpenMP is not supported!\\n");
#endif
    return 0;
}`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'How many threads? Cores vs logical processors',
        text: 'On Windows, `wmic` → `CPU Get NumberOfCores, NumberOfLogicalProcessors` (or Task Manager / `dxdiag`) shows both values. **4 cores with 8 logical processors** means hyper-threading is on (2 threads per core). Beyond that, context switching and resource contention stop gains from being linear. A good rule is a thread count equal to, or slightly above, the number of logical processors.',
      },
    ],
  },
  {
    id: 'data-attributes',
    title: 'Data-sharing attributes',
    blocks: [
      {
        type: 'table',
        columns: ['Clause', 'Each thread sees', 'After the region', 'Typical scope'],
        rows: [
          ['`shared(v)`', 'The **same** variable as all other threads', 'Holds whatever the threads wrote', 'Any construct. **Beware of races.**'],
          ['`private(v)`', 'Its own copy, **uninitialised**', 'The original is unaffected', 'Any construct'],
          ['`firstprivate(v)`', 'Its own copy, **initialised** with the value from before the region', 'The original is unaffected', 'Any construct'],
          ['`lastprivate(v)`', 'Its own copy', 'The value from the **last iteration** is copied back', 'Loops and work-sharing constructs (sections)'],
          ['`reduction(op:v)`', 'Its own copy', 'All copies are **combined** with op into the original', 'Mostly loops (`+`, `*`, `&`, `|`, `^`, …)'],
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Clause examples from the lecture',
        code: `int x = 5;
#pragma omp parallel firstprivate(x)
{ printf("%d ", x); }                 // every thread prints 5

int y = 0;
#pragma omp parallel for lastprivate(y)
for (int i = 0; i < 4; i++) y = i;    // afterwards y == 3

int sum = 0;
#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < 100; i++) sum += i;   // afterwards sum == 4950`,
        explanation: [
          '`firstprivate` copies in the starting value. Plain `private` would leave each copy uninitialised.',
          '`lastprivate` copies out the value from the sequentially last iteration (i = 3).',
          '`reduction` avoids a race: each thread sums its share privately, and the partial sums are added at the end (0 + 1 + … + 99 = 4950).',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Combining attributes',
        code: `int shared_var = 0;
int private_var = 0;

#pragma omp parallel shared(shared_var) private(private_var)
{
    private_var = omp_get_thread_num();
    #pragma omp critical
    {
        shared_var += private_var;
    }
    printf("Thread %d, private_var: %d\\n", omp_get_thread_num(), private_var);
}
printf("Final shared_var: %d\\n", shared_var);`,
        explanation: [
          'With 8 threads (IDs 0–7), each thread adds its own ID to the shared total inside a critical section.',
          'Final `shared_var` = 0 + 1 + … + 7 = **28**. The thread lines print in an unpredictable order.',
          'Without `critical`, two threads could update `shared_var` at the same time and lose an addition.',
        ],
      },
    ],
  },
  {
    id: 'synchronisation',
    title: 'Synchronisation: critical, atomic, barrier, locks',
    blocks: [
      {
        type: 'definitions',
        items: [
          {
            term: '`#pragma omp critical [name]`',
            definition:
              'Only one thread executes the block at a time. Critical sections are **global** in the program and can protect a resource used in different functions. **Unnamed** critical sections are mutually exclusive across the whole program. **Named** ones with the same name exclude only each other. Use them for simple synchronisation.',
          },
          {
            term: '`#pragma omp atomic`',
            definition:
              '"Critical sections on the cheap": protects a **single scalar variable update**, often using a dedicated hardware instruction. Allowed forms: `var = var op expr`, `var op= expr`, `var++`, `var--`, with op in + − * / ^ & | << >>. **The evaluation of `expr` itself is not atomic.**',
          },
          {
            term: '`#pragma omp barrier`',
            definition: 'A point that **all threads in the team must reach before any can continue**.',
          },
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'atomic plus barrier',
        code: `#pragma omp parallel
{
    int result = heavy_computation_part1();
    #pragma omp atomic
    sum += result;                     // safe single update
    #pragma omp barrier                // wait until every thread has added
    heavy_computation_part2(sum);      // now sum is complete
}`,
      },
      {
        type: 'table',
        caption: 'Explicit lock functions (used for fine-grained synchronisation).',
        columns: ['Function', 'Purpose'],
        rows: [
          ['`omp_init_lock(&l)`', 'Initialise a lock'],
          ['`omp_set_lock(&l)`', 'Acquire (set) the lock, waiting if another thread holds it'],
          ['`omp_unset_lock(&l)`', 'Release the lock'],
          ['`omp_destroy_lock(&l)`', 'Destroy the lock'],
          ['`omp_test_lock(&l)`', 'Try to set the lock **without waiting**'],
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Slide discrepancy',
        text: 'The lecture\'s list pairs `omp_destroy_lock`, `omp_set_lock` and `omp_unset_lock` with the wrong descriptions (shifted by one line). The table above shows the correct meanings, which also match the lecture\'s own code example (init → set → unset → destroy).',
      },
      {
        type: 'code',
        language: 'c',
        title: 'Explicit locking example',
        code: `int sum = 0;
omp_lock_t my_lock;
omp_init_lock(&my_lock);

#pragma omp parallel for
for (int i = 0; i < 100; i++) {
    omp_set_lock(&my_lock);      // acquire
    sum += i;
    omp_unset_lock(&my_lock);    // release
}

omp_destroy_lock(&my_lock);
printf("Final sum: %d\\n", sum);  // 4950`,
      },
      {
        type: 'table',
        columns: ['Feature', 'Critical sections', 'Explicit locking'],
        rows: [
          ['Ease of use', 'Easier: just `#pragma omp critical`', 'More control, through functions (`omp_set_lock`, …)'],
          ['Granularity / control', 'Less control; global in scope', 'Fine-grained control over locking behaviour'],
          ['Performance', 'May have more overhead because of implicit behaviour', 'Can be optimised for specific critical sections'],
          ['Best for', 'Protecting small sections of code', 'Larger, complex synchronisation needs'],
        ],
      },
    ],
  },
  {
    id: 'work-sharing',
    title: 'Work sharing and controlling parallelism',
    blocks: [
      {
        type: 'code',
        language: 'c',
        title: 'sections: run independent blocks in parallel',
        code: `#pragma omp parallel sections
{
    #pragma omp section
    answer1 = long_computation_1();
    #pragma omp section
    answer2 = long_computation_2();
}
if (answer1 != answer2) { /* ... */ }`,
        explanation: [
          'The two computations are independent, so each `section` can run on a different thread.',
          'The slide shows `#pragma omp sections` alone. Inside an existing parallel region that works, and on its own you write `#pragma omp parallel sections`.',
        ],
      },
      {
        type: 'definitions',
        items: [
          {
            term: '`#pragma omp parallel if (expr)`',
            definition: 'Run the region in parallel **only if** `expr` is true, for example `if(n > 5)`. This avoids threading overhead when the input is too small to benefit.',
          },
          {
            term: '`num_threads(expr)` clause',
            definition: 'Sets the number of threads for **this** parallel region, for example `#pragma omp parallel num_threads(3)`.',
          },
          {
            term: 'Timing with `omp_get_wtime()`',
            definition: 'Returns wall-clock time in seconds: `start = omp_get_wtime(); … end = omp_get_wtime(); printf("%f", end - start);`',
          },
        ],
      },
    ],
  },
  {
    id: 'master-single',
    title: 'master vs single',
    blocks: [
      {
        type: 'table',
        columns: ['', '`#pragma omp single`', '`#pragma omp master`'],
        rows: [
          ['Who executes the block', '**One** thread, not necessarily the master', 'Only the **master thread (ID 0)**'],
          ['Do the other threads wait?', '**Yes**: they wait until the single block completes', '**No**: there is no synchronisation'],
          ['Typical use', 'Read input or print output once', 'Work reserved for the master, such as notifications'],
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Single vs master in one region',
        code: `#pragma omp parallel
{
    int id = omp_get_thread_num();
    printf("Thread %d is preprocessing\\n", id);     // all threads

    #pragma omp single
    printf("Single thread (Thread %d) is reading input\\n", id);

    #pragma omp master
    printf("Master thread (Thread %d) is notifying input consumed\\n", id);

    printf("Thread %d is processing\\n", id);       // all threads
}`,
        explanation: [
          'The "reading input" line appears once, from whichever thread arrives first (Thread 4 in the lecture\'s run).',
          'Every thread waits after `single`, so no thread prints "processing" before the input line.',
          'The "notifying" line always comes from Thread 0, and the other threads may already be "processing" meanwhile.',
        ],
      },
    ],
  },
  {
    id: 'fork-join',
    title: 'The fork–join execution model',
    blocks: [
      {
        type: 'list',
        ordered: true,
        items: [
          'The program starts as a **single master thread**, which executes the serial parts.',
          'At a **parallel region**, the master **forks** a team of threads and becomes the master of that team. By default there are as many threads as cores.',
          'The code in the region is **duplicated**: all threads execute it.',
          'At the end of the region there is an **implied barrier**. The threads synchronise (**join**), and **only the master continues**.',
          'Implementation optimisation: worker threads **spin, waiting for the next fork**, instead of being destroyed.',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Several regions with different team sizes',
        code: `printf("Starting execution by master thread\\n");

#pragma omp parallel num_threads(3)
printf("First parallel region: Thread %d is executing\\n", omp_get_thread_num());
// implicit join
printf("Back to serial execution by master thread\\n");

#pragma omp parallel num_threads(4)
printf("Second parallel region: Thread %d is executing\\n", omp_get_thread_num());

#pragma omp parallel num_threads(2)
printf("Third parallel region: Thread %d is executing\\n", omp_get_thread_num());

printf("Final serial execution by master thread\\n");`,
        explanation: [
          'The output alternates between serial lines (master only) and 3, 4 and then 2 lines from each team.',
          'The serial lines always appear between regions because of the implicit join.',
        ],
      },
    ],
  },
  {
    id: 'thread-pool',
    title: 'Thread pools and context switches',
    blocks: [
      {
        type: 'paragraph',
        text: 'A **thread pool** is a group of threads that are **created once and reused** many times, which avoids the cost of creating and destroying threads for every parallel region. Tasks wait in a **task queue**. A fixed set of pool threads picks up tasks, executes them, and becomes available again for the next one.',
      },
      {
        type: 'list',
        items: [
          'OpenMP implementations use a thread pool, so the **full cost of thread creation and destruction is not paid for each parallel region**. In the lecture\'s example, the 4 threads requested by `omp_set_num_threads(4)` serve both parallel regions.',
          '**Excess threads degrade performance** through memory use, context switches and other resource overhead.',
          'A **context switch** happens when a CPU switches from one thread to another. With more threads than cores, switches are frequent, and each one saves and restores thread state, costing time and memory.',
        ],
      },
    ],
  },
  {
    id: 'nested',
    title: 'Nested parallelism',
    blocks: [
      {
        type: 'paragraph',
        text: '**Nested parallelism** lets threads in a parallel region create their own parallel regions (forks inside forks). It gives more control over the thread hierarchy and finer granularity. Nesting is handled at compile time and enabled with `omp_set_nested(1);`.',
      },
      {
        type: 'code',
        language: 'c',
        title: 'Two levels of two threads',
        code: `omp_set_nested(1);                         // enable nested parallelism

#pragma omp parallel num_threads(2)
{
    int outer = omp_get_thread_num();
    printf("Outer thread: %d\\n", outer);

    #pragma omp parallel num_threads(2)
    {
        int inner = omp_get_thread_num();
        printf("  Inner thread: %d (from outer thread %d)\\n", inner, outer);
    }
}`,
        explanation: [
          '2 outer threads, each forking a team of 2, give **4 inner lines**.',
          'Inner thread numbers restart at 0 in each inner team.',
          'If nesting is not enabled, each inner region runs with a team of one, so only 2 inner lines appear.',
          'Background: newer OpenMP versions deprecate `omp_set_nested` in favour of `omp_set_max_active_levels`. For the exam, use the lecture\'s call.',
        ],
      },
      {
        type: 'table',
        columns: ['Advantages', 'Cautions'],
        rows: [
          ['Better control of algorithms that need several levels of parallelism', 'Too many threads lead to diminishing returns, because of context switching and resource contention'],
          ['Tasks can use different levels of parallelism', 'More levels mean more frequent joins, which can slow the program'],
          ['Execution can adapt to the system\'s resources', 'Use it only when a task inside a parallel region really needs further parallelism'],
        ],
      },
      {
        type: 'callout',
        tone: 'example',
        title: 'Good candidates',
        items: [
          'Matrix multiplication: rows in parallel, and element-wise products in parallel within each row.',
          'QuickSort: each recursive call spawns new parallel tasks.',
          'Simulations with several levels of subsystems (for example, physics).',
        ],
      },
    ],
  },
  {
    id: 'runtime-routines',
    title: 'Useful runtime routines',
    blocks: [
      {
        type: 'table',
        columns: ['Routine', 'Purpose'],
        rows: [
          ['`omp_set_num_threads(n)`', 'Set the number of threads for later parallel regions'],
          ['`omp_get_thread_num()`', 'Which thread am I? (the master is 0)'],
          ['`omp_get_max_threads()`', 'Maximum number of available threads'],
          ['`omp_get_num_procs()`', 'How many processors are available?'],
          ['`omp_in_parallel()`', 'Am I currently inside a parallel region?'],
          ['`omp_set_dynamic(int)` / `omp_get_dynamic()`', 'Allow the implementation to adjust the thread count dynamically'],
          ['`omp_set_nested(int)` / `omp_get_nested()`', 'Enable or query nested parallelism'],
          ['`omp_get_wtime()`', 'Portable wall-clock time'],
        ],
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'Practice question from the lecture',
        text: 'Set the number of threads equal to the number of available processors: `omp_set_num_threads(omp_get_num_procs());`',
      },
    ],
  },
];

export const examPoints: string[] = [
  'OpenMP is roughly **80% directives, 19% library calls and 1% environment variables**. It does **not** detect dependencies, guarantee speedup or prevent data races.',
  '`private` copies are **uninitialised**. `firstprivate` copies **in** the starting value. `lastprivate` copies **out** the last iteration\'s value. `reduction` **combines** the private copies.',
  '`atomic` = a single scalar update (cheap). `critical` = any block, one thread at a time. Unnamed critical sections exclude program-wide, and named ones exclude only sections with the same name.',
  '`single` = any one thread, and the others **wait**. `master` = thread 0 only, and the others **do not wait**.',
  '`barrier` = every thread must arrive before any thread continues. Every parallel region ends with an **implied barrier**.',
  'Fork–join: the master forks a team, the team runs the code, the threads join at the implicit barrier, and only the master continues.',
  'Thread pools reuse threads across regions. Too many threads cause context-switch overhead.',
  'With nesting enabled, 2 outer × 2 inner threads = 4 inner executions. Enable it with `omp_set_nested(1)`.',
  'Compile with `-fopenmp`. Check support with `#ifdef _OPENMP`.',
];

export const quickRevision: string[] = [
  'The basic form is `#pragma omp parallel { … }`.',
  '`omp_get_thread_num()` returns 0 for the master thread.',
  'Directive format: `#pragma omp <directive> [clauses]`.',
  '`reduction(+:sum)` makes the sum race-free.',
  'In `atomic`, the evaluation of the expression is not atomic.',
  'Explicit locks: `omp_init_lock` → `omp_set_lock` → `omp_unset_lock` → `omp_destroy_lock`.',
  '`omp_test_lock` tries to take the lock without waiting.',
  '`sections` run independent blocks in parallel.',
  '`parallel if(n > 5)` skips parallelism for small inputs.',
  '`num_threads(3)` sets the team size for one region.',
  'Use as many threads as logical processors (or slightly more).',
  '`omp_set_num_threads(omp_get_num_procs())` matches threads to processors.',
];
