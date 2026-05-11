import type { BundledLanguage } from 'shiki';

/** Lazy Shiki highlighter — implemented in use-syntax-highlighter hook for browser-only use. */
export async function getHighlighterLang(path: string): Promise<BundledLanguage | 'text'> {
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.ts')) return 'typescript';
  if (path.endsWith('.jsx')) return 'jsx';
  if (path.endsWith('.js') || path.endsWith('.mjs') || path.endsWith('.cjs')) return 'javascript';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  return 'text';
}
