export type Category =
  | 'education'
  | 'women-children'
  | 'health'
  | 'agriculture'
  | 'employment'
  | 'social-welfare'
  | 'differently-abled'
  | 'housing';

export type DataStatus = 'demo' | 'verified';

export interface Scheme {
  id: string;
  nameEn: string;
  nameTa: string;
  department: string;
  category: Category;
  tags: string[];
  dataStatus: DataStatus;
  officialPageUrl: string | null;
  sourceUrl: string | null;
  verificationDate: string | null;
  goRef: string | null;
  benefits: string[] | null;
  eligibility: string[] | Record<string, string[]>;
  documents: string[] | Record<string, string[]> | null;
  howToApply: string | null;
  applicationMode: string | null;
  applicationUrl: string | null;
  notes: string;
}
