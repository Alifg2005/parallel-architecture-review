import type { ReviewSection } from '../../schema';

export const sections: ReviewSection[] = [
  {
    id: 'parallelisable-code',
    title: 'Identifying parallelisable code',
    blocks: [
      {
        type: 'code',
        language: 'text',
        title: 'Pseudocode',
        code: `do i = 1 to max
   a[i] = b[i] + c[i] * d[i]   // independent operations for each i
end do`,
        explanation: [
          'Each iteration reads only its own `b[i]`, `c[i]` and `d[i]` and writes only its own `a[i]`.',
          '**No iteration depends on the result of another**, so all iterations can be computed simultaneously.',
          'The work can therefore be distributed across multiple threads or processors.',
        ],
      },
      {
        type: 'definitions',
        items: [
          { term: 'Program', definition: 'Can have multiple processes running at the same time.' },
          { term: 'Process', definition: 'Can create multiple threads to carry out different tasks.' },
          {
            term: 'Thread',
            definition: 'A unit of execution inside a process. Threads **share the same memory space** of their process, which makes them efficient for parallel tasks.',
          },
        ],
      },
    ],
  },
  {
    id: 'pthreads-vs-openmp',
    title: 'Pthreads vs OpenMP',
    blocks: [
      {
        type: 'table',
        columns: ['Feature', 'Pthreads', 'OpenMP'],
        rows: [
          ['Full name', 'POSIX Threads (Portable Operating System Interface), introduced in 1995', 'Open Multi-Processing, introduced in 1997'],
          ['Level of control', '**Low-level**', '**High-level**'],
          ['Typical use', 'General purpose', 'Scientific computing'],
          ['Memory model', 'Shared memory', 'Shared memory'],
        ],
      },
      {
        type: 'list',
        items: [
          'Use **Pthreads** when you need **fine-grained control** over threads, task scheduling and synchronisation.',
          'Use **OpenMP** when you want a simpler interface for parallelising **loops or large blocks** without managing threads yourself.',
          'Avoid **mixing** the two: their different thread-management models can interact badly and hurt performance.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Pthreads is a POSIX standard thread model. Include `pthread.h` to use it. It is a **low-level API**: the programmer handles thread creation, synchronisation (mutexes, condition variables), resource allocation and task division manually.',
      },
    ],
  },
  {
    id: 'creating-threads',
    title: 'Creating threads with pthread_create',
    blocks: [
      {
        type: 'code',
        language: 'c',
        title: 'Signature as used in the lecture',
        code: `pthread_create(&tid, &tattr, start_routine, arg);`,
        explanation: [
          '`&tid`: address of a `pthread_t` variable where the **new thread\'s ID is stored**.',
          '`&tattr`: thread attributes. Pass `NULL` for **default** properties, leaving scheduling to the system.',
          '`start_routine`: the function the thread executes. Its type is `void *fn(void *)`.',
          '`arg`: a single `void*` argument passed to that function (`NULL` if there is none).',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Hello World: the main thread does not wait',
        code: `#include <stdlib.h>
#include <stdio.h>
#include <pthread.h>

void *myfunc1(void *p) {
    printf("Hello World\\n");
    return NULL;
}

int main(void) {
    pthread_t child1;                               // thread variable
    pthread_create(&child1, NULL, myfunc1, NULL);   // launch child
    printf("No more Children!\\n");
    exit(0);                                        // ends the whole process
}`,
        explanation: [
          'The main thread creates a child, prints, and calls `exit(0)`, which **terminates the whole process, including the child**.',
          'Because main does not wait, it may finish before the child is scheduled. The typical output is only `No more Children!`.',
          'The slide writes `Void main ( )`. That is a typo: use `int main(void)`. The start routine should also `return NULL;`.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'The "dummy loop" fix is fragile',
        text: 'The lecture\'s "improved" example adds `for (int i = 0; i < 10000000; i++);` before `exit(0)` to keep main alive long enough for the child to print `Hello World`. This works by luck of timing, and an optimising compiler may even remove the empty loop. The correct fix is `pthread_join`.',
      },
      {
        type: 'code',
        language: 'c',
        title: 'Delays with sleep functions (from the lecture)',
        code: `#include <unistd.h>       // POSIX: sleep(seconds), usleep(microseconds)
// #include <windows.h>   // Windows: Sleep(milliseconds), capital S

pthread_create(&child1, NULL, myfunc1, NULL);
usleep(3000);             // pause before creating the next thread
pthread_create(&child2, NULL, myfunc2, NULL);
usleep(3000);
printf("No more Children!\\n");`,
        explanation: [
          'Delays give each thread time to run, so the lecture\'s output is `Function1 called`, `Function2 called`, `No more Children!`.',
          'Units differ by platform: Windows `Sleep(3000)` waits **3000 ms = 3 s**, POSIX `sleep(3)` waits **3 s**, and POSIX `usleep(3000)` waits **3000 µs = 3 ms**.',
          'The slide comments say `usleep(3000)` waits "3 seconds". That is incorrect, because `usleep` takes **microseconds**.',
        ],
      },
    ],
  },
  {
    id: 'pthread-join',
    title: 'Waiting for threads with pthread_join',
    blocks: [
      {
        type: 'paragraph',
        text: '`pthread_join(thread, NULL)` **blocks the calling thread until the given thread finishes**. Passing `NULL` as the second argument means no return value is collected.',
      },
      {
        type: 'code',
        language: 'c',
        title: 'Two children, properly joined',
        code: `void *myfunc1(void *p) { printf("Function1 called\\n"); return NULL; }
void *myfunc2(void *p) { printf("Function2 called\\n"); return NULL; }

int main(void) {
    pthread_t child1, child2;
    pthread_create(&child1, NULL, myfunc1, NULL);
    pthread_create(&child2, NULL, myfunc2, NULL);
    pthread_join(child1, NULL);    // wait for child1
    pthread_join(child2, NULL);    // wait for child2
    printf("No more Children!\\n");  // always printed last
    return 0;
}`,
        explanation: [
          '`No more Children!` is now guaranteed to come **after** both function messages.',
          'The order of `Function1 called` and `Function2 called` relative to each other is still up to the scheduler.',
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'Creating and joining N threads',
        code: `#define NUM_THREADS 4

void *hello(void *arg) { printf("Hello Thread\\n"); return NULL; }

int main(void) {
    pthread_t tid[NUM_THREADS];
    for (int i = 0; i < NUM_THREADS; i++)
        pthread_create(&tid[i], NULL, hello, NULL);
    for (int i = 0; i < NUM_THREADS; i++)
        pthread_join(tid[i], NULL);
    return 0;
}`,
        explanation: ['Create all threads first, so they run concurrently, then join them all. Joining inside the creation loop would serialise them.'],
      },
    ],
  },
  {
    id: 'race-conditions',
    title: 'Shared data and race conditions',
    blocks: [
      {
        type: 'code',
        language: 'c',
        title: 'Four "jobs" sharing a global counter (no protection)',
        code: `int counter = 0;               // shared by all threads

void *myfunc1(void *p) {
    counter += 1;
    printf("Job %d has started\\n", counter);
    for (int j = 0; j < 10000; j++);   // simulate work
    printf("Job %d has finished\\n", counter);
    return NULL;
}`,
        explanation: [
          'Threads are started in order, but they run asynchronously and may finish in any order.',
          'Several threads read and modify `counter` without coordination, so the printed job numbers can repeat or skip (for example, "Job 2 has started" twice). The result depends on timing.',
        ],
      },
      {
        type: 'definitions',
        items: [
          {
            term: 'Race condition',
            definition: 'When the outcome of a program **depends on the timing or order** in which threads execute. A typical cause is two threads updating a shared counter at the same time.',
          },
          {
            term: 'Critical section',
            definition: 'A part of the program that accesses **shared resources**. If several threads execute it at the same time, data can become inconsistent.',
          },
        ],
      },
    ],
  },
  {
    id: 'mutex',
    title: 'Mutexes: protecting critical sections',
    blocks: [
      {
        type: 'paragraph',
        text: 'A **mutex** (mutual exclusion) is a synchronisation primitive that lets **only one thread at a time** execute a critical section. It is used to **avoid race conditions**, **prevent data corruption** and **ensure thread safety**.',
      },
      {
        type: 'table',
        columns: ['Step', 'Call', 'Meaning'],
        rows: [
          ['1. Initialise', '`pthread_mutex_init(&lock, NULL);`', 'Must happen before any thread uses the mutex.'],
          ['2. Lock', '`pthread_mutex_lock(&lock);`', 'Enter the critical section. If another thread holds the lock, **wait**.'],
          ['3. Unlock', '`pthread_mutex_unlock(&lock);`', 'Leave the critical section so another thread can enter.'],
          ['4. Destroy', '`pthread_mutex_destroy(&lock);`', 'Free the mutex once all threads are done with it.'],
        ],
      },
      {
        type: 'code',
        language: 'c',
        title: 'The counter example, protected',
        code: `pthread_t tid[4];
int counter;
pthread_mutex_t lock;

void *trythis(void *arg) {
    pthread_mutex_lock(&lock);
    counter += 1;
    printf("Job %d has started\\n", counter);
    for (int j = 0; j < 10000; j++);
    printf("Job %d has finished\\n", counter);
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main(void) {
    if (pthread_mutex_init(&lock, NULL) != 0) {
        printf("mutex init has failed\\n");
        return 1;
    }
    for (int i = 0; i < 4; i++)
        pthread_create(&tid[i], NULL, &trythis, NULL);
    for (int i = 0; i < 4; i++)
        pthread_join(tid[i], NULL);
    pthread_mutex_destroy(&lock);
    return 0;
}`,
        explanation: [
          'Each thread performs the increment **and** both prints while holding the lock, so jobs no longer interleave.',
          'Output: Job 1 started, Job 1 finished, Job 2 started, Job 2 finished, … Job 4 finished.',
          'Checking the return value of `pthread_mutex_init` is good practice. A non-zero value means failure.',
        ],
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'Forgetting to unlock causes deadlock',
        text: 'If `pthread_mutex_unlock(&lock)` is commented out, Job 1 locks the mutex and never releases it. Job 1 prints its two lines, but the other threads block forever on `pthread_mutex_lock`, and the program **freezes**. Output: only "Job 1 has started" and "Job 1 has finished".',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Removing the mutex entirely',
        text: 'Without the lock and unlock calls, the threads interfere with each other while updating `counter`, and the output is likely to be incorrect or inconsistent.',
      },
      {
        type: 'list',
        items: [
          '**Best practice:** always lock and unlock mutexes in the **same order**.',
          '**Best practice:** keep the critical section **as short as possible**.',
          '**Best practice:** **always unlock** after the critical section, or other threads block indefinitely.',
          '**Typical uses:** job counters, arrays or lists that several threads update or read, and printing results in a consistent order.',
        ],
      },
    ],
  },
  {
    id: 'passing-values',
    title: 'Passing values to threads',
    blocks: [
      {
        type: 'code',
        language: 'c',
        title: 'Passing an int through void*',
        code: `void *myfunc1(void *p) {
    int num = *(int *)p;          // cast void* to int*, then dereference
    printf("Function1 called - %d\\n", num);
    return NULL;
}

int main(void) {
    pthread_t child1, child2;
    int i = 4, j = 10;
    pthread_create(&child1, NULL, myfunc1, &i);   // pass the ADDRESS of i
    pthread_create(&child2, NULL, myfunc2, &j);
    pthread_join(child1, NULL);
    pthread_join(child2, NULL);
    printf("No more Children!\\n");
    exit(0);
}`,
        explanation: [
          'A thread receives exactly one `void*`, so pass the **address** of the data and cast it back inside the thread.',
          'The two-step form `int *pp = (int *)p; int num = *pp;` is equivalent to `int num = *(int *)p;`.',
          'Output: `Function1 called - 4`, `Function2 called - 10`, then `No more Children!`.',
          'The variable must stay valid and unchanged until the thread has read it. Passing `&i` of a loop counter is error-prone, because the loop may change `i` first (Lecture 6 points this out).',
        ],
      },
    ],
  },
];

export const examPoints: string[] = [
  'A loop is parallelisable when **no iteration depends on another\'s result**.',
  'Threads of one process **share its memory**. That makes them efficient, and also exposes them to race conditions.',
  'Pthreads is low-level, general purpose and gives fine-grained control. OpenMP is high-level and suits loops and scientific code. Both are shared memory. Do not mix them.',
  '`pthread_create(&tid, attr, fn, arg)`: `NULL` attr means defaults. `fn` has type `void *(void *)`. `arg` is a single `void*`.',
  'If main calls `exit(0)` without joining, the child may never run. `pthread_join` is the correct way to wait.',
  'Mutex lifecycle: **init → lock → unlock → destroy**. Forgetting the unlock causes **deadlock**.',
  'Race condition = the result depends on thread timing. Critical section = code that touches shared data.',
  '`usleep` takes **microseconds**, `sleep` takes seconds, and Windows `Sleep` takes milliseconds.',
];

export const quickRevision: string[] = [
  'Include `<pthread.h>`. A thread handle has type `pthread_t`.',
  'Pthreads (1995) is a POSIX standard. OpenMP was introduced in 1997.',
  'A program has processes, and each process has threads.',
  '`pthread_join(t, NULL)` blocks until thread t finishes.',
  'Create all threads first, then join them all.',
  'Threads finish in an unpredictable order.',
  'Only one thread can hold a mutex at a time.',
  'Keep critical sections short.',
  'Lock mutexes in a consistent order.',
  'Read an int argument with `int num = *(int *)p;`.',
];
