import en, { type TranslationKey } from './en';
import ta from './ta';
import { useLanguage } from '../store/language';

const dictionaries = { en, ta };

export function useTranslation() {
  const lang = useLanguage((s) => s.lang);
  const t = (key: TranslationKey): string => dictionaries[lang][key];
  return { lang, t };
}
