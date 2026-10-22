import type { ChapterMeta } from '../../schema';

export const meta: ChapterMeta = {
  id: 'lecture-01',
  number: 1,
  title: 'Why Parallel Computing?',
  description:
    'How single-processor speed-ups ran into the power wall around 2004, why the industry moved to multi-core chips, and the three themes that run through the course.',
  estimatedMinutes: 20,
  topics: ['Power wall', 'ILP vs TLP', 'Multi-core shift', 'Supercomputers vs clusters', 'Efficiency'],
  objectives: [
    'Explain the four drivers of single-processor performance growth from the 1980s to the early 2000s.',
    'Describe the power density ("thermal") wall and why clock-frequency scaling ended around 2004.',
    'Distinguish **instruction-level parallelism (ILP)** from **thread-level parallelism (TLP)** with examples.',
    'Explain what the multi-core shift means for programmers ("write parallel software").',
    'Compare supercomputers with data center clusters across applications, hardware, run-time system and programming model.',
    'State the three course themes and explain why a fast program is not necessarily an efficient one.',
  ],
};
