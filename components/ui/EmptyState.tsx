import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../constants/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  hint: string;
}

export default function EmptyState({ icon, title, hint }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={56} color={colors.border} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  title: { fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold', color: colors.text, marginTop: spacing.lg, textAlign: 'center' },
  hint: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center', fontFamily: 'NotoSansTamil_400Regular' },
});
