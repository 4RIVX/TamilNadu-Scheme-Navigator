import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

interface Props {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatMessage({ role, text }: Props) {
  const isUser = role === 'user';
  return (
    <View style={[styles.wrap, isUser ? styles.wrapUser : styles.wrapAssistant]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', marginBottom: spacing.md },
  wrapUser: { justifyContent: 'flex-end' },
  wrapAssistant: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.lg },
  bubbleUser: { backgroundColor: colors.primary },
  bubbleAssistant: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  text: { fontSize: fontSize.md, fontFamily: 'NotoSansTamil_400Regular' },
  textUser: { color: colors.white },
  textAssistant: { color: colors.text },
});
