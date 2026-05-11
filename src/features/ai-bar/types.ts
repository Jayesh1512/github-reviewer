export type AIRole = 'user' | 'assistant';

export type QuickAction =
  | 'explain'
  | 'find_bugs'
  | 'suggest'
  | 'safety'
  | 'summarize_file';

export interface AIMessage {
  id: string;
  role: AIRole;
  content: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  filePath: string;
  messages: AIMessage[];
}
