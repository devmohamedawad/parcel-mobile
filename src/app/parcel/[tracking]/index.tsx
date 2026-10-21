import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import StopMap from '@/components/map/StopMap';
import ActionBar from '@/components/parcel/ActionBar';
import ContactCard from '@/components/parcel/ContactCard';
import ParcelFacts from '@/components/parcel/ParcelFacts';
import TasksEmpty from '@/components/tasks/TasksEmpty';
import Button from '@/components/ui/Button';
import TopBar from '@/components/ui/TopBar';
import { useParcelUpdate } from '@/hooks/useParcelUpdate';
import { useRemote } from '@/hooks/useRemote';
import { navigateTo } from '@/lib/links';
import { lngLat } from '@/lib/stops';
import type { ParcelAction, ParcelDetail } from '@/lib/types';
import { colors } from '@/theme';

export default function ParcelScreen() {
    const { tracking } = useLocalSearchParams<{ tracking: string }>();
    const { t } = useAuth();
    const { data: parcel, error, loading, refreshing, refresh } = useRemote<ParcelDetail>(`parcels/${tracking}`);
    const { send, busy } = useParcelUpdate(tracking);

    if (loading || !parcel) {
        return (
            <View style={styles.screen}>
                <TopBar title={tracking} ltrTitle />
                {loading ? <ActivityIndicator style={styles.loader} color={colors.brand} /> : <TasksEmpty failed={error !== null} />}
            </View>
        );
    }

    // While collecting, the stop is the merchant (or the customer for a return); afterwards the drop-off.
    const collecting = parcel.status === 'pickup_assigned';
    const stop = collecting ? parcel.pickup : parcel.delivery;
    const position = lngLat(stop);

    const step = async (action: ParcelAction) => {
        const updated = await send({ action });
        if (updated) {
            updated.actions.length === 0 ? router.back() : refresh();
        }
    };

    return (
        <View style={styles.screen}>
            {position ? <StopMap stop={position} style={styles.map} /> : null}
            <TopBar title={parcel.tracking_number} floating={position !== null} ltrTitle />
            <ScrollView style={position ? styles.sheet : undefined} contentContainerStyle={styles.body} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.brand]} />}>
                <ContactCard title={collecting ? t('collectFrom') : t('recipient')} stop={stop} />
                {position && <Button label={t('navigate')} icon="navigate" variant="secondary" size="md" onPress={() => navigateTo(position)} />}
                <ParcelFacts parcel={parcel} />
            </ScrollView>
            <ActionBar parcel={parcel} busy={busy} onStep={step} />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.ground },
    loader: { marginTop: 48 },
    map: { height: 260 },
    sheet: { marginTop: -22, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.ground },
    body: { padding: 20, gap: 12 },
});
