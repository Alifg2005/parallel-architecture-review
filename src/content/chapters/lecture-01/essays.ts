import type { EssayQuestion } from '../../schema';

export const essays: EssayQuestion[] = [
  {
    id: 'l01-e01',
    style: 'discuss',
    prompt: 'Explain why the processor industry moved from increasing clock speed to building multi-core processors around 2004.',
    keyConcepts: ['Exponential single-core growth (1985–2003)', 'Power density / thermal wall', 'Diminishing returns of frequency and ILP', 'More transistors per chip', 'Multiple cores on one chip'],
    modelAnswer: [
      'From the mid-1980s to the early 2000s, single-processor performance grew exponentially through wider data paths, more efficient pipelining, instruction-level parallelism (superscalar and out-of-order execution) and rising clock rates.',
      'Higher clock rates, however, increased power consumption and heat. Around 2004, processors reached a **power density ("thermal") wall**: raising the frequency further gave diminishing returns because the chip could not be powered and cooled reliably. At the same time, ILP was largely tapped out, so a single thread could not use extra hardware effectively.',
      'Transistor density kept rising. Instead of spending transistors on one faster, more complex core, manufacturers such as Intel used them to place **multiple cores on a single chip**. Performance could keep growing through thread-level parallelism within the same power budget.',
      'The consequence is that programs no longer speed up automatically with each hardware generation. Software must be written to run in parallel.',
    ],
    whyItMatters: 'This is the motivating story of the whole course. Markers look for the causal chain: power/heat leads to the end of frequency scaling, which leads to multi-core, which leads to the need for parallel software.',
    structure: ['Describe the single-core growth era and its drivers', 'Explain the power/thermal wall', 'Explain why transistors went into more cores', 'State the consequence for programmers'],
  },
  {
    id: 'l01-e02',
    style: 'compare-contrast',
    prompt: 'Compare instruction-level parallelism (ILP) and thread-level parallelism (TLP). Give an example of each.',
    keyConcepts: ['ILP: within one thread', 'Independence of instructions', 'TLP: across threads', 'Multi-core example', 'Who finds the parallelism'],
    modelAnswer: [
      '**ILP** is the CPU\'s ability to execute several instructions from **the same thread** at the same time. Example: an addition, a multiplication and a memory load that do not depend on each other can be executed simultaneously. Hardware techniques such as superscalar and out-of-order execution exploit ILP, so the programmer usually does not have to do anything.',
      '**TLP** is the parallel execution of **different threads**, from the same program or from different programs. Example: on a multi-core processor, one core runs a thread that handles user input while another core runs a thread doing background calculations. TLP requires the work to be divided into threads, usually by the programmer.',
      'The key contrast is scope: ILP works inside one instruction stream and is limited by dependencies between neighbouring instructions. TLP works across instruction streams and scales with the number of cores. After ILP stopped delivering growing gains, TLP became the main path to higher performance.',
    ],
    whyItMatters: 'Confusing the two is a classic exam mistake. The distinction also sets up Lecture 2\'s superscalar, SIMD and multi-core execution.',
    structure: ['Define ILP and give an example', 'Define TLP and give an example', 'Contrast scope, who exploits it, and limits', 'Link to the multi-core shift'],
  },
  {
    id: 'l01-e03',
    style: 'compare-contrast',
    prompt: 'Compare supercomputers and data center clusters as two paradigms of high-performance computing.',
    keyConcepts: ['Few big tasks vs many small tasks', 'Custom vs consumer-grade hardware', 'Low latency vs throughput interconnect', 'Static vs dynamic scheduling', 'Programmer vs run-time manages resources'],
    modelAnswer: [
      '**Supercomputers** target a few very large tasks. Their hardware is customised and optimised for reliability, with a low-latency interconnect. The run-time system is minimal and uses static scheduling. Applications use a low-level, processor-centric model in which the programmer manages resources.',
      '**Data center clusters** target many small tasks. They use consumer-grade hardware optimised for low cost and a throughput-optimised interconnect. Their run-time system provides reliability and allocates resources dynamically. Applications use a high-level, data-centric model in which the run-time system manages resources.',
      'In short, supercomputers trade convenience and cost for raw performance on single huge problems, while clusters trade some performance for low cost, scalability and ease of programming across many independent requests.',
    ],
    whyItMatters: 'It tests whether you can organise a comparison along clear dimensions (applications, hardware, run-time and programming), which is exactly how the lecture\'s table is built.',
    structure: ['One paragraph per paradigm', 'Use the same four dimensions for both', 'Close with the trade-off'],
  },
  {
    id: 'l01-e04',
    style: 'define-explain',
    prompt: 'Explain the slogans "Power is free, transistors are expensive" and "Power is expensive, transistors are free". Which era does each describe?',
    keyConcepts: ['Single-core era', 'Multi-core era', 'Power wall', 'Transistors cannot all be powered at once', 'Power efficiency'],
    modelAnswer: [
      '"Power is free, transistors are expensive" describes the **single-core era**. Power consumption was not a major design concern, but transistors were limited and costly, so designers spent them carefully to make one instruction stream run fast.',
      '"Power is expensive, transistors are free" describes the **multi-core era** after the power wall. Manufacturing can now place more transistors on a chip than can be powered at the same time, so power efficiency, rather than transistor count, limits performance.',
      'The reversal explains why designers now favour several simpler, efficient cores over one large, power-hungry core.',
    ],
    whyItMatters: 'The slogans summarise the economics behind the multi-core shift in one sentence. Mixing up their eras is a common error.',
  },
  {
    id: 'l01-e05',
    style: 'process',
    prompt: 'Describe the four technology trends that produced exponential single-processor performance growth in the 1980s and 1990s.',
    keyConcepts: ['Wider data paths', 'Pipelining and CPI', 'ILP: superscalar, out-of-order', 'Clock rate increases'],
    modelAnswer: [
      '**Wider data paths:** processors grew from 4-bit to 8, 16, 32 and 64-bit, so each operation handled more data.',
      '**More efficient pipelining:** overlapping instruction stages reduced the average cycles per instruction (from about 3.5 to about 1.1 CPI in the lecture\'s example).',
      '**Instruction-level parallelism:** superscalar processors issue several instructions per cycle (up to about 4), and out-of-order execution finds independent instructions within the stream.',
      '**Faster clock rates:** frequencies rose from about 10 MHz to 200 MHz and then to 3 GHz.',
      'Together these trends gave large exponential gains, but each approached physical or power limits by the early 2000s.',
    ],
    whyItMatters: 'Knowing why single-core performance grew is what lets you explain why it stopped.',
  },
  {
    id: 'l01-e06',
    style: 'discuss',
    prompt: 'Is a 2× speedup on a computer with 10 processors a good result? Discuss using the idea that "fast is not the same as efficient".',
    keyConcepts: ['Speedup', 'Efficiency = speedup / processors', 'Under-utilised hardware', 'Communication overhead', 'Role of programmer and hardware designer'],
    modelAnswer: [
      'The program is faster (twice as fast), but its **efficiency** is only speedup ÷ processors = 2 ÷ 10 = 0.2, or 20%. Eighty percent of the machine\'s potential is wasted.',
      'Whether that is "good" depends on context. If the goal is only to finish sooner and the processors would otherwise sit idle, 2× may be acceptable. As a use of hardware, however, it is poor.',
      'Typical causes include communication and synchronisation overhead, load imbalance and serial parts of the program. Improving the result is a shared job: programmers write better-decomposed code, and hardware designers build balanced systems.',
    ],
    whyItMatters: 'Theme 3 of the course. It introduces the speedup/efficiency reasoning used throughout (formalised in Lecture 3).',
    structure: ['Compute efficiency', 'Interpret it', 'Name likely causes', 'Conclude with "fast ≠ efficient"'],
  },
];
