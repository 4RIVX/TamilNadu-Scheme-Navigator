import { View, Text, ScrollView, StyleSheet } from 'react-native';
import GovernmentHeader from '../../components/ui/GovernmentHeader';
import EmptyState from '../../components/ui/EmptyState';
import SchemeCard from '../../components/schemes/SchemeCard';
import { getAllSchemes } from '../../services/schemeService';
import { useSaved } from '../../store/saved';
import { useTranslation } from '../../i18n';
import { colors, spacing, fontSize } from '../../constants/theme';

export default function SavedScreen() {
  const { t } = useTranslation();
  const savedIds = useSaved((s) => s.savedIds);
  const savedSchemes = getAllSchemes().filter((s) => savedIds.includes(s.id));

  return (
    <View style={styles.screen}>
      <GovernmentHeader />
      {savedSchemes.length === 0 ? (
        <EmptyState icon="bookmark-outline" title={t('savedEmpty')} hint={t('savedEmptyHint')} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {savedSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </ScrollView>
      )}
      <Text style={styles.disclaimer}>{t('disclaimer')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 24 },
  disclaimer: { color: colors.textSecondary, fontSize: fontSize.xs, textAlign: 'center', fontFamily: 'NotoSansTamil_400Regular', paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});
