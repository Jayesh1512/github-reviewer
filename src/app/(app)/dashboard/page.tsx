import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ContentArea } from '@/components/layout/content-area';
import { DashboardReconnectActions } from '@/app/(app)/dashboard/dashboard-reconnect-actions';
import { auth } from '@/features/auth/auth';
import {
  issueRepoFullName,
  listDashboardPRs,
  type DashboardSearchIssue,
} from '@/features/github/api/pulls';
import { getGitHubAccessTokenFromCookies } from '@/features/github/api/token';
import { buildPRUrl } from '@/lib/utils/url';

function prHref(item: DashboardSearchIssue): string | null {
  const full = issueRepoFullName(item);
  if (!full) return null;
  const [org, repo] = full.split('/');
  if (!org || !repo) return null;
  return buildPRUrl(org, repo, item.number);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=%2Fdashboard');
  }

  const token = await getGitHubAccessTokenFromCookies();
  if (!token) {
    return (
      <ContentArea>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          You are signed in, but a GitHub access token was not found in your session. Sign in again
          so we can list your pull requests.
        </p>
        <DashboardReconnectActions />
      </ContentArea>
    );
  }

  const { needsReview, authored } = await listDashboardPRs(token);

  return (
    <ContentArea>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Open pull requests you authored, or that need your review (requested reviewer, assignee, or
        team review).
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-muted-foreground">Needs your review</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Includes explicit review requests, PRs assigned to you, and team review requests when
          GitHub has <code className="rounded bg-muted px-1">read:org</code> scope.
        </p>
        <ul className="mt-3 space-y-2">
          {needsReview.map((item) => {
            const href = prHref(item);
            return (
              <li key={item.id}>
                {href ? (
                  <Link href={href} className="text-sm font-medium hover:underline">
                    {item.title}
                  </Link>
                ) : (
                  <a href={item.html_url} className="text-sm font-medium hover:underline">
                    {item.title}
                  </a>
                )}
                <span className="ml-2 text-xs text-muted-foreground">#{item.number}</span>
              </li>
            );
          })}
          {needsReview.length === 0 ? (
            <li className="text-sm text-muted-foreground">None— you are all caught up.</li>
          ) : null}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-muted-foreground">Your PRs</h2>
        <ul className="mt-3 space-y-2">
          {authored.map((item) => {
            const href = prHref(item);
            return (
              <li key={item.id}>
                {href ? (
                  <Link href={href} className="text-sm font-medium hover:underline">
                    {item.title}
                  </Link>
                ) : (
                  <a href={item.html_url} className="text-sm font-medium hover:underline">
                    {item.title}
                  </a>
                )}
                <span className="ml-2 text-xs text-muted-foreground">#{item.number}</span>
              </li>
            );
          })}
          {authored.length === 0 ? (
            <li className="text-sm text-muted-foreground">No open authored PRs.</li>
          ) : null}
        </ul>
      </section>
    </ContentArea>
  );
}
