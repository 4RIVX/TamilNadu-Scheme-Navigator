import { create } from 'zustand';

interface ChatContextState {
  activeSchemeId: string | null;
  setActiveSchemeId: (id: string | null) => void;
}

export const useChatContext = create<ChatContextState>((set) => ({
  activeSchemeId: null,
  setActiveSchemeId: (id) => set({ activeSchemeId: id }),
}));
