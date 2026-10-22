import { useParams } from 'react-router-dom';
import { ListChecks } from 'lucide-react';
import { getChapter } from '../content/registry';
import { LectureHeader } from '../components/layout/LectureHeader';
import { EssayCard } from '../components/essays/EssayCard';
import { ButtonLink } from '../components/ui/Button';
import { NotFoundPage } from './NotFoundPage';

export function LectureEssaysPage() {
  const { chapterId } = useParams();
  const chapter = getChapter(chapterId);
  if (!chapter) return <NotFoundPage kind="lecture" />;
  const { meta } = chapter;

  return (
    <>
      <title>{`Lecture ${meta.number} essay practice — ${meta.title}`}</title>
      <LectureHeader
        chapter={chapter}
        title={`${meta.title}: Essay practice`}
        lead="Try each question on your own first, then reveal the model answer and check it against the key concepts a marker looks for."
      />
      <div className="mx-auto max-w-4xl space-y-5 px-4 pt-10 sm:px-6">
        {chapter.essays.map((essay, i) => (
          <EssayCard key={essay.id} essay={essay} index={i} />
        ))}
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-surface-2 p-6 sm:flex-row sm:items-center">
          <p className="text-ink-2">Ready to test recall under quiz conditions?</p>
          <ButtonLink to={`/lectures/${meta.id}/quiz`}>
            <ListChecks className="size-4" aria-hidden /> Take the Lecture {meta.number} quiz
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
