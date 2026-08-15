import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  onPress?: () => void;
}

export default function SearchBar({ value, onChange, placeholder, onPress }: Props) {
  if (onPress) {
    return (
      <Pressable style={styles.container} onPress={onPress} accessibilityRole="search">
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.icon} />
        <Text style={styles.placeholderText}>{placeholder}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, minHeight: 48 },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, height: 48, color: colors.text, fontSize: fontSize.md, fontFamily: 'NotoSansTamil_400Regular' },
  placeholderText: { flex: 1, color: colors.textSecondary, fontSize: fontSize.md, fontFamily: 'NotoSansTamil_400Regular' },
});
