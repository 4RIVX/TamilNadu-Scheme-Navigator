import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../ui/Badge';
import { useTranslation } from '../../i18n';
import { CATEGORY_LABEL_KEY } from '../../constants/categories';
import { pick } from '../../utils/schemeText';
import { colors, spacing, radius, fontSize } from '../../constants/theme';
import type { Scheme } from '../../types/scheme';

export default function SchemeCard({ scheme }: { scheme: Scheme }) {
  const router = useRouter();
  const { lang, t } = useTranslation();

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/scheme/${scheme.id}`)}>
      <View style={styles.topRow}>
        <Text style={styles.category}>{t(CATEGORY_LABEL_KEY[scheme.category])}</Text>
        <Badge status={scheme.dataStatus} />
      </View>
      <Text style={styles.name}>{pick(lang, scheme.nameEn, scheme.nameTa)}</Text>
      <Text style={styles.desc} numberOfLines={2}>{scheme.department}</Text>
      <View style={styles.footer}>
        <Text style={styles.status}>{scheme.dataStatus === 'verified' ? '✅ Official' : '⚠️ Unverified'}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  category: { fontSize: fontSize.xs, color: colors.primary, fontFamily: 'NotoSansTamil_700Bold' },
  name: { fontSize: fontSize.md, fontFamily: 'NotoSansTamil_700Bold', color: colors.text, marginBottom: 4 },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular', marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'NotoSansTamil_600SemiBold' },
});
