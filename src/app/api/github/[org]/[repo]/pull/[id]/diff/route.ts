import { NextResponse } from 'next/server';

import { parsePatch } from '@/features/diff-viewer/lib/parse-diff';
import { fetchPRFiles } from '@/features/github/api/pulls';
import { getGitHubAccessToken } from '@/features/github/api/token';
import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ org: string; repo: string; id: string }> },
) {
  const { org, repo, id } = await ctx.params;
  const prNumber = Number.parseInt(id, 10);
  const path = req.nextUrl.searchParams.get('path');
  if (Number.isNaN(prNumber) || !path) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const token = await getGitHubAccessToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const files = await fetchPRFiles(token, org, repo, prNumber);
    const file = files.find((f) => f.path === path);
    if (!file?.patch) {
      return NextResponse.json({ hunks: [], note: 'No patch (binary or large file)' });
    }
    const hunks = parsePatch(file.patch);
    return NextResponse.json({ hunks });
  } catch {
    return NextResponse.json({ error: 'Failed to load diff' }, { status: 502 });
  }
}
