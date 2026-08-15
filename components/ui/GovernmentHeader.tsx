import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '../../i18n';
import { colors, spacing, fontSize } from '../../constants/theme';

export default function GovernmentHeader() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{t('prototypeBanner')}</Text>
      </View>

      <View style={styles.row}>
        <Image source={require('../../assets/images/logo.jpg')} style={styles.logo} resizeMode="contain" />
        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={2}>{t('appTitle')}</Text>
          <Text style={styles.tagline} numberOfLines={1}>{t('tagline')}</Text>
        </View>
        <LanguageToggle />
      </View>
      <View style={styles.goldDivider} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg },
  banner: { backgroundColor: colors.primaryDark, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: 4 },
  bannerText: { color: '#F3D9D9', fontSize: 11, fontFamily: 'NotoSansTamil_400Regular' },
  row: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.md },
  logo: { width: 44, height: 44, borderRadius: 8, marginRight: spacing.md },
  titles: { flex: 1, marginRight: spacing.sm },
  title: { color: colors.white, fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold', lineHeight: 24 },
  tagline: { color: colors.accent, fontSize: fontSize.xs, fontFamily: 'NotoSansTamil_400Regular', marginTop: 2 },
  goldDivider: { height: 3, backgroundColor: colors.accent, marginHorizontal: -spacing.lg },
});