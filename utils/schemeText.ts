import type { Lang } from '../store/language';

export function pick(lang: Lang, en: string, ta: string): string {
  return lang === 'ta' ? ta : en;
}
