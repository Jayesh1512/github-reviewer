import { notFound } from 'next/navigation';

import { fetchPR } from '@/features/github/api/pulls';
import { getGitHubAccessTokenFromCookies } from '@/features/github/api/token';

export default async function PullRequestLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ org: string; repo: string; id: string }>;
}) {
  const { org, repo, id } = await params;
  const n = Number.parseInt(id, 10);
  if (Number.isNaN(n)) notFound();

  const token = await getGitHubAccessTokenFromCookies();
  if (!token) notFound();

  let pr;
  try {
    pr = await fetchPR(token, org, repo, n);
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b px-4 py-3">
        <p className="text-xs text-muted-foreground">
          {org}/{repo}
        </p>
        <h1 className="text-lg font-semibold leading-tight">{pr.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {pr.state === 'open' ? 'Open' : pr.state === 'merged' ? 'Merged' : 'Closed'} ·{' '}
          {pr.author.login}
        </p>
      </div>
      {children}
    </div>
  );
}
