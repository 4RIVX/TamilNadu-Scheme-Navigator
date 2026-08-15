export type TargetGroup =
  | 'women'
  | 'students'
  | 'children'
  | 'elderly'
  | 'widows'
  | 'differently-abled'
  | 'farmers'
  | 'workers'
  | 'unemployed-youth'
  | 'low-income-families'
  | 'sc-st';

export const TARGET_GROUP_LABEL_KEY: Record<TargetGroup, string> = {
  women: 'tgWomen',
  students: 'tgStudents',
  children: 'tgChildren',
  elderly: 'tgElderly',
  widows: 'tgWidows',
  'differently-abled': 'tgDifferentlyAbled',
  farmers: 'tgFarmers',
  workers: 'tgWorkers',
  'unemployed-youth': 'tgUnemployedYouth',
  'low-income-families': 'tgLowIncome',
  'sc-st': 'tgScSt',
};

export const ALL_TARGET_GROUPS = Object.keys(TARGET_GROUP_LABEL_KEY) as TargetGroup[];
