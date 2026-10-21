import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import InfoSection from '@/components/account/InfoSection';
import AppText from '@/components/ui/AppText';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import { usePermissionStatus } from '@/hooks/usePermissionStatus';
import { colors } from '@/theme';

export default function Account() {
    const { user, t, signOut } = useAuth();
    const permissions = usePermissionStatus();

    if (!user) {
        return null;
    }

    const locationLabel = { always: t('locationAlways'), whileUsing: t('locationWhileUsing'), off: t('locationOff') }[permissions?.location ?? 'off'];

    const confirmSignOut = () =>
        Alert.alert(t('signOutTitle'), t('signOutBody'), [
            { text: t('cancel'), style: 'cancel' },
            {
                text: t('signOut'),
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/login');
                },
            },
        ]);

    return (
        <SafeAreaView edges={['top']} style={styles.screen}>
            <ScrollView contentContainerStyle={styles.body}>
                <AppText weight="extrabold" size={26}>
                    {t('tabAccount')}
                </AppText>

                <Card style={styles.profile}>
                    <Avatar name={user.name} size={60} />
                    <View style={styles.names}>
                        <AppText weight="extrabold" size={19} numberOfLines={1}>
                            {user.name}
                        </AppText>
                        <AppText size={14} color={colors.muted} numberOfLines={1}>
                            {user.email}
                        </AppText>
                    </View>
                </Card>

                <InfoSection
                    title={t('work')}
                    rows={[
                        { label: t('riderCode'), value: user.rider.code },
                        { label: t('branchLabel'), value: user.rider.branch ?? '—' },
                    ]}
                />

                <InfoSection
                    title={t('phoneAndPermissions')}
                    rows={[
                        { label: t('location'), icon: 'location-outline', value: <Pill label={locationLabel} tone={permissions?.location === 'always' ? 'success' : 'brand'} /> },
                        { label: t('notifications'), icon: 'notifications-outline', value: <Pill label={permissions?.notifications ? t('enabled') : t('disabled')} tone={permissions?.notifications ? 'success' : 'brand'} /> },
                        { label: t('language'), hint: t('languageHint'), icon: 'globe-outline', value: t('languageName') },
                    ]}
                />

                <Button label={t('signOut')} icon="log-out-outline" onPress={confirmSignOut} variant="danger" size="md" testID="sign-out" />
                <AppText size={12} color={colors.subtle} style={styles.center}>
                    BabJet Rider · {t('version', { version: Constants.expoConfig?.version ?? '' })}
                </AppText>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    body: { padding: 20, paddingTop: 16, gap: 18 },
    profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    names: { flex: 1, minWidth: 0 },
    center: { textAlign: 'center' },
});
