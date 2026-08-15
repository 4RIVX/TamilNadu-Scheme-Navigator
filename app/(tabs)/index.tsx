import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GovernmentHeader from '../../components/ui/GovernmentHeader';
import SearchBar from '../../components/ui/SearchBar';
import SectionTitle from '../../components/ui/SectionTitle';
import { useTranslation } from '../../i18n';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const quickActions: { icon: IconName; label: string; onPress: () => void }[] = [
    { icon: 'search', label: t('findSchemes'), onPress: () => router.push('/discover') },
    { icon: 'clipboard-outline', label: t('checkEligibility'), onPress: () => router.push('/eligibility') },
    { icon: 'grid-outline', label: t('browseCategories'), onPress: () => router.push('/discover') },
    { icon: 'bookmark-outline', label: t('savedSchemes'), onPress: () => router.push('/saved') },
  ];

  const departments: string[] = [t('catEducation'), t('catAgriculture'), t('catWomenChildren')];

  return (
    <View style={styles.screen}>
      <GovernmentHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchWrap}>
          <SearchBar value="" onChange={() => undefined} placeholder={t('searchPlaceholder')} onPress={() => router.push('/discover')} />
        </View>

        <View style={styles.noticeBoard}>
          <View style={styles.noticeHeaderRow}>
            <Ionicons name="megaphone-outline" size={16} color={colors.noticeText} style={styles.noticeIcon} />
            <Text style={styles.noticeHeader}>{t('noticeBoard')}</Text>
          </View>
          <Text style={styles.noticeText}>{t('noticeText')}</Text>
          <Text style={styles.noticeMeta}>{t('noticeMeta')}</Text>
        </View>

        <Pressable style={styles.assistantCard} onPress={() => router.push('/assistant')}>
          <View style={styles.assistantIconBox}>
            <Ionicons name="chatbubbles" size={28} color={colors.white} />
          </View>
          <View style={styles.assistantTexts}>
            <Text style={styles.assistantTitle}>{t('askAssistant')}</Text>
            <Text style={styles.assistantSubtitle}>{t('askAssistantSubtitle')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.accent} />
        </Pressable>

        <SectionTitle title={t('quickActions')} />
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <Pressable key={action.label} style={styles.gridItem} onPress={action.onPress}>
              <View style={styles.iconBox}>
                <Ionicons name={action.icon} size={26} color={colors.primary} />
              </View>
              <Text style={styles.gridLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <SectionTitle title={t('popularCategories')} />
        <View style={styles.card}>
          {departments.map((dept, idx) => (
            <View key={dept} style={[styles.deptRow, idx < departments.length - 1 && styles.deptRowBorder]}>
              <Text style={styles.deptLabel}>{dept}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>{t('disclaimer')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 48 },
  searchWrap: { marginBottom: spacing.lg },
  noticeBoard: { backgroundColor: colors.noticeBg, borderLeftWidth: 4, borderLeftColor: colors.accent, padding: spacing.md, marginBottom: spacing.lg },
  noticeHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  noticeIcon: { marginRight: spacing.xs },
  noticeHeader: { fontFamily: 'NotoSansTamil_700Bold', fontSize: fontSize.sm, color: colors.noticeText },
  noticeText: { fontFamily: 'NotoSansTamil_400Regular', fontSize: fontSize.sm, color: colors.noticeText },
  noticeMeta: { marginTop: 4, fontSize: 11, color: colors.noticeText, fontFamily: 'NotoSansTamil_400Regular' },
  assistantCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.lg, borderWidth: 2, borderColor: colors.accent },
  assistantIconBox: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF20', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  assistantTexts: { flex: 1, marginRight: spacing.sm },
  assistantTitle: { color: colors.white, fontSize: fontSize.md, fontFamily: 'NotoSansTamil_700Bold', marginBottom: 2 },
  assistantSubtitle: { color: colors.accent, fontSize: fontSize.xs, fontFamily: 'NotoSansTamil_400Regular' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  iconBox: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  gridLabel: { fontFamily: 'NotoSansTamil_600SemiBold', fontSize: fontSize.md, color: colors.text, textAlign: 'center' },
  card: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg },
  deptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  deptRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.surface },
  deptLabel: { color: colors.primary, fontSize: fontSize.md, fontFamily: 'NotoSansTamil_600SemiBold' },
  disclaimer: { marginTop: spacing.xl, color: colors.textSecondary, fontSize: fontSize.xs, textAlign: 'center', fontFamily: 'NotoSansTamil_400Regular', paddingHorizontal: spacing.md },
});
