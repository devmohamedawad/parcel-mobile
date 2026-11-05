import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import StopMap from '@/components/map/StopMap';
import ActionBar from '@/components/parcel/ActionBar';
import ContactCard from '@/components/parcel/ContactCard';
import ParcelFacts from '@/components/parcel/ParcelFacts';
import ParcelNotesCard from '@/components/parcel/ParcelNotesCard';
import SaveDoorLocationButton from '@/components/parcel/SaveDoorLocationButton';
import ScanBanner from '@/components/parcel/ScanBanner';
import TasksEmpty from '@/components/tasks/TasksEmpty';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/ui/FadeIn';
import TopBar from '@/components/ui/TopBar';
import { useHeadThere } from '@/hooks/useHeadThere';
import { useParcelUpdate } from '@/hooks/useParcelUpdate';
import { useRemote } from '@/hooks/useRemote';
import { navigateTo } from '@/lib/links';
import { lngLat } from '@/lib/stops';
import type { ParcelAction, ParcelDetail } from '@/lib/types';
import { colors } from '@/theme';

export default function ParcelScreen() {
    const { tracking, scanned } = useLocalSearchParams<{ tracking: string; scanned?: ParcelAction }>();
    const { t, user } = useAuth();
    const { data: parcel, error, loading, refreshing, refresh } = useRemote<ParcelDetail>(`parcels/${tracking}`);
    const { send, busy } = useParcelUpdate(tracking);
    const headThere = useHeadThere(parcel ?? { tracking_number: tracking, status: '' }, parcel ? lngLat(parcel.status === 'pickup_assigned' ? parcel.pickup : parcel.delivery) : null, refresh);

    if (loading || !parcel) {
        return (
            <View style={styles.screen}>
                <TopBar title={tracking} ltrTitle />
                {loading ? <ActivityIndicator style={styles.loader} color={colors.brand} /> : <TasksEmpty failed={error !== null} missing={error?.status === 404} />}
            </View>
        );
    }

    // While collecting, the stop is the merchant (or the customer for a return); afterwards the drop-off.
    const collecting = parcel.status === 'pickup_assigned';
    const stop = collecting ? parcel.pickup : parcel.delivery;
    const position = lngLat(stop);
    const warehouse = parcel.actions.includes('to_hub') ? user?.rider.warehouse : null;
    // At the door (on the road, or after a failed try): the rider may save where the recipient is.
    const atDoor = !collecting && ['out_for_delivery', 'delivery_failed'].includes(parcel.status);

    const step = async (action: ParcelAction) => {
        const updated = await send({ action });
        if (updated) {
            updated.actions.length === 0 ? router.back() : refresh();
        }
    };

    return (
        <View style={styles.screen}>
            {position ? <StopMap stop={position} approximate={stop.approximate} style={styles.map} /> : null}
            <TopBar title={parcel.tracking_number} floating={position !== null} ltrTitle />
            <ScrollView style={position ? styles.sheet : undefined} contentContainerStyle={styles.body} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.brand]} />}>
                {scanned && (
                    <FadeIn>
                        <ScanBanner action={scanned} />
                    </FadeIn>
                )}
                <FadeIn>
                    <ContactCard title={collecting ? t('collectFrom') : t('recipient')} stop={stop} />
                </FadeIn>
                {stop.approximate && (
                    <AppText size={13} color={colors.muted} testID="parcel-approximate">
                        {t('approximatePlace')}
                    </AppText>
                )}
                {position && (
                    <FadeIn index={1}>
                        <Button label={headThere.label} icon="navigate" variant="secondary" size="md" onPress={headThere.go} testID="parcel-head-there" />
                    </FadeIn>
                )}
                {atDoor && (
                    <FadeIn index={1}>
                        <SaveDoorLocationButton parcel={parcel} onSaved={refresh} />
                    </FadeIn>
                )}
                {warehouse && (
                    <FadeIn index={1}>
                        <Button label={t('warehouseDirections')} icon="business" variant="outline" size="md" onPress={() => navigateTo([warehouse.longitude, warehouse.latitude])} testID="warehouse-directions" />
                    </FadeIn>
                )}
                <FadeIn index={2}>
                    <ParcelNotesCard parcel={parcel} onSent={refresh} />
                </FadeIn>
                <FadeIn index={2}>
                    <ParcelFacts parcel={parcel} />
                </FadeIn>
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
