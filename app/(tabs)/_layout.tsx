import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../i18n';
import { colors } from '../../constants/theme';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'NotoSansTamil_600SemiBold',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('tabHome'), tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="discover"
        options={{ title: t('tabSchemes'), tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="assistant"
        options={{ title: t('tabAssistant'), tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="saved"
        options={{ title: t('tabSaved'), tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t('tabProfile'), tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} /> }}
      />
    </Tabs>
  );
}