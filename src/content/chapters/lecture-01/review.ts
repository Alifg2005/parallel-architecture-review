import type { ReviewSection } from '../../schema';

export const sections: ReviewSection[] = [
  {
    id: 'why-parallelism',
    title: 'Why parallelism at all?',
    summary: 'Processors stopped getting faster in the old way, so performance now comes from doing several things at once.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Early processors executed instructions strictly one after another. Modern processors execute **multiple instructions simultaneously**, and most chips now contain **multiple cores**, each able to run its own instruction stream. Running parts of an application on different cores in parallel is where today\'s performance gains come from.',
      },
      {
        type: 'list',
        items: [
          '**Frequency cannot rise forever.** Raising processor and memory clock rates indefinitely is not feasible, so parallelism is used to keep increasing computational power.',
          '**Power is managed better.** Spreading work over several units avoids the heat and power costs of simply pushing one processor faster.',
          '**It works and it sells.** Parallelism has become standard because it is effective and commercially viable.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Historically, parallel computing first grew out of **scientific computing\'s** demand for more computational power. From the early 1990s, **databases** handling millions of web-service transactions per second became another driving application (for example, the Sun Enterprise 10000 with 16 UltraSPARC-II processors around 1997). The lecture notes that this class of machine was eventually overtaken by cloud computing.',
      },
    ],
  },
  {
    id: 'single-processor-era',
    title: 'The single-processor era (1985–2003)',
    summary: 'For about two decades, one processor kept getting exponentially faster.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Single-processor performance grew roughly exponentially from 1985 to 2003. Four technology trends combined to produce this growth:',
      },
      {
        type: 'table',
        columns: ['Driver', 'What improved', 'Example from the lecture'],
        rows: [
          ['Wider data paths', 'More bits processed per operation', '4-bit → 8 → 16 → 32 → 64-bit'],
          ['More efficient pipelining', 'Fewer clock cycles per instruction (CPI)', 'About 3.5 CPI → about 1.1 CPI'],
          ['Instruction-level parallelism (ILP)', 'Several independent instructions from one stream at once', 'Superscalar issue (up to 4 instructions/cycle) and out-of-order execution'],
          ['Faster clock rates', 'More cycles per second', '10 MHz → 200 MHz → 3 GHz'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Reading CPI',
        text: 'CPI is cycles per instruction. A **lower** CPI means each instruction needs fewer cycles on average, so more work is done per second at the same clock rate.',
      },
      {
        type: 'paragraph',
        text: 'These innovations gave large exponential gains during the 1980s and 1990s, but each one was approaching its limits. Sustaining growth needed a new approach.',
      },
    ],
  },
  {
    id: 'power-wall',
    title: 'The power density wall (2004)',
    summary: 'Faster clocks meant more power and more heat, until the returns were no longer worth it.',
    blocks: [
      {
        type: 'paragraph',
        text: 'As processors became faster, they **consumed more power and generated more heat**. Around 2004, further clock-speed increases produced diminishing returns because of excessive heat and power consumption. This turning point is often called hitting the **"thermal wall"** or **power density wall**.',
      },
      {
        type: 'paragraph',
        text: 'The lecture cites a 2004 New York Times report: Intel publicly acknowledged that it had hit a thermal wall, cancelled two planned processor designs, and turned to a strategy its rivals had already adopted, which was **putting multiple processors on a single chip** instead of making one processor run faster.',
      },
      {
        type: 'list',
        items: [
          '**Transistor density kept increasing**, so chips could still hold more transistors each generation.',
          '**Clock frequency stopped increasing** around the mid-2000s.',
          '**Power levelled off** because it had reached what could be cooled.',
          '**ILP stopped delivering further benefit**, because the independent instructions available in a single thread had largely been exploited.',
        ],
      },
      {
        type: 'callout',
        tone: 'exam',
        title: 'Do we still need ILP?',
        text: 'Yes. Modern cores are still superscalar and still exploit ILP (Lecture 2 shows each Core i7 core issuing multiple instructions per clock). The point is that ILP and frequency **alone stopped giving growing gains**, so additional performance must come from thread-level parallelism across cores.',
      },
    ],
  },
  {
    id: 'ilp-vs-tlp',
    title: 'ILP vs TLP',
    blocks: [
      {
        type: 'definitions',
        items: [
          {
            term: 'Instruction-Level Parallelism (ILP)',
            definition:
              'The ability of a CPU to execute **multiple instructions simultaneously within a single thread**. Example: an add, a multiply and a memory load from the same program run at the same time, **provided they are independent** of each other.',
          },
          {
            term: 'Thread-Level Parallelism (TLP)',
            definition:
              'The parallel execution of **different threads**, which may belong to the same program or to different programs. Example: on a multi-core processor, one core runs a thread that handles user input while another core runs a thread doing background calculations.',
          },
        ],
      },
      {
        type: 'table',
        columns: ['', 'ILP', 'TLP'],
        rows: [
          ['Scope', 'Inside one instruction stream (thread)', 'Across multiple instruction streams (threads)'],
          ['Found by', 'Hardware (superscalar, out-of-order) and compiler', 'Programmer or software that creates threads'],
          ['Requirement', 'Instructions must be independent', 'Work must be split into threads'],
          ['Status after 2004', 'Largely tapped out', 'Main route to more performance'],
        ],
      },
    ],
  },
  {
    id: 'multicore-shift',
    title: 'The multi-core shift and what it means for programmers',
    blocks: [
      {
        type: 'list',
        ordered: true,
        items: [
          'In the 1980s and 1990s, processors became exponentially faster through data paths, pipelining, ILP and clock rates.',
          'Around 2004, Intel hit the thermal wall: further clock increases caused excessive heat and power consumption.',
          'Intel shifted from raising clock speed to building **multi-core processors**, a major turning point for the industry.',
          'Multi-core chips allow continued performance growth through **parallel processing on a single chip**.',
        ],
      },
      {
        type: 'table',
        caption: 'From a programmer\'s perspective: "How do you make your program run faster?"',
        columns: ['Era', 'Answer', 'Why'],
        rows: [
          ['Before 2004', '"Just wait 6 months and buy a new machine."', 'Processor speeds rose quickly. Parallel computing was a niche interest.'],
          ['After 2004', '"You need to write fast/parallel software."', 'Single-core speed plateaued, so software parallelism became essential.'],
        ],
      },
      {
        type: 'table',
        caption: 'The economics flipped.',
        columns: ['Era', 'Slogan', 'Meaning'],
        rows: [
          ['Single-core era', '"Power is free, transistors are expensive."', 'Power was not a major concern; transistors were limited and costly.'],
          ['Multi-core era', '"Power wall: power is expensive, transistors are free."', 'Chips can contain more transistors than can be powered at the same time, so power efficiency is critical.'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Parallel machines are now everywhere. The lecture\'s examples include a 6-core Intel Core i9 with an integrated GPU on the same chip, a GPU with 24 major processing blocks, phone chips such as the Apple A12 (4 CPU cores, 4 GPU cores and a neural engine, in a design heavily shaped by **power constraints**), and the Summit supercomputer (4,608 nodes, each with two 22-core CPUs and 6 GPUs).',
      },
    ],
  },
  {
    id: 'two-paradigms',
    title: 'Two paradigms: supercomputers vs data center clusters',
    blocks: [
      {
        type: 'table',
        columns: ['Feature', 'Supercomputers', 'Data center clusters'],
        rows: [
          ['Target applications', 'Few, big tasks', 'Many small tasks'],
          ['Hardware', 'Customised, optimised for reliability, **low-latency** interconnect', 'Consumer grade, optimised for low cost, **throughput-optimised** interconnect'],
          ['Run-time system', 'Minimal, **static** scheduling', 'Provides reliability, **dynamic** allocation'],
          ['Application programming', 'Low-level, processor-centric model; **programmer manages resources**', 'High-level, data-centric model; **run-time system manages resources**'],
        ],
      },
      {
        type: 'definitions',
        items: [
          { term: 'Latency', definition: 'How long a single operation or message takes to complete, measured as time per operation.' },
          { term: 'Throughput', definition: 'How many operations are completed per unit of time, measured as work per second.' },
          {
            term: 'Scheduling',
            definition:
              'Deciding which task runs on which resource and when. **Static** scheduling decides before execution. **Dynamic** scheduling decides at run time.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        text: 'The lecture asks "What is latency? Throughput? Scheduling?" without defining them on the slide. The definitions above are standard background. Lecture 2 defines memory latency and bandwidth precisely.',
      },
    ],
  },
  {
    id: 'course-themes',
    title: 'The three course themes',
    blocks: [
      {
        type: 'definitions',
        items: [
          {
            term: 'Theme 1: Writing parallel programs that scale',
            definition:
              '**Decompose** a large task into smaller independent pieces (for example, sections of an image), **assign** the pieces to processors, and manage **communication and synchronization** so that data is shared without conflicts or long delays.',
          },
          {
            term: 'Theme 2: How parallel hardware works',
            definition:
              'Understand the hardware mechanisms behind the abstractions. Different architectures have different performance traits: **GPUs** excel at massive parallelism with simple computations (such as image processing), while **CPUs** suit complex logic and control flow. Design involves trade-offs between performance, convenience and cost, for example custom supercomputers versus cloud clusters.',
          },
          {
            term: 'Theme 3: Thinking about efficiency',
            definition:
              '**Fast ≠ efficient.** A program that runs faster on a parallel computer may still waste much of the hardware. True efficiency means using the machine\'s capabilities without unnecessary resource consumption. Both programmers (optimal code) and hardware designers (balanced systems) contribute.',
          },
        ],
      },
      {
        type: 'formula',
        label: 'Worked example (from Theme 3)',
        expression: 'efficiency = speedup / processors = 2 / 10 = 0.2  →  20%',
        note: 'A 2× speedup on 10 processors is fast but not efficient, because 80% of the potential is unused. Lecture 3 defines speedup and efficiency formally.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Communication overhead',
        text: 'Parallel computation can theoretically speed up processing, but **communication overhead** between processors can significantly limit that speedup. This makes it a critical factor in parallel algorithm design. The course illustrates it with a parallel matrix-multiplication handout.',
      },
    ],
  },
];

export const examPoints: string[] = [
  'Clock frequency stopped scaling around **2004** because of **power and heat** (the thermal/power wall). Transistor counts kept rising.',
  '**ILP** is parallelism **within one thread** (found by hardware or the compiler). **TLP** is parallelism **across threads** (created by software). Do not mix them up.',
  'The four 1980s–90s drivers: wider data paths, more efficient pipelining (lower CPI), ILP (superscalar/out-of-order) and faster clock rates.',
  '"Power is free, transistors are expensive" belongs to the **single-core** era. "Power is expensive, transistors are free" (the power wall) belongs to the **multi-core** era.',
  'After 2004, faster programs need **parallel software**. Waiting for new hardware is no longer enough.',
  'Supercomputers: few big tasks, low-latency interconnect, static scheduling, programmer manages resources. Clusters: many small tasks, throughput interconnect, dynamic allocation, run-time manages resources.',
  '**Fast ≠ efficient.** A 2× speedup on 10 processors is only 20% efficient.',
];

export const quickRevision: string[] = [
  'Parallelism means doing multiple things at the same time.',
  'Single-processor performance grew exponentially from about 1985 to 2003.',
  'Example drivers: CPI fell from about 3.5 to 1.1, and clock rates rose from 10 MHz to 3 GHz.',
  'The thermal wall (about 2004) ended frequency scaling.',
  'Intel moved to multiple cores per chip.',
  'ILP means many instructions from one thread. TLP means many threads.',
  'Modern chips can hold more transistors than they can power at the same time.',
  'Communication overhead limits parallel speedup.',
  'Course themes: scalable programs, hardware understanding, efficiency.',
];
