import 'server-only';

import { createGitHubClient } from './client';

export async function fetchFileContent(
  accessToken: string,
  owner: string,
  repo: string,
  path: string,
  ref: string,
): Promise<string | null> {
  const octokit = createGitHubClient(accessToken);
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref,
  });
  if (!('content' in data) || typeof data.content !== 'string') return null;
  return Buffer.from(data.content, 'base64').toString('utf8');
}
