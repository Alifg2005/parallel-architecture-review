import type { QuizQuestion } from '../../schema';

export const quiz: QuizQuestion[] = [
  {
    id: 'l06-q01',
    topic: 'OpenMP basics',
    prompt: 'How is the OpenMP API roughly composed, according to the lecture?',
    options: [
      'About 80% compiler directives, 19% library calls and 1% environment variables',
      'About 80% library calls, 19% directives and 1% environment variables',
      'Mostly environment variables',
      'Mostly message-passing calls',
    ],
    answer: 0,
    explanation: 'OpenMP is primarily directive-based (`#pragma omp …`), supported by runtime routines and a few environment variables.',
  },
  {
    id: 'l06-q02',
    topic: 'OpenMP basics',
    prompt: 'Which of these will OpenMP NOT do for you?',
    options: [
      'Provide synchronisation constructs',
      'Hide stack management',
      'Let you split a program into serial and parallel regions',
      'Guarantee speedup or freedom from data races',
    ],
    answer: 3,
    explanation: 'OpenMP does not detect dependencies, guarantee speedup or prevent data races. Those remain the programmer\'s responsibility.',
  },
  {
    id: 'l06-q03',
    topic: 'Parallel region',
    prompt: 'What does `#pragma omp parallel private(tid)` do?',
    options: [
      'Runs the block on the master thread only',
      'Makes `tid` shared among all threads',
      'Forks a team of threads to run the block, giving each thread its own copy of `tid`',
      'Declares `tid` as a constant',
    ],
    answer: 2,
    explanation: 'The parallel directive creates a team that executes the block, and `private(tid)` gives each thread its own variable.',
  },
  {
    id: 'l06-q04',
    topic: 'Runtime routines',
    prompt: 'What does `omp_get_thread_num()` return when the master thread calls it?',
    options: ['-1', '0', '1', 'The total number of threads'],
    answer: 1,
    explanation: 'The master thread has ID 0, and the other threads are numbered sequentially.',
  },
  {
    id: 'l06-q05',
    topic: 'Compiling',
    prompt: 'Which flag enables OpenMP when compiling with g++?',
    options: ['-lpthread', '-O3', '-mpi', '-fopenmp'],
    answer: 3,
    explanation: '`g++ -fopenmp file.cpp -o program` enables OpenMP. Without the flag, the pragmas are ignored.',
  },
  {
    id: 'l06-q06',
    topic: 'Data-sharing',
    prompt: 'What value does a `private` variable have when a parallel region starts?',
    options: [
      'It is uninitialised: each thread gets its own copy with no defined starting value',
      'It holds the value it had before the region',
      'It is shared with the other threads',
      'It holds the value from the last loop iteration',
    ],
    answer: 0,
    explanation: 'Private copies start uninitialised. Use `firstprivate` to copy in the previous value.',
  },
  {
    id: 'l06-q07',
    topic: 'Data-sharing',
    prompt: 'What does each thread print?',
    code: `int x = 5;
#pragma omp parallel firstprivate(x)
{
    printf("%d ", x);
}`,
    options: ['0', '5', 'An undefined value', 'Its thread ID'],
    answer: 1,
    explanation: '`firstprivate` gives each thread its own copy, initialised with the value from before the region (5).',
  },
  {
    id: 'l06-q08',
    topic: 'Data-sharing',
    prompt: 'What is the value of `x` after this loop?',
    code: `int x = 0;
#pragma omp parallel for lastprivate(x)
for (int i = 0; i < 4; i++) {
    x = i;
}`,
    options: ['0', '4', '3', 'Undefined'],
    answer: 2,
    explanation: '`lastprivate` copies the value from the sequentially last iteration (i = 3) back to the original variable.',
  },
  {
    id: 'l06-q09',
    topic: 'Data-sharing',
    prompt: 'How does `reduction(+:sum)` work in this loop?',
    code: `int sum = 0;
#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < 100; i++) sum += i;`,
    options: [
      'Each thread adds into a private copy, and the copies are combined at the end, so sum = 4950',
      'All threads update the same `sum` with no protection, so the result is unpredictable',
      'Only the master thread performs the additions',
      '`sum` is reset to 0 after the loop',
    ],
    answer: 0,
    explanation: 'reduction creates private partial sums and safely combines them with + at the end: 0 + 1 + … + 99 = 4950.',
  },
  {
    id: 'l06-q10',
    topic: 'Synchronisation',
    prompt: 'With 8 threads (IDs 0–7), what is the final value of `shared_var`?',
    code: `int shared_var = 0, private_var = 0;
#pragma omp parallel shared(shared_var) private(private_var)
{
    private_var = omp_get_thread_num();
    #pragma omp critical
    { shared_var += private_var; }
}`,
    options: ['8', '7', '28', '36'],
    answer: 2,
    explanation: 'Each thread adds its ID inside a critical section: 0 + 1 + … + 7 = 28.',
  },
  {
    id: 'l06-q11',
    topic: 'Synchronisation',
    prompt: 'Which statement about `#pragma omp atomic` is correct?',
    options: [
      'It protects an arbitrary block of several statements',
      'The evaluation of the right-hand expression is also atomic',
      'It can be applied to arrays and structs as a whole',
      'It protects a single update of a scalar variable and can be cheaper than critical (often one hardware instruction)',
    ],
    answer: 3,
    explanation: 'atomic gives "critical sections on the cheap" for one scalar update such as `sum += 1`. The expression itself is not evaluated atomically.',
  },
  {
    id: 'l06-q12',
    topic: 'Synchronisation',
    prompt: 'What does `#pragma omp barrier` do?',
    options: [
      'Lets only the master thread continue',
      'Makes every thread in the team wait until all of them have reached that point',
      'Ends the program',
      'Locks a shared variable',
    ],
    answer: 1,
    explanation: 'A barrier is a synchronisation point that every thread must reach before any thread may proceed.',
  },
  {
    id: 'l06-q13',
    topic: 'single vs master',
    prompt: 'Which statement correctly contrasts `single` and `master`?',
    options: [
      'Both are always executed by thread 0',
      'single: the other threads do not wait; master: all threads wait',
      'single: one thread (any) executes and the others wait at its end; master: only thread 0 executes and the others do not wait',
      'They behave identically',
    ],
    answer: 2,
    explanation: 'single has an implied wait at its end and may run on any thread. master is restricted to thread 0, and no synchronisation occurs.',
  },
  {
    id: 'l06-q14',
    topic: 'Work sharing',
    prompt: 'What is the `sections` construct used for?',
    options: [
      'Splitting loop iterations among threads',
      'Creating nested teams of threads',
      'Making a single update atomic',
      'Running independent code blocks (such as two long computations) in parallel, each section on a thread',
    ],
    answer: 3,
    explanation: 'In the lecture, `long_computation_1()` and `long_computation_2()` are independent, so each `section` can run on its own thread.',
  },
  {
    id: 'l06-q15',
    topic: 'Controlling granularity',
    prompt: 'What does `#pragma omp parallel if(n > 5)` do?',
    options: [
      'Runs the region in parallel only when n > 5, avoiding threading overhead for small inputs',
      'Creates exactly 5 threads',
      'Runs only if 5 threads are available',
      'It is a syntax error',
    ],
    answer: 0,
    explanation: 'The `if` clause disables parallel execution when the input is too small to benefit from multithreading.',
  },
  {
    id: 'l06-q16',
    topic: 'Critical sections',
    prompt: 'Which statement about named and unnamed critical sections is correct?',
    options: [
      'Named critical sections are mutually exclusive across the whole program, regardless of name',
      'Unnamed critical sections are mutually exclusive across the whole program, while named ones exclude only sections with the same name',
      'Both kinds allow two threads inside at the same time',
      'Named critical sections only apply within one function',
    ],
    answer: 1,
    explanation: 'All unnamed critical sections share one global lock. Named ones use one lock per name.',
  },
  {
    id: 'l06-q17',
    topic: 'Explicit locks',
    prompt: 'What does `omp_set_lock(&l)` do?',
    options: [
      'Initialises the lock',
      'Destroys the lock',
      'Acquires (sets) the lock, waiting if another thread holds it',
      'Tries to acquire the lock without waiting',
    ],
    answer: 2,
    explanation: 'set acquires, unset releases, init and destroy create and free the lock, and test tries without blocking. The lecture\'s list shuffles these descriptions, but its code example uses them correctly.',
  },
  {
    id: 'l06-q18',
    topic: 'Fork–join',
    prompt: 'In OpenMP\'s fork–join model, what happens at the end of a parallel region?',
    options: [
      'There is an implicit barrier: the threads join and only the master thread continues',
      'All threads continue independently into the serial code',
      'The master thread terminates',
      'New threads are created to run the serial part',
    ],
    answer: 0,
    explanation: 'Every parallel region ends with an implied barrier. After the join, only the master runs the serial code.',
  },
  {
    id: 'l06-q19',
    topic: 'Thread pool',
    prompt: 'What is the main advantage of a thread pool in OpenMP implementations?',
    options: [
      'It guarantees there are never any context switches',
      'More threads in the pool always mean more speed',
      'Threads are destroyed after each region to free memory',
      'Threads are created once and reused, so creation and destruction costs are not paid for every parallel region',
    ],
    answer: 3,
    explanation: 'Reusing pooled threads avoids repeated creation and destruction. Excess threads still hurt performance through context switching.',
  },
  {
    id: 'l06-q20',
    topic: 'Nested parallelism',
    prompt: 'With nesting enabled, how many "Inner thread" lines does this print?',
    code: `omp_set_nested(1);
#pragma omp parallel num_threads(2)
{
    #pragma omp parallel num_threads(2)
    {
        printf("Inner thread: %d\\n", omp_get_thread_num());
    }
}`,
    options: ['2', '4', '8', '1'],
    answer: 1,
    explanation: 'Each of the 2 outer threads forks an inner team of 2, giving 2 × 2 = 4 lines. Without nesting enabled, the inner teams would have 1 thread each, giving 2 lines.',
  },
];
