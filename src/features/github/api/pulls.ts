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

/** PRs for dashboard: open PRs where user is requested reviewer or author. */
export async function listDashboardPRs(accessToken: string) {
  const octokit = createGitHubClient(accessToken);
  const { data: me } = await octokit.users.getAuthenticated();
  const login = me.login;

  const [reviewRequested, authored] = await Promise.all([
    octokit.search.issuesAndPullRequests({
      q: `is:open is:pr review-requested:${login}`,
      per_page: 30,
    }),
    octokit.search.issuesAndPullRequests({
      q: `is:open is:pr author:${login}`,
      per_page: 30,
    }),
  ]);

  return {
    reviewRequested: reviewRequested.data.items,
    authored: authored.data.items,
  };
}
