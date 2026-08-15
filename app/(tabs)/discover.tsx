import { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import GovernmentHeader from '../../components/ui/GovernmentHeader';
import SearchBar from '../../components/ui/SearchBar';
import CategoryChip from '../../components/schemes/CategoryChip';
import SchemeCard from '../../components/schemes/SchemeCard';
import { useTranslation } from '../../i18n';
import { getAllSchemes } from '../../services/schemeService';
import { ALL_CATEGORIES, CATEGORY_LABEL_KEY } from '../../constants/categories';
import { colors, spacing } from '../../constants/theme';
import type { Category, Scheme } from '../../types/scheme';

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Category | 'all'>('all');

  const q = query.trim().toLowerCase();
  const qt = query.trim();
  const schemes = getAllSchemes();

  const matchesQuery = (s: Scheme): boolean =>
    q.length === 0 ||
    s.nameEn.toLowerCase().includes(q) ||
    s.nameTa.includes(qt) ||
    s.department.toLowerCase().includes(q) ||
    s.tags.some((tag) => tag.toLowerCase().includes(q) || tag.includes(qt));

  const visible = schemes.filter(
    (s) => (selected === 'all' || s.category === selected) && matchesQuery(s)
  );

  return (
    <View style={styles.screen}>
      <GovernmentHeader />
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChange={setQuery} placeholder={t('searchPlaceholder')} />
      </View>

      <View style={styles.chipsWrap}>
        <CategoryChip label={t('allCategories')} selected={selected === 'all'} onPress={() => setSelected('all')} />
        {ALL_CATEGORIES.map((cat) => (
          <CategoryChip key={cat} label={t(CATEGORY_LABEL_KEY[cat])} selected={selected === cat} onPress={() => setSelected(cat)} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {visible.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
        <Text style={styles.footerNote}>{t('disclaimer')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.sm },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  footerNote: { marginTop: spacing.lg, color: colors.textSecondary, fontSize: 12, textAlign: 'center', fontFamily: 'NotoSansTamil_400Regular' },
});