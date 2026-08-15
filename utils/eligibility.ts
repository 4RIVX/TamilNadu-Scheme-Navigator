import type { Scheme } from '../types/scheme';
import type { TranslationKey } from '../i18n/en';

export type AgeGroup = 'below18' | '18-35' | '36-59' | '60+';
export type Gender = 'female' | 'male' | 'other';
export type Occupation = 'student' | 'farmer' | 'employed' | 'self-employed' | 'unemployed';
export type IncomeBand = 'below1l' | '1-2.5l' | 'above2.5l';

export interface UserProfile {
  ageGroup: AgeGroup | null;
  gender: Gender | null;
  occupation: Occupation | null;
  income: IncomeBand | null;
  statuses: string[];
}

export interface MatchResult {
  scheme: Scheme;
  reasons: TranslationKey[];
  openToAll: boolean;
}

interface Rule {
  openToAll?: boolean;
  gender?: Gender[];
  ageGroups?: AgeGroup[];
  occupations?: Occupation[];
  statuses?: string[];
  incomeAtMost?: IncomeBand;
}

const INCOME_ORDER: Record<IncomeBand, number> = { below1l: 0, '1-2.5l': 1, 'above2.5l': 2 };

// Deterministic rules — NO AI involved. Unknown answers never exclude; conflicts exclude.
const RULES: Record<string, Rule> = {
  'magalir-free-bus-travel': { gender: ['female', 'other'] },
  'cm-marriage-assistance': { gender: ['female'], ageGroups: ['18-35'], incomeAtMost: 'below1l' },
  'cradle-baby-scheme': { statuses: ['pregnant'] },
  'cm-free-laptop': { occupations: ['student'], incomeAtMost: '1-2.5l' },
  'free-bus-pass-students': { occupations: ['student'] },
  'makkalai-thedi-maruthuvam': { openToAll: true },
  'amma-clinics': { openToAll: true },
  'amma-unavagam': { openToAll: true },
  'pongal-gift-package': { openToAll: true },
  'uzhavar-santhai': { occupations: ['farmer'] },
  'free-sheep-goat-distribution': { occupations: ['farmer'], incomeAtMost: 'below1l' },
  'kalaignar-kanavu-illam': { incomeAtMost: 'below1l' },
  'uyegp': { ageGroups: ['18-35', '36-59'], occupations: ['unemployed', 'self-employed'] },
  'transgender-welfare': { statuses: ['transperson'] },
  'free-bus-pass-differently-abled': { statuses: ['differently-abled'] },
  'cm-uzhavar-padhukaapu-thittam': { ageGroups: ['60+'], occupations: ['farmer'] },
  'destitute-widow-pension': { statuses: ['widow'], ageGroups: ['18-35', '36-59', '60+'] },
  'differently-abled-pension': { statuses: ['differently-abled'], ageGroups: ['18-35', '36-59', '60+'] },
  'cm-girl-child-protection': { gender: ['female'], ageGroups: ['below18'] },
  'thaaimaaman-gold-ring': { statuses: ['pregnant'] },
  'free-sanitary-napkin': { gender: ['female'] },
  'mudhalvar-marundhagam': { openToAll: true },
  'nammai-kaakkum-48': { openToAll: true },
  'aavin-milk-card': { openToAll: true },
  'free-dhoti-saree-pongal': { openToAll: true },
  'distress-relief': { incomeAtMost: 'below1l' },
  'working-women-hostel': { gender: ['female'], occupations: ['employed'] },
  'vanavil-mandram': { occupations: ['student'], ageGroups: ['below18'] },
  'thiranari-thervu': { occupations: ['student'], ageGroups: ['below18'] },
  'vetri-nichayam': { ageGroups: ['18-35'] },
  'needs-scheme': { ageGroups: ['18-35'], occupations: ['unemployed', 'self-employed'] },
  'annal-ambedkar-business-champions': { statuses: ['sc-st'], occupations: ['self-employed', 'unemployed'] },
  'inter-caste-marriage-assistance': { statuses: ['sc-st'] },
  'pension-unmarried-women-50': { gender: ['female'], ageGroups: ['36-59', '60+'], statuses: ['unmarried'] },
  'solar-rooftop-incentive': { openToAll: true },
};

export function evaluateEligibility(profile: UserProfile, schemes: Scheme[]): MatchResult[] {
  const results: MatchResult[] = [];

  for (const scheme of schemes) {
    const rule = RULES[scheme.id];
    if (!rule) continue;

    if (rule.openToAll) {
      results.push({ scheme, reasons: ['reasonOpenToAll'], openToAll: true });
      continue;
    }

    const reasons: TranslationKey[] = [];
    let excluded = false;

    if (rule.gender && profile.gender) {
      if (rule.gender.includes(profile.gender)) reasons.push('reasonGender');
      else excluded = true;
    }
    if (!excluded && rule.ageGroups && profile.ageGroup) {
      if (rule.ageGroups.includes(profile.ageGroup)) reasons.push('reasonAge');
      else excluded = true;
    }
    if (!excluded && rule.occupations && profile.occupation) {
      if (rule.occupations.includes(profile.occupation)) reasons.push('reasonOccupation');
      else excluded = true;
    }
    if (!excluded && rule.statuses && profile.statuses.length > 0) {
      if (profile.statuses.some((s) => rule.statuses!.includes(s))) reasons.push('reasonStatus');
      else excluded = true;
    }
    if (!excluded && rule.incomeAtMost && profile.income) {
      if (INCOME_ORDER[profile.income] <= INCOME_ORDER[rule.incomeAtMost]) reasons.push('reasonIncome');
      else excluded = true;
    }

    if (!excluded && reasons.length > 0) {
      results.push({ scheme, reasons, openToAll: false });
    }
  }

  return results.sort(
    (a, b) => Number(a.openToAll) - Number(b.openToAll) || b.reasons.length - a.reasons.length
  );
}
