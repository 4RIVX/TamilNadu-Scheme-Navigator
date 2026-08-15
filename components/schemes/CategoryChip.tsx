import { Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function CategoryChip({ label, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipActive]}>
      <Text style={[styles.label, selected && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, marginRight: spacing.sm, marginBottom: spacing.sm, backgroundColor: colors.background },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { fontSize: fontSize.sm, color: colors.text, fontFamily: 'NotoSansTamil_600SemiBold' },
  labelActive: { color: colors.white },
});