import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import Button from '@/components/Button';
import { BRAND_COLOR } from '@/config';
import { registerForPush } from '@/lib/push';
import { useShift } from '@/tracking/useShift';

export default function Today() {
    const { user, signOut, t, locale } = useAuth();
    const { shift, tracking, busy, needsPermission, lastShift, waiting, start, end, openSettings } = useShift();

    useEffect(() => {
        registerForPush().catch(() => undefined);
    }, []);

    if (!user) {
        return null;
    }

    const since = shift ? new Date(shift.started_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.body}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>{t('today')}</Text>
                        <Text style={styles.muted}>
                            {user.name} · {user.rider.code}
                            {user.rider.branch ? ` · ${user.rider.branch}` : ''}
                        </Text>
                    </View>
                    <Pressable onPress={async () => { await signOut(); router.replace('/login'); }}>
                        <Text style={styles.link}>{t('signOut')}</Text>
                    </Pressable>
                </View>

                <View style={[styles.card, shift && styles.cardOn]}>
                    <Text style={styles.cardTitle}>{t('shift')}</Text>
                    <Text style={styles.status}>{shift ? t('onShift', { time: since }) : t('offShift')}</Text>
                    <Text style={styles.muted}>{shift && tracking ? t('trackingOn') : t('trackingOff')}</Text>
                    {waiting > 0 && <Text style={styles.muted}>{t('waiting', { count: waiting })}</Text>}
                    {lastShift && !shift && <Text style={styles.muted}>{t('lastShift', { km: (lastShift.distance_meters / 1000).toFixed(1) })}</Text>}
                    {needsPermission && (
                        <View style={styles.notice}>
                            <Text>{t('locationNeeded')}</Text>
                            <Button label={t('openSettings')} onPress={openSettings} variant="outline" />
                        </View>
                    )}
                    <Button label={shift ? t('endShift') : t('startShift')} onPress={shift ? end : start} busy={busy} variant={shift ? 'outline' : 'primary'} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    body: { padding: 20, gap: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '800', color: '#1F1B18' },
    muted: { color: '#6B645E', marginTop: 2 },
    link: { color: BRAND_COLOR, fontWeight: '600' },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, gap: 10 },
    cardOn: { borderWidth: 2, borderColor: BRAND_COLOR },
    cardTitle: { fontSize: 14, fontWeight: '700', color: BRAND_COLOR },
    status: { fontSize: 20, fontWeight: '700', color: '#1F1B18' },
    notice: { backgroundColor: '#FFF3EC', borderRadius: 16, padding: 12, gap: 10 },
});
