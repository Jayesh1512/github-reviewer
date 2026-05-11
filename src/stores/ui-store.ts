import { create } from 'zustand';

interface UIStore {
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  isShortcutsModalOpen: boolean;
  setShortcutsModalOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarWidth: 320,
  setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
  isShortcutsModalOpen: false,
  setShortcutsModalOpen: (isShortcutsModalOpen) => set({ isShortcutsModalOpen }),
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
}));
