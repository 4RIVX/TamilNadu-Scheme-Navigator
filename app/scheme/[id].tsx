import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { useTranslation } from '../../i18n';
import { getSchemeById } from '../../services/schemeService';
import { useSaved } from '../../store/saved';
import { useChatContext } from '../../store/chatContext';
import { pick } from '../../utils/schemeText';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

export default function SchemeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, t } = useTranslation();
  const savedIds = useSaved((s) => s.savedIds);
  const toggleSaved = useSaved((s) => s.toggleSaved);
  const setActiveSchemeId = useChatContext((s) => s.setActiveSchemeId);

  const scheme = getSchemeById(id || '');

  if (!scheme) {
    return (
      <View style={styles.screen}>
        <View style={[styles.topbar, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={styles.topTitle}>{t('tabSchemes')}</Text>
        </View>
        <EmptyState icon="document-text-outline" title={t('schemeNotFound')} hint={t('disclaimer')} />
      </View>
    );
  }

  const isSaved = savedIds.includes(scheme.id);
  const verified = scheme.dataStatus === 'verified';

  const renderList = (items: string[] | Record<string, string[]> | null) => {
    if (!items) return <Text style={styles.paragraph}>{lang === 'ta' ? 'தகவல் கிடைக்கவில்லை' : 'Information not specified on official page.'}</Text>;
    if (Array.isArray(items)) {
      if (items.length === 0) return <Text style={styles.paragraph}>{lang === 'ta' ? 'தேவையில்லை' : 'None required.'}</Text>;
      return items.map((item, idx) => (
        <View key={idx} style={styles.listRow}>
          <Ionicons name="checkmark" size={16} color={colors.primary} style={styles.listIcon} />
          <Text style={styles.listText}>{item}</Text>
        </View>
      ));
    }
    return Object.entries(items).map(([group, list]) => (
      <View key={group} style={{ marginBottom: 12 }}>
        <Text style={styles.subTitle}>{group.charAt(0).toUpperCase() + group.slice(1)}</Text>
        {list.map((item, idx) => (
          <View key={idx} style={styles.listRow}>
            <Ionicons name="checkmark" size={16} color={colors.primary} style={styles.listIcon} />
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
    ));
  };

  const Section = ({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) => (
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
      <View style={[styles.topbar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{pick(lang, scheme.nameEn, scheme.nameTa)}</Text>
        <Badge status={scheme.dataStatus} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {verified ? (
          <Pressable style={styles.verifiedBanner} onPress={() => scheme.sourceUrl && Linking.openURL(scheme.sourceUrl)}>
            <Ionicons name="shield-checkmark" size={18} color="#14532D" style={styles.bannerIcon} />
            <Text style={styles.verifiedText}>
              {t('verificationVerified')}{scheme.verificationDate ? ` · ${scheme.verificationDate}` : ''}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.demoBanner}>
            <Ionicons name="alert-circle" size={18} color={colors.noticeText} style={styles.bannerIcon} />
            <Text style={styles.demoText}>{t('verificationDemo')}</Text>
          </View>
        )}

        <Text style={styles.dept}>{scheme.department}</Text>

        <Section icon="gift-outline" title={t('schemeBenefits')}>{renderList(scheme.benefits)}</Section>
        <Section icon="people-outline" title={t('schemeEligibility')}>{renderList(scheme.eligibility)}</Section>
        <Section icon="document-text-outline" title={t('schemeDocuments')}>{renderList(scheme.documents)}</Section>
        <Section icon="map-outline" title={t('schemeHowToApply')}>
          <Text style={styles.paragraph}>{scheme.howToApply || (lang === 'ta' ? 'தகவல் கிடைக்கவில்லை' : 'Information not specified on official page.')}</Text>
        </Section>

        {scheme.officialPageUrl ? (
          <Pressable style={styles.verifyBtn} onPress={() => Linking.openURL(scheme.officialPageUrl!)}>
            <Ionicons name="link" size={18} color={colors.white} style={styles.verifyIcon} />
            <Text style={styles.verifyText}>{t('verifyOfficial')}</Text>
          </Pressable>
        ) : null}

        <View style={styles.actionRow}>
          <Pressable style={[styles.saveBtn, isSaved && styles.saveBtnActive]} onPress={() => toggleSaved(scheme.id)}>
            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={isSaved ? colors.white : colors.primary} style={styles.actionIcon} />
            <Text style={[styles.saveText, isSaved && styles.saveTextActive]}>
              {isSaved ? t('savedBadge') : t('saveScheme')}
            </Text>
          </Pressable>
          <Pressable
            style={styles.askBtn}
            onPress={() => {
              setActiveSchemeId(scheme.id);
              router.push('/assistant');
            }}
          >
            <Ionicons name="chatbubbles-outline" size={20} color={colors.white} style={styles.actionIcon} />
            <Text style={styles.askText}>{t('askAboutScheme')}</Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>{t('disclaimer')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  topbar: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: spacing.md, minHeight: 44, justifyContent: 'center' },
  topTitle: { flex: 1, color: colors.white, fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold', marginRight: spacing.sm },
  content: { padding: spacing.lg, paddingBottom: 48 },
  verifiedBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#15803D', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  verifiedText: { flex: 1, color: '#14532D', fontSize: fontSize.sm, fontFamily: 'NotoSansTamil_600SemiBold' },
  demoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.noticeBg, borderWidth: 1, borderColor: colors.accent, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  demoText: { flex: 1, color: colors.noticeText, fontSize: fontSize.sm, fontFamily: 'NotoSansTamil_600SemiBold' },
  bannerIcon: { marginRight: spacing.sm },
  dept: { fontSize: fontSize.sm, color: colors.primary, fontFamily: 'NotoSansTamil_700Bold', marginBottom: spacing.lg },
  card: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  cardIcon: { marginRight: spacing.sm },
  cardTitle: { fontSize: fontSize.md, fontFamily: 'NotoSansTamil_700Bold', color: colors.text },
  subTitle: { fontSize: fontSize.md, fontFamily: 'NotoSansTamil_600SemiBold', color: colors.text, marginBottom: spacing.sm },
  paragraph: { fontSize: fontSize.md, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular', lineHeight: 24 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  listIcon: { marginTop: 3, marginRight: spacing.sm },
  listText: { flex: 1, fontSize: fontSize.md, color: colors.text, fontFamily: 'NotoSansTamil_400Regular', lineHeight: 24 },
  verifyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.md, minHeight: 52, justifyContent: 'center', marginTop: spacing.sm },
  verifyIcon: { marginRight: spacing.sm },
  verifyText: { color: colors.white, fontSize: fontSize.md, fontFamily: 'NotoSansTamil_700Bold' },
  actionRow: { flexDirection: 'row', marginTop: spacing.lg },
  saveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary, borderRadius: radius.md, minHeight: 52, marginRight: spacing.sm, backgroundColor: colors.background },
  saveBtnActive: { backgroundColor: colors.primary },
  saveText: { color: colors.primary, fontSize: fontSize.sm, fontFamily: 'NotoSansTamil_700Bold' },
  saveTextActive: { color: colors.white },
  askBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryDark, borderRadius: radius.md, minHeight: 52 },
  askText: { color: colors.white, fontSize: fontSize.sm, fontFamily: 'NotoSansTamil_700Bold', flexShrink: 1 },
  actionIcon: { marginRight: spacing.xs },
  disclaimer: { marginTop: spacing.xl, color: colors.textSecondary, fontSize: fontSize.xs, textAlign: 'center', fontFamily: 'NotoSansTamil_400Regular' },
});