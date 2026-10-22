# AGENTS.md — Engineering & Content Contract

**Read this file completely before changing anything in this repository.**
It is the permanent contract for every coding-agent session. If a request conflicts with this file,
follow this file and tell the owner about the conflict.

---

## 1. Project purpose

A static study website for the university course **Parallel Computer Architecture**, owned by
**Ali Feras Alghanim**. For every available lecture, it provides:

- a structured **review page** (objectives, concepts, definitions, comparisons, code, exam points, quick revision),
- **essay / short-answer practice** with model answers,
- a **20-question multiple-choice quiz** with scored results and explanations.

Midterm scope: Lectures 1–6, planned for Week 9 (the exact day and duration are still to be announced).
These values live only in `src/content/course.ts`.

Do not invent a university name, logo, course code, or credentials for the public site. The owner has
not authorised any branding beyond the owner name and the course name.

## 2. Architecture (keep it this simple)

- **Vite + React + TypeScript (strict)**, Tailwind CSS v4, `react-router-dom`, `lucide-react`, `motion`.
- It is a pure static SPA. There is **no** backend, database, auth, analytics, or runtime AI/API calls.
- Content is TypeScript data in `src/content/chapters/*`. UI components never hard-code lecture content.
- Chapters are discovered automatically by `src/content/registry.ts` using `import.meta.glob`.
- Progress and theme are stored in `localStorage` only, through `src/lib/storage.ts`, which never throws.
- Deployed on Vercel. `vercel.json` rewrites all routes to `index.html` (SPA fallback).

```
src/
  main.tsx, App.tsx          entry + routes
  index.css                  design tokens (CSS variables) + Tailwind
  content/
    course.ts                owner, course, midterm info, planned lecture scope (1–6 …)
    schema.ts                ALL content types (Chapter, ReviewBlock, QuizQuestion, EssayQuestion …)
    validate.ts              validateChapter() — the rules in §6 as code
    registry.ts              auto-discovers chapters/*/index.ts, validates, sorts by number
    chapters/lecture-NN/
      meta.ts                id, number, title, description, minutes, objectives
      review.ts              review sections, exam points, quick revision
      essays.ts              essay questions
      quiz.ts                exactly 20 MCQs
      index.ts               assembles and exports `chapter`
  components/
    layout/                  header, footer, theme toggle, page shell
    ui/                      small shared primitives (button, badge, progress …)
    review/                  review block renderer, code block, rich text, TOC
    quiz/                    quiz engine UI (runner, navigator, summary, results)
    essays/                  essay list / card
  pages/                     route-level pages only
  lib/                       pure logic: quiz scoring, storage, progress, theme, highlighting
scripts/
  new-chapter.mjs            scaffolds a chapter folder (refuses to overwrite)
  verify-build.mjs           fails if dist/ contains PDFs/slide decks or private paths
private-material/            LOCAL ONLY — original lecture files (git-ignored)
```

## 3. Naming conventions

- Chapter folder and id: `lecture-NN` with a two-digit number (`lecture-07`, `lecture-12`).
- `meta.number` must equal NN. The id must be unique. Folder name must equal `meta.id`.
- Section ids, essay ids, and question ids are kebab-case and unique within a chapter.
  Question ids: `l07-q01` … `l07-q20`. Essay ids: `l07-e01` … .
- Components: `PascalCase.tsx`, one main component per file. Pure helpers: `camelCase.ts`.
- Tests sit next to the code they test: `thing.test.ts(x)`.

## 4. Coding standards

- `strict` TypeScript. No `any`, no `@ts-ignore`, no `eslint-disable` without a written reason.
- Prefer plain functions and small components. Do not add state libraries, CSS-in-JS, or UI kits.
- Pure logic (scoring, validation, storage) lives in `src/lib` or `src/content` and is unit-tested.
- Never use `dangerouslySetInnerHTML`. Inline formatting in content uses the tiny `RichText`
  syntax: `**bold**` and `` `code` `` only.
- No dead links, no placeholder buttons, and no controls that look clickable but do nothing.
- Keep dependencies minimal. Adding one requires a clear reason that you report to the owner.

## 5. Design system (visual consistency)

