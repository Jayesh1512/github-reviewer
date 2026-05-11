export function buildReviewSystemPrompt(): string {
  return `You are an expert code reviewer embedded in GitReview. Be concise, actionable, and grounded in the code provided.`;
}

export function buildUserPrompt(context: {
  message: string;
  filePath?: string;
  selectedSnippet?: string;
  prTitle?: string;
}): string {
  const parts = [context.message];
  if (context.filePath) parts.push(`\n\nFile: ${context.filePath}`);
  if (context.selectedSnippet) parts.push(`\n\nSelected code:\n${context.selectedSnippet}`);
  if (context.prTitle) parts.push(`\n\nPR: ${context.prTitle}`);
  return parts.join('');
}
