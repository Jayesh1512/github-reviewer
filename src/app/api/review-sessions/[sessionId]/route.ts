import { NextResponse } from 'next/server';

import { auth } from '@/features/auth/auth';
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  _ctx: { params: Promise<{ sessionId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ session: null, message: 'Not implemented' }, { status: 404 });
}

export async function PATCH(
  _req: NextRequest,
  _ctx: { params: Promise<{ sessionId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ message: 'Update session — coming soon' }, { status: 501 });
}
