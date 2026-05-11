import { NextResponse } from 'next/server';

import { listDashboardPRs } from '@/features/github/api/pulls';
import { getGitHubAccessToken } from '@/features/github/api/token';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getGitHubAccessToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await listDashboardPRs(token);
  return NextResponse.json(data);
}
