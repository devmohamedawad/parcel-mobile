import { Redirect } from 'expo-router';
import Tabs from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import Icon, { type IconName } from '@/components/ui/Icon';
import { colors, fonts } from '@/theme';

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
    return (
        <View style={[styles.icon, focused && styles.iconActive]}>
            <Icon name={focused ? name : (`${name}-outline` as IconName)} size={22} color={focused ? colors.brandText : colors.muted} />
        </View>
    );
}

/** Bottom tabs for a signed-in rider: Today, Map, Tasks, Account. */
export default function TabsLayout() {
    const { user, t } = useAuth();

    if (!user) {
        return <Redirect href="/login" />;
    }

    const tab = (title: string, icon: IconName) => ({
        title,
        tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon name={icon} focused={focused} />,
    });

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.brandText,
                tabBarInactiveTintColor: colors.muted,
                tabBarLabelStyle: styles.label,
                tabBarStyle: styles.bar,
                sceneStyle: { backgroundColor: colors.ground },
            }}
        >
            <Tabs.Screen name="today" options={tab(t('tabToday'), 'home')} />
            <Tabs.Screen name="map" options={tab(t('tabMap'), 'map')} />
            <Tabs.Screen name="tasks" options={tab(t('tabTasks'), 'cube')} />
            <Tabs.Screen name="account" options={tab(t('tabAccount'), 'person')} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    bar: { backgroundColor: colors.surface, borderTopColor: '#ECE8E3', height: 78, paddingTop: 8 },
    label: { fontFamily: fonts.bold, fontSize: 12 },
    icon: { width: 56, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    iconActive: { backgroundColor: colors.brandSoft },
});
