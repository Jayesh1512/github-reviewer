import { NextResponse } from 'next/server';

import { fetchPR } from '@/features/github/api/pulls';
import { getGitHubAccessToken } from '@/features/github/api/token';
import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ org: string; repo: string; id: string }> },
) {
  const { org, repo, id } = await ctx.params;
  const prNumber = Number.parseInt(id, 10);
  if (Number.isNaN(prNumber)) {
    return NextResponse.json({ error: 'Invalid PR number' }, { status: 400 });
  }

  const token = await getGitHubAccessToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pr = await fetchPR(token, org, repo, prNumber);
    return NextResponse.json(pr);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
