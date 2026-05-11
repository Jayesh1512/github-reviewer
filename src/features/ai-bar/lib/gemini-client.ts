import { GoogleGenerativeAI } from '@google/generative-ai';

import { AI } from '@/config/constants';
import { env } from '@/env';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export function getModel(systemPrompt: string, modelName: string = AI.MODEL) {
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
  });
}

export async function* streamChat(
  messages: { role: string; content: string }[],
  systemPrompt: string,
): AsyncGenerator<string, void, undefined> {
  const model = getModel(systemPrompt);
  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
  });

  const last = messages[messages.length - 1];
  if (!last) return;

  const result = await chat.sendMessageStream(last.content);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
