import { NextResponse } from 'next/server';

import { auth } from '@/features/auth/auth';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  void req.json().catch(() => null);
  return NextResponse.json({ summary: null, message: 'PR summary — coming soon' }, { status: 501 });
}