- All colours are CSS variables in `src/index.css` (`--bg`, `--surface`, `--ink`, `--muted`,
  `--line`, `--accent`, `--accent-ink`, `--accent-soft`, `--warm`, `--good`, `--bad`, …), defined for both
  `[data-theme="light"]` and `[data-theme="dark"]`. They are exposed to Tailwind via `@theme`.
  **Never** hard-code hex colours in components.
- Typography: Fraunces (display/headings), IBM Plex Sans (body/UI), JetBrains Mono (code, numerals in data),
  self-hosted via `@fontsource`. Do not add other fonts.
- Visual identity: the "fork–join lanes" motif (parallel thread lines), large serif lecture numerals,
  paper-like light theme, ink-blue dark theme, one teal accent, plus a warm amber reserved for exam tips.
- Callout tones have fixed meanings: `exam` (amber), `tip` (accent), `warning` (red), `note` (neutral),
  `example` (accent outline). Use them consistently.
- Reuse existing components (`ButtonLink`, `Badge`, `Callout`, `ProgressBar`, `SectionHeading`, `CodeBlock`).
  Do not build a one-off variant if an existing component plus a prop will do.
- Motion: subtle and short (≤ 250 ms), always via `motion` with `MotionConfig reducedMotion="user"`.
  Use it for meaning (question transitions, reveal), never for decoration loops.

## 6. Content schema and validation rules (enforced by `validate.ts` and tests)

A chapter is valid only if all of the following hold:

1. `meta.id` matches `/^lecture-\d{2}$/` and `meta.number` matches the id.
2. Non-empty `title`, `description`, at least 3 `objectives`, and at least 3 review `sections`.
3. Every review section has a unique id, a title, and at least one block.
4. `examPoints` has at least 3 items and `quickRevision` has at least 5 items.
5. Between 5 and 10 essay questions, each with prompt, ≥ 3 key concepts, a model answer, and `whyItMatters`.
6. **Exactly 20 quiz questions.** Each has a unique id, a non-empty prompt, **exactly four distinct,
   non-empty options**, an `answer` index in `0..3`, and a non-empty `explanation`.
7. Prompts are unique within a quiz (no duplicate questions).
8. Correct answers are spread across A–D. No single letter may be correct for more than 8 of 20 questions.

The registry excludes invalid chapters at runtime and logs the errors. The test suite fails if
**any** chapter is invalid, so `npm test` is the gate.

## 7. PDF privacy and intellectual property (strict)

- Original lecture files go in `private-material/` only. They are git-ignored (`/private-material/*`,
  `*.pdf`, `*.pptx`, …). **Never** weaken these rules, and never add a PDF exception without the
  owner's explicit approval.
- Never copy, embed, link to, or serve lecture files from `public/`, `src/`, `dist/`, releases, or any
  external host. Never upload them to external services.
- Never show local filesystem paths or original file names in the UI.
- Extracted text and rendered slide images are temporary working files. Keep them **outside the
  repository** (for example, in the agent's scratch directory), and never commit them.
- Write **original explanations**. Do not paste slide text verbatim beyond short technical terms,
  definitions, or code fragments that are needed for correctness. Never reconstruct whole slides.
- Every fact must be supported by the lecture. When general background that the lecture only
  references (for example, a linked video) is needed, label it as background ("Background: …").
  Never claim that something appears in a lecture unless it does.
- If a slide contains an obvious error (for example, a mismatched function description), teach the
  correct version and briefly note the discrepancy. Never silently copy the error.
- `npm run verify:build` must pass before you report completion. It scans `dist/` for slide files and
  private paths.

## 8. Review-note standards

- Order: learning objectives, then concept sections in lecture order, then definitions, comparisons,
  code walkthroughs, exam points, and quick revision.
- Each section should be readable in under 3 minutes. Prefer short paragraphs, lists, and tables over
  walls of text.
- Use `definitions` blocks for terms, `table` for comparisons, `code` (with `explanation` bullets) for
  code, `formula` for equations, and `callout tone="exam"` for exam traps.
- Code must compile in spirit and match the lecture's API usage. Fix obvious slide typos (for example,
  `Void main`) and say so in the explanation.
- Exam points highlight distinctions and common misunderstandings. Quick revision consists of 6–12
  single-line facts.

## 9. Quiz standards

- Exactly 20 questions. Cover the lecture's objectives broadly: definitions, comparisons, reasoning,
  and code interpretation (when the lecture has code).
- One unambiguously correct option. Distractors must be plausible and based on misconceptions.
  Avoid "all of the above", trick wording, and trivia that is absent from the lecture.
