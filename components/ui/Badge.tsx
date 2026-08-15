import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../../i18n';
import type { DataStatus } from '../../types/scheme';
import { radius, fontSize, spacing } from '../../constants/theme';

export default function Badge({ status }: { status: DataStatus }) {
  const { t } = useTranslation();
  const verified = status === 'verified';
  return (
    <View style={[styles.badge, { backgroundColor: verified ? '#DCFCE7' : '#FEF3C7' }]}>
      <View style={[styles.dot, { backgroundColor: verified ? '#15803D' : '#B45309' }]} />
      <Text style={[styles.label, { color: verified ? '#14532D' : '#92400E' }]}>
        {verified ? t('verifiedBadge') : t('demoBadge')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  label: { fontSize: fontSize.xs, fontFamily: 'NotoSansTamil_600SemiBold' },
});
