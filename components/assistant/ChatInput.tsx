import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../i18n';
import { colors, radius, spacing } from '../../constants/theme';

export default function ChatInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('');
  const { t } = useTranslation();

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  };

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder={t('typeMessage')}
        placeholderTextColor={colors.textSecondary}
        value={text}
        onChangeText={setText}
      />
      <Pressable style={styles.sendBtn} onPress={submit} accessibilityRole="button">
        <Ionicons name="send" size={20} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background },
  input: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, color: colors.text, fontFamily: 'NotoSansTamil_400Regular' },
  sendBtn: { marginLeft: spacing.sm, width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
});
