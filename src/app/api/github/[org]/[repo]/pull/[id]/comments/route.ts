import { NextResponse } from 'next/server';

import { getGitHubAccessToken } from '@/features/github/api/token';
import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  _ctx: { params: Promise<{ org: string; repo: string; id: string }> },
) {
  const token = await getGitHubAccessToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ comments: [], message: 'Fetch comments — coming soon' });
}

export async function POST(
  req: NextRequest,
  _ctx: { params: Promise<{ org: string; repo: string; id: string }> },
) {
  const token = await getGitHubAccessToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  void req.json().catch(() => null);
  return NextResponse.json({ ok: false, message: 'Post comment — coming soon' }, { status: 501 });
}
