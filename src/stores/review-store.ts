import { create } from 'zustand';

export type ViewMode = 'unified' | 'split';

interface ReviewStore {
  activeFilePath: string | null;
  setActiveFilePath: (path: string | null) => void;
  selectedLines: { start: number; end: number } | null;
  setSelectedLines: (lines: { start: number; end: number } | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  activeFilePath: null,
  setActiveFilePath: (activeFilePath) => set({ activeFilePath }),
  selectedLines: null,
  setSelectedLines: (selectedLines) => set({ selectedLines }),
  viewMode: 'unified',
  setViewMode: (viewMode) => set({ viewMode }),
  sessionId: null,
  setSessionId: (sessionId) => set({ sessionId }),
}));
