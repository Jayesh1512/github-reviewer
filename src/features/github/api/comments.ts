import 'server-only';

import { createGitHubClient } from './client';

export async function postInlineComment(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
  body: {
    path: string;
    commitId: string;
    line: number;
    side: 'LEFT' | 'RIGHT';
    body: string;
  },
) {
  const octokit = createGitHubClient(accessToken);
  return octokit.pulls.createReviewComment({
    owner,
    repo,
    pull_number: pullNumber,
    body: body.body,
    path: body.path,
    commit_id: body.commitId,
    line: body.line,
    side: body.side === 'LEFT' ? 'LEFT' : 'RIGHT',
  });
}

export async function submitPullReview(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
  input: { event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT'; body?: string },
) {
  const octokit = createGitHubClient(accessToken);
  return octokit.pulls.createReview({
    owner,
    repo,
    pull_number: pullNumber,
    event: input.event,
    body: input.body,
  });
}
