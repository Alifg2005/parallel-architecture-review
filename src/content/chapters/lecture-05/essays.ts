import type { EssayQuestion } from '../../schema';

export const essays: EssayQuestion[] = [
  {
    id: 'l05-e01',
    style: 'compare-contrast',
    prompt: 'Compare Pthreads and OpenMP. When should each be used, and why should they not be mixed?',
    keyConcepts: ['POSIX standard, low-level', 'High-level API, directives', 'Both shared memory', 'Fine-grained control', 'Loops / scientific code', 'Conflicting thread management'],
    modelAnswer: [
      '**Pthreads** (POSIX Threads, 1995) is a low-level, general-purpose thread API. The programmer explicitly creates threads, divides the work, and synchronises using mutexes and condition variables.',
      '**OpenMP** (1997) is a high-level API used mainly in scientific computing. The programmer marks loops or blocks for parallel execution, and the runtime manages the threads.',
      'Both are **shared-memory** models. Choose Pthreads when you need fine-grained control over thread creation, scheduling and synchronisation. Choose OpenMP when you want to parallelise loops or large computations simply.',
      'Mixing them is discouraged because each manages threads in its own way. The interaction can cause poor performance (for example, oversubscribing cores).',
    ],
    whyItMatters: 'The comparison frames both programming lectures. The lecture gives this exact table and these exact usage rules.',
  },
  {
    id: 'l05-e02',
    style: 'trace-code',
    prompt: 'Predict the output of the program below and explain why. Then describe two ways to make "Hello World" appear, and say which is correct.',
    code: `void *myfunc1(void *p) { printf("Hello World\\n"); return NULL; }

int main(void) {
    pthread_t child1;
    pthread_create(&child1, NULL, myfunc1, NULL);
    printf("No more Children!\\n");
    exit(0);
}`,
    keyConcepts: ['Main does not wait', 'exit() ends the whole process', 'Scheduling is nondeterministic', 'Dummy loop is fragile', 'pthread_join is correct'],
    modelAnswer: [
      'The main thread creates the child, prints "No more Children!", and immediately calls `exit(0)`, which terminates the entire process, including the child. The child usually has not been scheduled yet, so the typical output is only **"No more Children!"**. The exact behaviour depends on scheduling.',
      '**Fix 1 (the lecture\'s dummy loop):** add a long empty loop before `exit(0)` so that main stays alive long enough for the child to print. This relies on timing, wastes CPU, and can be optimised away by the compiler, so it is not reliable.',
      '**Fix 2 (correct):** call `pthread_join(child1, NULL)` before exiting. Main then blocks until the child finishes, which guarantees that "Hello World" is printed.',
    ],
    whyItMatters: 'Predicting thread output is a common exam task. It tests whether you understand that thread scheduling is not ordered unless you synchronise.',
  },
  {
    id: 'l05-e03',
    style: 'process',
    prompt: 'Explain the four parameters of pthread_create and the purpose of pthread_join. Outline a program that creates N threads and waits for all of them.',
    keyConcepts: ['&tid stores the thread ID', 'Attributes (NULL = default)', 'Start routine void*(void*)', 'Single void* argument', 'Join blocks until finish', 'Create all, then join all'],
    modelAnswer: [
      '`pthread_create(&tid, attr, start_routine, arg)`: `&tid` is where the new thread\'s ID is stored. `attr` sets thread attributes (`NULL` for defaults). `start_routine` is the function the thread runs, with signature `void *f(void *)`. `arg` is the single pointer passed to it (`NULL` if unused).',
      '`pthread_join(tid, NULL)` blocks the caller until thread `tid` terminates. `NULL` means no return value is collected. It is the proper way to make main wait.',
      'For N threads, declare `pthread_t tid[N]`. First loop over `i` calling `pthread_create(&tid[i], NULL, work, NULL)`. Then, in a second loop, call `pthread_join(tid[i], NULL)`. Creating all the threads before joining lets them run concurrently. Joining inside the first loop would serialise them.',
    ],
    whyItMatters: 'Correct API use is the foundation of the lab work, and the "create all, then join all" pattern is exam-worthy.',
  },
  {
    id: 'l05-e04',
    style: 'define-explain',
    prompt: 'What is a race condition? Explain how a mutex prevents it, describing the full mutex lifecycle.',
    keyConcepts: ['Outcome depends on timing', 'Shared counter example', 'Critical section', 'Mutual exclusion', 'init → lock → unlock → destroy', 'Thread safety'],
    modelAnswer: [
      'A **race condition** occurs when the result of a program depends on the timing or order of thread execution. For example, if two threads execute `counter += 1` at the same time without synchronisation, an update can be lost, and the final value can be wrong.',
      'The code that accesses shared data is a **critical section**. A **mutex** ensures that only one thread at a time executes it: a thread **locks** the mutex before entering and **unlocks** it when leaving, and any other thread that tries to lock in the meantime waits.',
      'Lifecycle: `pthread_mutex_init(&lock, NULL)` before use, then `pthread_mutex_lock` / `pthread_mutex_unlock` around each critical section, and finally `pthread_mutex_destroy(&lock)` once all threads have finished. Used this way, the mutex prevents data corruption and makes the code thread-safe.',
    ],
    whyItMatters: 'Synchronisation is the core difficulty of shared-memory programming, and it is the most examined Pthreads topic.',
    structure: ['Define a race condition with an example', 'Define a critical section', 'Explain mutual exclusion', 'Give the four lifecycle calls'],
  },
  {
    id: 'l05-e05',
    style: 'trace-code',
    prompt: 'In the mutex-protected job example, what happens if `pthread_mutex_unlock(&lock);` is commented out? What happens if both the lock and unlock calls are removed instead?',
    code: `void *trythis(void *arg) {
    pthread_mutex_lock(&lock);
    counter += 1;
    printf("Job %d has started\\n", counter);
    for (int j = 0; j < 10000; j++);
    printf("Job %d has finished\\n", counter);
    // pthread_mutex_unlock(&lock);
    return NULL;
}`,
    keyConcepts: ['Lock never released', 'Other threads block forever', 'Deadlock / program freezes', 'Only Job 1 output', 'No mutex: interference, incorrect counts'],
    modelAnswer: [
      '**Missing unlock:** the first thread to run (Job 1) acquires the lock, prints "Job 1 has started" and "Job 1 has finished", then returns while still holding the mutex. Every other thread blocks forever in `pthread_mutex_lock`, and main blocks forever in `pthread_join`. The program **deadlocks** (freezes), and only Job 1\'s two lines appear.',
      '**No mutex at all:** all four threads update and print `counter` concurrently. Their operations interleave, so job numbers can be duplicated or skipped, and "started" and "finished" lines can mix. The output is likely incorrect and differs between runs.',
      'Correct behaviour needs both calls: the lock gives mutual exclusion, and the unlock releases it for the next thread.',
    ],
    whyItMatters: 'It contrasts the two classic synchronisation bugs: deadlock (too much locking) and races (too little).',
  },
  {
    id: 'l05-e06',
    style: 'trace-code',
    prompt: 'Explain how a value is passed to a thread in Pthreads, using the example below. What could go wrong if the address of a loop variable were passed?',
    code: `void *myfunc1(void *p) {
    int num = *(int *)p;
    printf("Function1 called - %d\\n", num);
    return NULL;
}
/* in main */
int i = 4;
pthread_create(&child1, NULL, myfunc1, &i);`,
    keyConcepts: ['Single void* argument', 'Pass the address', 'Cast back to int*', 'Dereference', 'Lifetime and modification of the variable'],
    modelAnswer: [
      'A Pthreads start routine receives exactly one `void*` argument, so the caller passes the **address** of its data (`&i`). The generic pointer can carry any type.',
      'Inside the thread, `(int *)p` casts the generic pointer back to an `int*`, and the leading `*` dereferences it to obtain the value. The output is "Function1 called - 4".',
      'The thread reads the variable at some later time. If main passes `&i` of a loop counter and the loop then increments `i`, several threads may read the same or already-changed values. The variable must stay valid and unchanged until the thread has read it, for example by using a separate array element per thread.',
    ],
    whyItMatters: 'Argument passing through `void*` is a frequent source of bugs and code-tracing questions.',
  },
  {
    id: 'l05-e07',
    style: 'advantages-limitations',
    prompt: 'State the mutex best practices from the lecture and give typical uses of mutexes. Why does each practice matter?',
    keyConcepts: ['Consistent lock order', 'Short critical sections', 'Always unlock', 'Counters', 'Shared arrays/lists', 'Ordered printing'],
    modelAnswer: [
      '**Always lock and unlock mutexes in the same order.** When several mutexes are involved, inconsistent ordering lets two threads each hold one lock while waiting for the other, which causes deadlock.',
      '**Minimise the time spent in the critical section.** While one thread holds the lock, the others wait, so long critical sections serialise the program and destroy speedup.',
      '**Always unlock after the critical section.** Otherwise other threads block indefinitely and the program freezes.',
      'Typical uses: tracking how many jobs have completed (counters), modifying arrays or lists that several threads update or read, and printing results in a consistent order so that outputs do not overwrite each other.',
    ],
    whyItMatters: 'Correctness and performance both depend on how locks are used. This shows that you understand the trade-off.',
  },
];
