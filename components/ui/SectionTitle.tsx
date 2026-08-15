import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../constants/theme';

export default function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.md },
  bar: { width: 4, height: 18, backgroundColor: colors.primary, borderRadius: 2, marginRight: spacing.sm },
  text: { fontSize: fontSize.lg, fontFamily: 'NotoSansTamil_700Bold', color: colors.text },
});
