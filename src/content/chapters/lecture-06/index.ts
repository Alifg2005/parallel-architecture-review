import type { Chapter } from '../../schema';
import { meta } from './meta';
import { examPoints, quickRevision, sections } from './review';
import { essays } from './essays';
import { quiz } from './quiz';

export const chapter: Chapter = { meta, sections, examPoints, quickRevision, essays, quiz };
