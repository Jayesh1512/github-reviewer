import { NextResponse } from 'next/server';

import { categorizeFiles } from '@/features/file-tree/lib/categorize';
import { fetchPRFiles } from '@/features/github/api/pulls';
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
    const files = await fetchPRFiles(token, org, repo, prNumber);
    const tree = categorizeFiles(files);
    return NextResponse.json({ tree });
  } catch {
    return NextResponse.json({ error: 'Failed to load files' }, { status: 502 });
  }
}
