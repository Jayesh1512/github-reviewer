import { NextResponse } from 'next/server';

import { streamChat } from '@/features/ai-bar/lib/gemini-client';
import { buildReviewSystemPrompt, buildUserPrompt } from '@/features/ai-bar/lib/prompt-builder';
import { auth } from '@/features/auth/auth';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { message?: string; filePath?: string; selectedSnippet?: string; prTitle?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const system = buildReviewSystemPrompt();
  const userContent = buildUserPrompt({
    message,
    filePath: body.filePath,
    selectedSnippet: body.selectedSnippet,
    prTitle: body.prTitle,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamChat([{ role: 'user', content: userContent }], system)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (e) {
        controller.enqueue(
          encoder.encode(
            e instanceof Error ? `\n[error] ${e.message}` : '\n[error] AI request failed.',
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
