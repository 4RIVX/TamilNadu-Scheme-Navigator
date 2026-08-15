import { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GovernmentHeader from '../../components/ui/GovernmentHeader';
import ChatMessage from '../../components/assistant/ChatMessage';
import ChatInput from '../../components/assistant/ChatInput';
import SuggestedQuestion from '../../components/assistant/SuggestedQuestion';
import { useTranslation } from '../../i18n';
import { sendChatMessage, type ChatMessage as ChatMsgType } from '../../services/chatService';
import { getSchemeById } from '../../services/schemeService';
import { useChatContext } from '../../store/chatContext';
import { pick } from '../../utils/schemeText';
import { colors, spacing, fontSize } from '../../constants/theme';

export default function AssistantScreen() {
  const { t, lang } = useTranslation();
  const [messages, setMessages] = useState<ChatMsgType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const activeSchemeId = useChatContext((s) => s.activeSchemeId);
  const setActiveSchemeId = useChatContext((s) => s.setActiveSchemeId);
  const contextScheme = activeSchemeId ? getSchemeById(activeSchemeId) : undefined;

  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setIsLoading(true);
    try {
      const res = await sendChatMessage(text, messages, activeSchemeId ?? undefined);
      setMessages((prev) => [...prev, { role: 'assistant', text: res.answer }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', text: t('aiNotConnected') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggested = [t('suggestedQ1'), t('suggestedQ2'), t('suggestedQ3')];

  return (
    <View style={styles.screen}>
      <GovernmentHeader />

      {contextScheme ? (
        <View style={styles.contextBar}>
          <Ionicons name="link" size={14} color={colors.primary} style={styles.contextIcon} />
          <Text style={styles.contextText} numberOfLines={1}>
            {t('contextLabel')}: {pick(lang, contextScheme.nameEn, contextScheme.nameTa)}
          </Text>
          <Pressable onPress={() => setActiveSchemeId(null)}>
            <Text style={styles.clearText}>{t('clearContext')}</Text>
          </Pressable>
        </View>
      ) : null}

      {messages.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={56} color={colors.border} />
          <Text style={styles.emptyTitle}>{t('askAssistant')}</Text>
          <Text style={styles.emptySubtitle}>{t('assistantWelcome')}</Text>
        </View>
      )}

      <ScrollView ref={scrollViewRef} style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.map((m, idx) => (
          <ChatMessage key={idx} role={m.role} text={m.text} />
        ))}
        {isLoading && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.typingText}>{t('thinking')}</Text>
          </View>
        )}
      </ScrollView>

      {messages.length === 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
          {suggested.map((q) => (
            <SuggestedQuestion key={q} label={q} onPress={() => handleSend(q)} />
          ))}
        </ScrollView>
      )}

      <ChatInput onSubmit={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  contextBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginHorizontal: spacing.lg, marginTop: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 4 },
  contextIcon: { marginRight: spacing.xs },
  contextText: { flex: 1, fontSize: fontSize.xs, color: colors.primary, fontFamily: 'NotoSansTamil_600SemiBold' },
  clearText: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'NotoSansTamil_600SemiBold', marginLeft: spacing.sm },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold', color: colors.text, marginTop: spacing.lg },
  emptySubtitle: { fontSize: fontSize.md, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular', marginTop: spacing.sm, textAlign: 'center' },
  chatArea: { flex: 1 },
  chatContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, paddingHorizontal: spacing.sm },
  typingText: { marginLeft: spacing.sm, fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'NotoSansTamil_400Regular' },
  chips: { maxHeight: 52, marginBottom: spacing.sm },
  chipsContent: { paddingHorizontal: spacing.lg, alignItems: 'center' },
});