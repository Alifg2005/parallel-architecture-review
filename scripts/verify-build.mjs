#!/usr/bin/env node
/**
 * Fails if the production build could leak private lecture material:
 *  - any slide/PDF file in dist/
 *  - any reference to the private-material folder or local filesystem paths in built files
 *  - any slide/PDF file tracked by Git
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const FORBIDDEN_EXT = new Set(['.pdf', '.ppt', '.pptx', '.key', '.odp']);
const TEXT_EXT = new Set(['.html', '.js', '.css', '.json', '.txt', '.svg', '.map']);
const FORBIDDEN_TEXT = [
  /private-material/i,
  /[A-Za-z]:[\\/]{1,2}Users[\\/]/, // Windows user paths, e.g. C:\Users\…
  /\/(Users|home)\/[^/\s"']+\//, // macOS / Linux home paths
];

const problems = [];

if (!existsSync(dist)) {
  console.error('✖ dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else check(full);
  }
}

function check(file) {
  const rel = relative(root, file);
  const ext = extname(file).toLowerCase();
  if (FORBIDDEN_EXT.has(ext)) problems.push(`slide/PDF file in build output: ${rel}`);
  if (TEXT_EXT.has(ext)) {
    const text = readFileSync(file, 'utf8');
    for (const pattern of FORBIDDEN_TEXT) {
      if (pattern.test(text)) problems.push(`${rel} contains a private path or folder reference (${pattern})`);
    }
  }
}

walk(dist);

try {
  const tracked = execSync('git ls-files', { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter((f) => FORBIDDEN_EXT.has(extname(f).toLowerCase()) || f.startsWith('private-material/'))
    .filter((f) => !['private-material/.gitkeep', 'private-material/README.md'].includes(f));
  for (const f of tracked) problems.push(`tracked by Git: ${f}`);
} catch {
  console.warn('⚠ Git not available; skipped the tracked-files check.');
}

if (problems.length) {
  console.error('✖ Build verification failed:\n  - ' + problems.join('\n  - '));
  process.exit(1);
}
console.log('✔ dist/ contains no slide/PDF files or private paths, and no lecture files are tracked by Git.');
