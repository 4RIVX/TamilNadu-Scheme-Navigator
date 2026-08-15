import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

interface Props {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
}

export default function QuestionCard({ title, options, selected, onSelect }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <Pressable key={option} onPress={() => onSelect(option)} style={[styles.option, isSelected && styles.optionActive]}>
            <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>{option}</Text>
            {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.white} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg },
  title: { fontSize: fontSize.md, fontFamily: 'NotoSansTamil_700Bold', color: colors.text, marginBottom: spacing.md },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginBottom: spacing.sm, backgroundColor: colors.background },
  optionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionLabel: { fontSize: fontSize.md, color: colors.text, fontFamily: 'NotoSansTamil_400Regular' },
  optionLabelActive: { color: colors.white },
});
