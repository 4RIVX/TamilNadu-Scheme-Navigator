import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import GovernmentHeader from '../../components/ui/GovernmentHeader';
import LanguageToggle from '../../components/ui/LanguageToggle';
import { useTranslation } from '../../i18n';
import { getAllSchemes } from '../../services/schemeService';
import { useSaved } from '../../store/saved';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

export default function ProfileScreen() {
  const { t } = useTranslation();
  const savedIds = useSaved((s) => s.savedIds);

  const schemes = getAllSchemes();
  const total = schemes.length;
  const verifiedCount = schemes.filter((s) => s.dataStatus === 'verified').length;
  const categoryCount = new Set(schemes.map((s) => s.category)).size;

  const clearSaved = () => {
    Alert.alert(t('pfClearTitle'), t('pfClearMsg'), [
      { text: t('pfCancel'), style: 'cancel' },
      { text: t('pfClear'), style: 'destructive', onPress: () => useSaved.setState({ savedIds: [] }) },
    ]);
  };

  const Card = ({ icon, title, children }: { icon: IconName; title: string; children: React.ReactNode }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color={colors.primary} style={styles.cardIcon} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.screen}>
      <GovernmentHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Card icon="language-outline" title={t('pfLanguage')}>
          <View style={styles.rowBetween}>
            <Text style={styles.body}>{t('pfLanguage')}: தமிழ் | English</Text>
            <LanguageToggle />
          </View>
        </Card>

        <Card icon="bookmark-outline" title={t('pfYourData')}>
          <View style={styles.rowBetween}>
            <Text style={styles.body}>
              {t('pfSaved')}: <Text style={styles.bold}>{savedIds.length}</Text>
            </Text>
            {savedIds.length > 0 && (
              <Pressable onPress={clearSaved}>
                <Text style={styles.danger}>{t('pfClearSaved')}</Text>
              </Pressable>
            )}
          </View>
        </Card>

        <Card icon="server-outline" title={t('pfDataTitle')}>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{total}</Text>
              <Text style={styles.statLabel}>{t('pfDataTotal')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{verifiedCount}</Text>
              <Text style={styles.statLabel}>{t('pfDataVerified')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{categoryCount}</Text>
              <Text style={styles.statLabel}>{t('pfDataCategories')}</Text>
            </View>
          </View>
        </Card>

        <Card icon="information-circle-outline" title={t('pfHowTitle')}>
          <View style={styles.howRow}>
            <Ionicons name="search-outline" size={18} color={colors.primary} style={styles.howIcon} />
            <Text style={styles.body}>{t('pfHow1')}</Text>
          </View>
          <View style={styles.howRow}>
            <Ionicons name="checkmark-done-outline" size={18} color={colors.primary} style={styles.howIcon} />
            <Text style={styles.body}>{t('pfHow2')}</Text>
          </View>
          <View style={styles.howRow}>
            <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} style={styles.howIcon} />
            <Text style={styles.body}>{t('pfHow3')}</Text>
          </View>
        </Card>

        <Card icon="shield-checkmark-outline" title={t('pfTrustTitle')}>
          <Text style={styles.body}>{t('prototypeBanner')}</Text>
          <Text style={[styles.body, { marginTop: spacing.sm }]}>{t('disclaimer')}</Text>
          <Pressable style={styles.visitBtn} onPress={() => Linking.openURL('https://www.tn.gov.in')}>
            <Ionicons name="link" size={16} color={colors.white} style={styles.visitIcon} />
            <Text style={styles.visitText}>{t('pfVisit')}</Text>
          </Pressable>
        </Card>

        <Text style={styles.footer}>v1.0.0 • PS-15 • Tamil Nadu Scheme Navigator</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 48 },
  card: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  cardIcon: { marginRight: spacing.sm },
  cardTitle: { fontSize: fontSize.md, fontFamily: 'NotoSansTamil_700Bold', color: colors.text },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  body: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular', lineHeight: 22, flexShrink: 1 },
  bold: { fontFamily: 'NotoSansTamil_700Bold', color: colors.primary },
  danger: { fontSize: fontSize.sm, color: '#B91C1C', fontFamily: 'NotoSansTamil_600SemiBold' },
  statRow: { flexDirection: 'row' },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginHorizontal: spacing.xs },
  statNum: { fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold', color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular', marginTop: 2 },
  howRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  howIcon: { marginTop: 2, marginRight: spacing.sm },
  visitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: radius.md, minHeight: 44, marginTop: spacing.md },
  visitIcon: { marginRight: spacing.xs },
  visitText: { color: colors.white, fontSize: fontSize.sm, fontFamily: 'NotoSansTamil_700Bold' },
  footer: { marginTop: spacing.lg, textAlign: 'center', fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular' },
});