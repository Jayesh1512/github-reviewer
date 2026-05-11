import { PRReviewPage } from '@/features/review-session/components/pr-review-page';

export default async function PullRequestPage({
  params,
}: {
  params: Promise<{ org: string; repo: string; id: string }>;
}) {
  const { org, repo, id } = await params;
  const prNumber = Number.parseInt(id, 10);
  return <PRReviewPage org={org} repo={repo} prNumber={prNumber} />;
}
