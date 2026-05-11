import 'server-only';

import type { PullRequest, PRFile } from '@/types/pr';

import { createGitHubClient } from './client';

export async function fetchPR(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
): Promise<PullRequest> {
  const octokit = createGitHubClient(accessToken);
  const { data } = await octokit.pulls.get({ owner, repo, pull_number: pullNumber });

  return {
    org: owner,
    repo,
    number: data.number,
    title: data.title,
    body: data.body ?? '',
    author: {
      login: data.user?.login ?? 'unknown',
      avatarUrl: data.user?.avatar_url ?? null,
    },
    headSha: data.head.sha,
    baseBranch: data.base.ref,
    headBranch: data.head.ref,
    state: data.merged ? 'merged' : data.state === 'closed' ? 'closed' : 'open',
    reviewers: [],
    labels: data.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '')).filter(Boolean),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function fetchPRFiles(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
): Promise<PRFile[]> {
  const octokit = createGitHubClient(accessToken);
  const files = await octokit.paginate(octokit.pulls.listFiles, {
    owner,
    repo,
    pull_number: pullNumber,
    per_page: 100,
  });

  return files.map((f) => ({
    path: f.filename,
    status: mapStatus(f.status),
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch,
  }));
}

function mapStatus(s: string): PRFile['status'] {
  if (s === 'added') return 'added';
  if (s === 'removed') return 'removed';
  if (s === 'renamed') return 'renamed';
  return 'modified';
}

/** GitHub search issue items often omit `repository`; `repository_url` is reliable. */
export function issueRepoFullName(item: {
  repository?: { full_name?: string } | null;
  repository_url?: string;
}): string | null {
  const fromNested = item.repository?.full_name;
  if (fromNested) return fromNested;
  const url = item.repository_url;
  if (!url) return null;
  const m = url.match(/\/repos\/([^/]+)\/([^/]+)(?:$|\?)/);
  return m ? `${m[1]}/${m[2]}` : null;
}

/** Open PRs from GitHub search (paginated; search max 100 per page, 1000 results cap). */
export type DashboardSearchIssue = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  updated_at?: string;
  repository_url?: string;
  repository?: { full_name?: string } | null;
};

async function searchIssuesAllPages(
  octokit: ReturnType<typeof createGitHubClient>,
  q: string,
  maxPages = 10,
): Promise<DashboardSearchIssue[]> {
  const out: DashboardSearchIssue[] = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const { data } = await octokit.search.issuesAndPullRequests({
      q,
      per_page: 100,
      page,
    });
    out.push(...(data.items as DashboardSearchIssue[]));
    if (data.items.length < 100) break;
  }
  return out;
}

function dedupeIssuesById(items: DashboardSearchIssue[]): DashboardSearchIssue[] {
  const map = new Map<number, DashboardSearchIssue>();
  for (const item of items) map.set(item.id, item);
  return [...map.values()].sort((a, b) => {
    const tb = new Date(b.updated_at ?? 0).getTime();
    const ta = new Date(a.updated_at ?? 0).getTime();
    return tb - ta;
  });
}

/** Explicit request + assignee (OR query, with fallback if GitHub rejects the grouped query). */
async function searchIndividualReviewQueue(
  octokit: ReturnType<typeof createGitHubClient>,
  login: string,
): Promise<DashboardSearchIssue[]> {
  const combined = `is:open is:pr (review-requested:${login} OR assignee:${login})`;
  try {
    return await searchIssuesAllPages(octokit, combined);
  } catch {
    const [requested, assigned] = await Promise.all([
      searchIssuesAllPages(octokit, `is:open is:pr review-requested:${login}`),
      searchIssuesAllPages(octokit, `is:open is:pr assignee:${login}`),
    ]);
    return dedupeIssuesById([...requested, ...assigned]);
  }
}

/** Orgs/teams the user belongs to (needs `read:org` on the GitHub OAuth token). */
async function listUserTeamsForReviewQueries(
  octokit: ReturnType<typeof createGitHubClient>,
): Promise<{ org: string; slug: string }[]> {
  try {
    const teams = await octokit.paginate(octokit.rest.teams.listForAuthenticatedUser, {
      per_page: 100,
    });
    return teams
      .map((t) => ({
        org: t.organization?.login ?? '',
        slug: t.slug,
      }))
      .filter((t): t is { org: string; slug: string } => Boolean(t.org && t.slug));
  } catch {
    return [];
  }
}

export type DashboardPRLists = {
  /** Open PRs you should review: explicit request, assignee, or team request (deduped). */
  needsReview: DashboardSearchIssue[];
  /** Open PRs you authored. */
  authored: DashboardSearchIssue[];
};

/**
 * Dashboard PRs for analysis:
 * - **Your PRs:** `author:you`
 * - **Needs your review:** `review-requested:you` OR `assignee:you`, plus `team-review-requested:org/team` for each of your teams (requires `read:org`).
 */
export async function listDashboardPRs(accessToken: string): Promise<DashboardPRLists> {
  const octokit = createGitHubClient(accessToken);
  const { data: me } = await octokit.users.getAuthenticated();
  const login = me.login;

  const [authored, individualQueue, teams] = await Promise.all([
    searchIssuesAllPages(octokit, `is:open is:pr author:${login}`),
    searchIndividualReviewQueue(octokit, login),
    listUserTeamsForReviewQueries(octokit),
  ]);

  const teamReview: DashboardSearchIssue[] = [];
  for (const { org, slug } of teams) {
    const q = `is:open is:pr team-review-requested:${org}/${slug}`;
    const items = await searchIssuesAllPages(octokit, q, 5);
    teamReview.push(...items);
  }

  const needsReview = dedupeIssuesById([...individualQueue, ...teamReview]);

  return { needsReview, authored };
}
