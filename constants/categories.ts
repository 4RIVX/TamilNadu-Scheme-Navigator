import type { Category } from '../types/scheme';
import type { TranslationKey } from '../i18n/en';

export const CATEGORY_LABEL_KEY: Record<Category, TranslationKey> = {
  education: 'catEducation',
  'women-children': 'catWomenChildren',
  health: 'catHealth',
  agriculture: 'catAgriculture',
  employment: 'catEmployment',
  'social-welfare': 'catSocialWelfare',
  'differently-abled': 'catDifferentlyAbled',
  housing: 'catHousing',
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL_KEY) as Category[];
