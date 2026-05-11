import Link from 'next/link';

import { ContentArea } from '@/components/layout/content-area';
import { listDashboardPRs } from '@/features/github/api/pulls';
import { getGitHubAccessTokenFromCookies } from '@/features/github/api/token';
import { buildPRUrl } from '@/lib/utils/url';

export default async function DashboardPage() {
  const token = await getGitHubAccessTokenFromCookies();
  if (!token) {
    return (
      <ContentArea>
        <p className="text-sm text-muted-foreground">Sign in to load pull requests.</p>
      </ContentArea>
    );
  }

  const { reviewRequested, authored } = await listDashboardPRs(token);

  function lineHref(item: { number: number; repository?: { full_name: string } | null }) {
    const fn = item.repository?.full_name;
    if (!fn) return null;
    const [org, repo] = fn.split('/');
    if (!org || !repo) return null;
    return buildPRUrl(org, repo, item.number);
  }

  return (
    <ContentArea>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Open pull requests where you are a reviewer or the author.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-muted-foreground">Review requested</h2>
        <ul className="mt-3 space-y-2">
          {reviewRequested.map((item) => {
            const href = lineHref(item);
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
          {reviewRequested.length === 0 ? (
            <li className="text-sm text-muted-foreground">None— you are all caught up.</li>
          ) : null}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-muted-foreground">Your PRs</h2>
        <ul className="mt-3 space-y-2">
          {authored.map((item) => {
            const href = lineHref(item);
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
