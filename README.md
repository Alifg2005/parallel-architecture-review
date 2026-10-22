# Parallel Computer Architecture — Review Platform

A static study site for **Parallel Computer Architecture**, built by **Ali Feras Alghanim**.
For every available lecture, it provides a structured review, essay practice with model answers, and a
20-question multiple-choice quiz with scored results and explanations.

> **Coding agents: read [`AGENTS.md`](./AGENTS.md) before changing anything.** It is the project's
> engineering and content contract.

- **Stack:** Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 · React Router · Lucide · Motion · Vitest
- **Runtime:** a pure static SPA. There is no backend, no database, no login, and no AI or API calls.
- **Privacy:** progress and theme are stored only in the visitor's browser (`localStorage`).

## Contents (midterm scope: Lectures 1–6, Week 9)

| # | Lecture | Source used |
|---|---------|-------------|
| 1 | Why Parallel Computing? | PDF (text + rendered image slides) |
| 2 | MultiCore Processors | PDF (text layer unreadable → every page rendered and read visually) |
| 3 | Introduction to Parallel Computer Architecture and Programming | PDF (text + rendered equation/diagram slides) |
| 4 | DAGs, Coarse and Fine, Von Neumann Architecture, SISD, SIMD, MISD, MIMD | **PPTX** (slide XML extracted) |
| 5 | PThreads | PDF |
| 6 | Parallel Programming Using OpenMP | PDF (text + rendered diagram slides) |

Each lecture has a review page, 6–9 essay prompts, and exactly 20 validated quiz questions
(120 questions and 46 essay prompts in total).

## Local development

Requires **Node.js 20 or later** (developed on Node 26) and npm.

```bash
npm install          # install dependencies (lockfile committed)
npm run dev          # start the dev server at http://localhost:5173
```

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server with hot reload |
| `npm run typecheck` | `tsc -b` strict type check |
| `npm run lint` | ESLint |
| `npm test` | Vitest: content validation, scoring, quiz UI, routes, theme, progress, registry |
| `npm run validate:content` | Only the content/registry tests |
| `npm run build` | Type check + production build to `dist/` |
| `npm run verify:build` | Fails if `dist/` contains PDFs/slide decks or private paths, or if Git tracks any lecture file |
| `npm run preview` | Serve the production build locally |
| `npm run check` | All of the above, in order |
| `npm run new-chapter -- <n> "<Title>"` | Scaffold a new lecture folder (refuses to overwrite) |

## How the content is organised

```
src/content/
  course.ts                 owner, course name, midterm info, planned lecture list
  schema.ts                 types for chapters, review blocks, essays, quiz questions
  validate.ts               validation rules (exactly 20 questions, 4 distinct options, …)
  registry.ts               auto-discovers chapters/*/index.ts with import.meta.glob
  chapters/lecture-NN/
    meta.ts                 title, description, objectives, study time
    review.ts               review sections, exam points, quick revision
    essays.ts               essay questions + model answers
    quiz.ts                 exactly 20 MCQs + answer key + explanations
    index.ts                assembles the chapter
```

Any folder `src/content/chapters/lecture-NN/` that exports a valid `chapter` automatically appears on
the home page, in the routes (`/lectures/lecture-NN`, `/essays`, `/quiz`), on the essay page and in
the quiz engine. You never need to edit pages or components to add a lecture.

## Adding a new lecture (one instruction)

1. Put the lecture file (PDF or PPTX) in `private-material/`. It is git-ignored automatically.
2. Give your coding agent this instruction:

> Read `AGENTS.md` first and follow §16 exactly. A new lecture file is in `private-material/`:
> **`<file name>`**. Identify its lecture number and title from the content, extract and analyse it
> (keeping working files outside the repo), and check that no chapter with that id or number already
> exists. Do not overwrite existing content. Scaffold it with `npm run new-chapter`, then write the
> review notes, 5–10 essay questions with model answers, and exactly 20 validated multiple-choice
> questions (four options, one correct answer, explanations, balanced answer letters) using the
> existing schemas. Add the lecture to `plannedLectures` in `course.ts` if it is missing. Confirm that
> no other chapter changed, run `npm run check`, confirm the source file is still git-ignored and
> absent from `dist/`, and report the files created, the checks you ran with their results, and any
> unreadable pages or open issues.

**Example for Lecture 7:**

> Read `AGENTS.md` first and follow §16 exactly. A new lecture file is in `private-material/`:
> **`07 Parallel Programming-MPI.pdf`**. Identify its lecture number and title … *(rest as above)*

The scaffold script only creates the files. A script cannot read a PDF and write good questions, so the
agent writes the content and the schema validation plus tests enforce its structure. The new chapter
stays invalid, and `npm test` fails, until the quiz has exactly 20 valid questions.

## Lecture-file privacy

- Original slides live **only** in `private-material/`. `.gitignore` ignores `/private-material/*`
  (except `.gitkeep` and its README) and **all** `*.pdf`, `*.ppt(x)`, `*.key` and `*.odp` files anywhere.
- Nothing in `public/` or `src/` references the slides. The site shows original summaries, not slide text.
- `npm run verify:build` scans `dist/` for slide files and local paths, and checks that Git tracks no
  lecture files. Run it before every deployment.
- Check a file yourself: `git check-ignore -v "private-material/<file>"`.

## Deploying to Vercel

The repo is ready for Vercel's Vite preset. `vercel.json` sets the build command, output folder, an
SPA rewrite (so `/lectures/...` deep links work), and long-term caching for hashed assets.

1. Push the repository to GitHub (lecture files are ignored, so they are not pushed).
2. In Vercel: **Add New → Project → Import** the GitHub repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`. Install
   command: `npm install`. No environment variables are needed.
4. Click **Deploy**. Every push to the default branch redeploys.

CLI alternative: `npx vercel` (preview) and then `npx vercel --prod`.

## Notes on accuracy

- Content is written from the lecture files only. Where a lecture **names** a topic without teaching it
  (Flynn's taxonomy in Lecture 4, the "Why?" behind the power claim in Lecture 3, latency and throughput in
  Lecture 1), the explanation is labelled **Background**.
- Obvious slide errors are taught correctly and flagged in place: `usleep(3000)` is 3 ms, not 3 s
  (Lecture 5); the OpenMP lock functions are listed with shifted descriptions (Lecture 6); and
  `Void main` and the AVX intrinsic names are slide typos (Lectures 2 and 5).
- Some slides refer to handouts on Blackboard (communication overhead, merge-sort benchmarking).
  Those handouts were not provided, so their calculations are not reproduced.
