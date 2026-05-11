import { siteConfig } from '@/config/site';

export function buildPRUrl(org: string, repo: string, prNumber: number): string {
  const base = siteConfig.url.replace(/\/$/, '');
  return `${base}/${org}/${repo}/pull/${prNumber}`;
}

const GH_PR_REGEX =
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)\/?(?:\?.*)?$/i;

export function parseGitHubPRUrl(url: string): {
  org: string;
  repo: string;
  number: number;
} | null {
  const m = url.trim().match(GH_PR_REGEX);
  if (!m) return null;
  return { org: m[1], repo: m[2], number: Number.parseInt(m[3], 10) };
}

export function isGitHubUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === 'github.com';
  } catch {
    return false;
  }
}
