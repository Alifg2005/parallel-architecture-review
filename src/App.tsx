import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { LecturePage } from './pages/LecturePage';
import { LectureEssaysPage } from './pages/LectureEssaysPage';
import { QuizPage } from './pages/QuizPage';
import { EssaysPage } from './pages/EssaysPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** All routes. Lectures are resolved from the registry by :chapterId — never add per-lecture routes. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="essays" element={<EssaysPage />} />
        <Route path="lectures/:chapterId" element={<LecturePage />} />
        <Route path="lectures/:chapterId/essays" element={<LectureEssaysPage />} />
        <Route path="lectures/:chapterId/quiz" element={<QuizPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
