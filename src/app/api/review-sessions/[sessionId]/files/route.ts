import { NextResponse } from 'next/server';

import { auth } from '@/features/auth/auth';
import type { NextRequest } from 'next/server';

export async function PATCH(
  _req: NextRequest,
  _ctx: { params: Promise<{ sessionId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ message: 'Update file status — coming soon' }, { status: 501 });
}
