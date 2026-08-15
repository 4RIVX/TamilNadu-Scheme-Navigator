import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLanguage, type Lang } from '../../store/language';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

const options: { code: Lang; label: string }[] = [
  { code: 'ta', label: 'தமிழ்' },
  { code: 'en', label: 'ENG' },
];

export default function LanguageToggle() {
  const lang = useLanguage((s) => s.lang);
  const setLang = useLanguage((s) => s.setLang);

  return (
    <View style={styles.container}>
      {options.map((o) => (
        <Pressable key={o.code} onPress={() => setLang(o.code)} style={[styles.btn, lang === o.code && styles.btnActive]}>
          <Text style={[styles.btnText, lang === o.code && styles.btnTextActive]}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderWidth: 1, borderColor: colors.white, borderRadius: radius.sm, overflow: 'hidden' },
  btn: { minHeight: 36, minWidth: 48, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.sm },
  btnActive: { backgroundColor: colors.accent },
  btnText: { color: colors.white, fontSize: fontSize.sm, fontFamily: 'NotoSansTamil_400Regular' },
  btnTextActive: { color: '#000000', fontFamily: 'NotoSansTamil_700Bold' },
});
