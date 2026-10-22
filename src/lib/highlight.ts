import type { CodeLanguage } from '../content/schema';

export type TokenKind = 'plain' | 'comment' | 'string' | 'keyword' | 'type' | 'number' | 'preproc' | 'fn';

export interface Token {
  kind: TokenKind;
  text: string;
}

const C_KEYWORDS = new Set([
  'if', 'else', 'for', 'while', 'do', 'return', 'switch', 'case', 'break', 'continue', 'default',
  'sizeof', 'struct', 'typedef', 'const', 'static', 'extern', 'void', 'NULL', 'forall', 'from', 'to',
]);

const C_TYPES = new Set([
  'int', 'float', 'double', 'char', 'long', 'short', 'unsigned', 'signed', 'bool', 'size_t',
  'clock_t', 'pthread_t', 'pthread_mutex_t', 'pthread_attr_t', 'omp_lock_t', '__m256', 'my_args', 'Void',
]);

// Order matters: earlier alternatives win.
const C_PATTERN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])')|(^[ \t]*#[^\n]*)|(\b\d+(?:\.\d+)?f?\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/gm;

function tokenizeC(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(C_PATTERN)) {
    const idx = m.index ?? 0;
    if (idx > last) tokens.push({ kind: 'plain', text: code.slice(last, idx) });
    const [text, comment, str, pre, num, fn, word] = m;
    let kind: TokenKind = 'plain';
    if (comment) kind = 'comment';
    else if (str) kind = 'string';
    else if (pre) kind = 'preproc';
    else if (num) kind = 'number';
    else if (fn) kind = C_KEYWORDS.has(fn) ? 'keyword' : C_TYPES.has(fn) ? 'type' : 'fn';
    else if (word) kind = C_KEYWORDS.has(word) ? 'keyword' : C_TYPES.has(word) ? 'type' : 'plain';
    tokens.push({ kind, text });
    last = idx + text.length;
  }
  if (last < code.length) tokens.push({ kind: 'plain', text: code.slice(last) });
  return tokens;
}

function tokenizeAsm(code: string): Token[] {
  const tokens: Token[] = [];
  const lines = code.split('\n');
  lines.forEach((line, i) => {
    const m = /^(\s*)(\S+)(.*)$/.exec(line);
    if (m) {
      const [, lead = '', op = '', rest = ''] = m;
      if (lead) tokens.push({ kind: 'plain', text: lead });
      tokens.push({ kind: op.startsWith('.') ? 'plain' : 'keyword', text: op });
      for (const part of rest.split(/(\b(?:r\d+|xmm\d+|ymm\d+)\b)/)) {
        if (part) tokens.push({ kind: /^(r|xmm|ymm)\d+$/.test(part) ? 'type' : 'plain', text: part });
      }
    } else {
      tokens.push({ kind: 'plain', text: line });
    }
    if (i < lines.length - 1) tokens.push({ kind: 'plain', text: '\n' });
  });
  return tokens;
}

function tokenizeShell(code: string): Token[] {
  return code.split(/(\s-{1,2}[\w-]+|#[^\n]*)/).filter(Boolean).map((text) => ({
    kind: text.trimStart().startsWith('#') ? 'comment' : text.trimStart().startsWith('-') ? 'keyword' : 'plain',
    text,
  }));
}

export function tokenize(code: string, language: CodeLanguage): Token[] {
  switch (language) {
    case 'c':
      return tokenizeC(code);
    case 'asm':
      return tokenizeAsm(code);
    case 'shell':
      return tokenizeShell(code);
    default:
      return [{ kind: 'plain', text: code }];
  }
}
