import { Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
}

export default function SuggestedQuestion({ label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, marginRight: spacing.sm, backgroundColor: colors.background },
  label: { fontSize: fontSize.sm, color: colors.primary, fontFamily: 'NotoSansTamil_600SemiBold' },
});
