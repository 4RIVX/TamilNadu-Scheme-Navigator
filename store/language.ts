import { create } from 'zustand';
import { config } from '../constants/config';

export type Lang = 'ta' | 'en';

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguage = create<LanguageState>((set) => ({
  lang: config.defaultLanguage,
  setLang: (lang) => set({ lang }),
}));
