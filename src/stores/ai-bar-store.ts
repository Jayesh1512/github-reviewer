import { create } from 'zustand';

interface AIBarStore {
  isExpanded: boolean;
  toggleExpanded: () => void;
  currentConversationId: string | null;
  setConversationId: (id: string | null) => void;
  pendingMessage: string;
  setPendingMessage: (msg: string) => void;
}

export const useAIBarStore = create<AIBarStore>((set) => ({
  isExpanded: false,
  toggleExpanded: () => set((s) => ({ isExpanded: !s.isExpanded })),
  currentConversationId: null,
  setConversationId: (currentConversationId) => set({ currentConversationId }),
  pendingMessage: '',
  setPendingMessage: (pendingMessage) => set({ pendingMessage }),
}));
