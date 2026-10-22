import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import ContactCard from '@/components/parcel/ContactCard';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import TopBar from '@/components/ui/TopBar';
import WaitingParcelsList from '@/components/visit/WaitingParcelsList';
import { useRemote } from '@/hooks/useRemote';
import { api, ApiError } from '@/lib/api';
import type { TodayWork } from '@/lib/types';
import { colors } from '@/theme';

/** Most parcels recorded for one visit (the server's PickupRequest::MAX_PARCELS). */
const MAX_PARCELS = 500;

export default function MerchantVisit() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const { data } = useRemote<TodayWork>('today');
    const stop = data?.pickup_stops.find((candidate) => String(candidate.id) === id);
    const [collected, setCollected] = useState<number | null>(null);
    const [ticked, setTicked] = useState<number[] | null>(null);
    const [busy, setBusy] = useState(false);

    if (!stop) {
        return (
            <View style={styles.screen}>
                <TopBar title={t('visitTitle')} />
                <ActivityIndicator style={styles.loader} color={colors.brand} />
            </View>
        );
    }

    const waiting = stop.waiting_parcels;
    const selected = ticked ?? waiting.map((parcel) => parcel.id);
    const count = collected ?? (waiting.length > 0 ? selected.length : (stop.expected_parcels ?? 0));

    // Ticking follows the count; the rider can still raise it for parcels not in the system yet.
    const tick = (ids: number[]) => {
        setTicked(ids);
        setCollected(ids.length);
    };

    const done = async () => {
        setBusy(true);
        try {
            await api(`pickup-stops/${stop.id}/complete`, { method: 'POST', body: { collected_parcels: count, parcel_ids: selected } });
            router.back();
        } catch (exception) {
            Alert.alert(exception instanceof ApiError ? exception.message : String(exception));
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={styles.screen}>
            <TopBar title={stop.merchant} />
            <ScrollView contentContainerStyle={styles.body}>
                <ContactCard title={t('collectFrom')} stop={{ contact: stop.contact, phone: stop.phone, alt_phone: null, governorate: stop.governorate, area: stop.area, line: stop.line ?? '', notes: [stop.notes, stop.merchant_notes].filter(Boolean).join('\n') || null, latitude: null, longitude: null }} />
                {waiting.length > 0 && <WaitingParcelsList parcels={waiting} selected={selected} onChange={tick} />}
                <Stepper label={t('collectedParcels')} value={count} onChange={setCollected} max={MAX_PARCELS} min={selected.length} />
                {waiting.length > 0 && (
                    <AppText size={13} color={colors.muted}>
                        {t('raiseCountHint')}
                    </AppText>
                )}
            </ScrollView>
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <Button label={t('visitDone')} icon="checkmark-circle" onPress={done} busy={busy} haptic testID="visit-done" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.ground },
    loader: { marginTop: 48 },
    body: { padding: 20, gap: 18 },
    footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: '#ECE8E3' },
});
