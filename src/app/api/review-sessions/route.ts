import { NextResponse } from 'next/server';

import { auth } from '@/features/auth/auth';
import type { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ sessions: [] });
}

export async function POST(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ message: 'Create session — coming soon' }, { status: 501 });
}
