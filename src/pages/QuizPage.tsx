import { useParams } from 'react-router-dom';
import { getChapter } from '../content/registry';
import { recordQuizAttempt, useProgress } from '../lib/progress';
import { LectureHeader } from '../components/layout/LectureHeader';
import { QuizRunner } from '../components/quiz/QuizRunner';
import { NotFoundPage } from './NotFoundPage';

export function QuizPage() {
  const { chapterId } = useParams();
  const chapter = getChapter(chapterId);
  const progress = useProgress();

  if (!chapter) return <NotFoundPage kind="lecture" />;
  const { meta } = chapter;
  const record = progress.quizzes[meta.id];

  return (
    <>
      <title>{`Lecture ${meta.number} quiz — ${meta.title}`}</title>
      <LectureHeader
        chapter={chapter}
        title={`${meta.title}: Quiz`}
        lead={`${chapter.quiz.length} multiple-choice questions. Answers and explanations appear after you submit. You can move between questions and change answers until then.${
          record ? ` Your best so far: ${record.bestScore}/${record.total} (${record.attempts} attempt${record.attempts === 1 ? '' : 's'}).` : ''
        }`}
      />
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <QuizRunner
          // Remount on lecture change so state never leaks between quizzes.
          key={meta.id}
          questions={chapter.quiz}
          reviewHref={`/lectures/${meta.id}`}
          essaysHref={`/lectures/${meta.id}/essays`}
          onSubmit={(result) => recordQuizAttempt(meta.id, result.correct, result.total)}
        />
      </div>
    </>
  );
}
