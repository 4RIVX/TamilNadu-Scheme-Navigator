import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QuestionCard from '../../components/eligibility/QuestionCard';
import CategoryChip from '../../components/schemes/CategoryChip';
import SchemeCard from '../../components/schemes/SchemeCard';
import { useTranslation } from '../../i18n';
import { getAllSchemes } from '../../services/schemeService';
import { evaluateEligibility } from '../../utils/eligibility';
import type { UserProfile, AgeGroup, Gender, Occupation, IncomeBand, MatchResult } from '../../utils/eligibility';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

export default function EligibilityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [age, setAge] = useState<AgeGroup | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [income, setIncome] = useState<IncomeBand | null>(null);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const ageOptions: { value: AgeGroup; label: string }[] = [
    { value: 'below18', label: t('ageOpt1') },
    { value: '18-35', label: t('ageOpt2') },
    { value: '36-59', label: t('ageOpt3') },
    { value: '60+', label: t('ageOpt4') },
  ];
  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'female', label: t('genderFemale') },
    { value: 'male', label: t('genderMale') },
    { value: 'other', label: t('genderOther') },
  ];
  const occOptions: { value: Occupation; label: string }[] = [
    { value: 'student', label: t('occOpt1') },
    { value: 'farmer', label: t('occOpt2') },
    { value: 'employed', label: t('occOpt3') },
    { value: 'self-employed', label: t('occOpt4') },
    { value: 'unemployed', label: t('occOpt5') },
  ];
  const incOptions: { value: IncomeBand; label: string }[] = [
    { value: 'below1l', label: t('incOpt1') },
    { value: '1-2.5l', label: t('incOpt2') },
    { value: 'above2.5l', label: t('incOpt3') },
  ];
  const statusOptions: { id: string; label: string }[] = [
    { id: 'widow', label: t('statusWidow') },
    { id: 'differently-abled', label: t('statusDifferentlyAbled') },
    { id: 'pregnant', label: t('statusPregnant') },
    { id: 'sc-st', label: t('statusScSt') },
    { id: 'transperson', label: t('statusTransPerson') },
    { id: 'unmarried', label: t('statusUnmarried') },
  ];

  const toggleStatus = (id: string) =>
    setStatuses((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const seeResults = () => {
    const profile: UserProfile = { ageGroup: age, gender, occupation, income, statuses };
    setResults(evaluateEligibility(profile, getAllSchemes()));
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topbar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <Text style={styles.topTitle}>{t('eligibilityTitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>{t('eligibilitySubtitle')}</Text>

        <QuestionCard
          title={t('questionAge')}
          options={ageOptions.map((o) => o.label)}
          selected={ageOptions.find((o) => o.value === age)?.label ?? null}
          onSelect={(label) => setAge(ageOptions.find((o) => o.label === label)?.value ?? null)}
        />
        <QuestionCard
          title={t('questionGender')}
          options={genderOptions.map((o) => o.label)}
          selected={genderOptions.find((o) => o.value === gender)?.label ?? null}
          onSelect={(label) => setGender(genderOptions.find((o) => o.label === label)?.value ?? null)}
        />
        <QuestionCard
          title={t('questionOccupation')}
          options={occOptions.map((o) => o.label)}
          selected={occOptions.find((o) => o.value === occupation)?.label ?? null}
          onSelect={(label) => setOccupation(occOptions.find((o) => o.label === label)?.value ?? null)}
        />
        <QuestionCard
          title={t('questionIncome')}
          options={incOptions.map((o) => o.label)}
          selected={incOptions.find((o) => o.value === income)?.label ?? null}
          onSelect={(label) => setIncome(incOptions.find((o) => o.label === label)?.value ?? null)}
        />

        <Text style={styles.statusTitle}>{t('questionStatuses')}</Text>
        <View style={styles.statusRow}>
          {statusOptions.map((s) => (
            <CategoryChip key={s.id} label={s.label} selected={statuses.includes(s.id)} onPress={() => toggleStatus(s.id)} />
          ))}
        </View>

        <Pressable style={styles.submitBtn} onPress={seeResults}>
          <Text style={styles.submitText}>{t('seeResults')}</Text>
        </Pressable>

        {results !== null && (
          <View style={styles.resultsWrap}>
            <Text style={styles.resultsTitle}>{t('resultsTitle')}</Text>
            {results.length === 0 ? (
              <Text style={styles.noMatches}>{t('noMatches')}</Text>
            ) : (
              results.map((r) => (
                <View key={r.scheme.id} style={styles.resultItem}>
                  <SchemeCard scheme={r.scheme} />
                  <View style={styles.reasonBox}>
                    <Text style={styles.reasonLabel}>{t('whyMatched')}:</Text>
                    <Text style={styles.reasonText}>{r.reasons.map((k) => t(k)).join(' • ')}</Text>
                  </View>
                </View>
              ))
            )}
            <Text style={styles.verifyNote}>{t('verifyNote')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  topbar: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: spacing.md, minHeight: 44, justifyContent: 'center' },
  topTitle: { flex: 1, color: colors.white, fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold' },
  content: { padding: spacing.lg, paddingBottom: 48 },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular', marginBottom: spacing.xl, lineHeight: 24 },
  statusTitle: { fontSize: fontSize.md, fontFamily: 'NotoSansTamil_700Bold', color: colors.text, marginBottom: spacing.md },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  submitBtn: { backgroundColor: colors.primary, borderRadius: radius.md, minHeight: 52, justifyContent: 'center', alignItems: 'center', marginTop: spacing.md },
  submitText: { color: colors.white, fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold' },
  resultsWrap: { marginTop: spacing.xl },
  resultsTitle: { fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold', color: colors.text, marginBottom: spacing.md },
  resultItem: { marginBottom: spacing.md },
  reasonBox: { backgroundColor: colors.noticeBg, borderLeftWidth: 4, borderLeftColor: colors.accent, padding: spacing.md, marginBottom: spacing.lg },
  reasonLabel: { fontSize: fontSize.xs, fontFamily: 'NotoSansTamil_700Bold', color: colors.noticeText, marginBottom: 2 },
  reasonText: { fontSize: fontSize.sm, color: colors.noticeText, fontFamily: 'NotoSansTamil_400Regular' },
  noMatches: { fontSize: fontSize.md, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular', marginBottom: spacing.lg },
  verifyNote: { marginTop: spacing.md, color: colors.textSecondary, fontSize: fontSize.xs, textAlign: 'center', fontFamily: 'NotoSansTamil_400Regular' },
});