- Do not create several questions that test the same fact.
- Every explanation says why the answer is right and, when useful, why a tempting distractor is wrong.
- Balance the answer letters (see §6.8).
- Correct answers and explanations are never displayed before submission.

## 10. Essay standards

- 5–10 prompts per lecture, using a mix of styles: `define-explain`, `compare-contrast`, `process`,
  `advantages-limitations`, `discuss`, `trace-code`.
- Each prompt has: `keyConcepts` (what a marker looks for), `modelAnswer` (paragraphs or points),
  `whyItMatters`, and, when helpful, a `structure` outline.
- Model answers teach how to build an answer. They are not paragraphs to memorise.

## 11. Chapter registration and discovery

- Discovery is automatic. Any `src/content/chapters/lecture-NN/index.ts` that exports `chapter`
  appears on the home page, in the routes, on the essays page, and in the quiz engine.
- **Do not** edit `HomePage`, routes, the quiz engine, or shared components to add a lecture.
- Lectures in `course.ts → plannedLectures` that have no chapter are shown as "Not yet added".
  Lectures beyond the planned list (7, 8, …) are added to `plannedLectures` when their chapter is
  added. This is the **only** shared file that may change when you add a lecture.

## 12. Accessibility and responsive design

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, and logical heading order.
- Quiz options are real radio inputs inside a `fieldset` with a `legend`. Everything works with the
  keyboard, and focus is always visible (`:focus-visible` ring uses `--accent`).
- Touch targets are at least 44 px. There must be no horizontal page overflow at 320 px. Tables and
  code scroll inside their own containers.
- Respect `prefers-reduced-motion`. Maintain WCAG AA contrast in both themes.
- Loading, empty, and error states use clear language (unknown lecture → helpful 404 with links).

## 13. Theme persistence

- `localStorage["pca-theme"]` holds `"light"` or `"dark"`. When it is absent, the site follows
  `prefers-color-scheme`.
- An inline script in `index.html` sets `data-theme` before first paint (no flash). Keep it in sync
  with `src/lib/theme.ts`.

## 14. Testing and build requirements

Run all of these before reporting completion, and report the real results:

```
npm run typecheck      # tsc -b
npm run lint           # eslint
npm test               # vitest run (content validation, scoring, quiz UI, theme, registry, routes)
npm run build          # production build
npm run verify:build   # no slide files / private paths in dist
```

Fix the failures you introduced. Never weaken a test or validation rule to get to green.

## 15. Deployment (Vercel)

- Framework preset: Vite. Build: `npm run build`. Output: `dist`. Install: `npm install`. Node ≥ 20.
- No environment variables are required. `vercel.json` provides the SPA rewrite.
- Never deploy, create remotes, or change account settings without the owner's explicit approval.

## 16. Procedure for adding a new lecture (follow exactly)

1. Read this file.
2. Find the new file in `private-material/` and identify the lecture number and title from its
   content, not just its file name.
3. Extract the content (with `pdftotext`, by rendering pages to images when the text layer is broken,
   or by unzipping the slide XML for `.pptx`). Store working files **outside** the repo. Never invent
   content from unreadable pages. Report them instead.
4. Check `src/content/chapters/` for an existing chapter with the same id or number. **Do not overwrite
   existing content** without the owner's explicit authorisation. Stop and ask if one exists.
5. Run `npm run new-chapter -- <number> "<Title>"` to scaffold `lecture-NN/`.
6. Write `meta.ts`, `review.ts`, `essays.ts`, and `quiz.ts` according to §6–§10.
7. If the lecture number is not in `course.ts → plannedLectures`, add it there. Change nothing else
   in shared code.
8. Verify that previous chapters are untouched: `git diff --stat -- src/content/chapters` must list
   only the new folder.
9. Run the full check list in §14.
10. Confirm that the source file is still ignored (`git check-ignore -v private-material/<file>`) and absent
    from `dist/`.
11. Update the README only if the workflow itself changed.
12. Report the files created, the checks run with their real results, and any unreadable pages or remaining issues.

## 17. Preserve existing work

Every change must keep all existing chapters, quizzes, essays, routes, and progress-storage keys
working. Do not rename storage keys (`pca-theme`, `pca-progress-v1`) without a migration.
Do not delete or rewrite another lecture's content unless the owner asks for it.
