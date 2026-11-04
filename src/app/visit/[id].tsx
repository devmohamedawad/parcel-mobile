import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import ContactCard from '@/components/parcel/ContactCard';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import TopBar from '@/components/ui/TopBar';
import UnlistedCodesList from '@/components/visit/UnlistedCodesList';
import VisitScanner from '@/components/visit/VisitScanner';
import WaitingParcelsList from '@/components/visit/WaitingParcelsList';
import { useRemote } from '@/hooks/useRemote';
import { useVisitScan } from '@/hooks/useVisitScan';
import { api } from '@/lib/api';
import { alertWorkError } from '@/lib/workAlert';
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
    const [scanning, setScanning] = useState(false);
    const [busy, setBusy] = useState(false);
    const visit = useVisitScan(stop?.waiting_parcels ?? []);

    if (!stop) {
        return (
            <View style={styles.screen}>
                <TopBar title={t('visitTitle')} />
                <ActivityIndicator style={styles.loader} color={colors.brand} />
            </View>
        );
    }

    const waiting = stop.waiting_parcels;
    const recorded = visit.selected.length + visit.unlisted.length;
    // The count follows what was ticked and scanned; the rider can still raise it for parcels with no label at all.
    const count = Math.max(collected ?? (recorded > 0 || waiting.length > 0 ? recorded : (stop.expected_parcels ?? 0)), recorded);

    const tick = (ids: number[]) => {
        visit.tick(ids);
        setCollected(null);
    };

    const done = async () => {
        setBusy(true);
        try {
            await api(`pickup-stops/${stop.id}/complete`, { method: 'POST', body: { collected_parcels: count, parcel_ids: visit.selected, scanned_ids: visit.scanned, unlisted: visit.unlisted } });
            router.back();
        } catch (exception) {
            alertWorkError(exception, t);
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={styles.screen}>
            <TopBar title={stop.merchant} />
            <ScrollView contentContainerStyle={styles.body}>
                <ContactCard title={t('collectFrom')} stop={{ contact: stop.contact, phone: stop.phone, alt_phone: null, governorate: stop.governorate, area: stop.area, line: stop.line ?? '', notes: [stop.notes, stop.merchant_notes].filter(Boolean).join('\n') || null, latitude: null, longitude: null }} />
                <Button label={t('visitScan')} icon="barcode-outline" variant="outline" size="md" onPress={() => setScanning(true)} testID="visit-scan" />
                {waiting.length > 0 && <WaitingParcelsList parcels={waiting} selected={visit.selected} scanned={visit.scanned} onChange={tick} />}
                {visit.unlisted.length > 0 && <UnlistedCodesList codes={visit.unlisted} onRemove={visit.removeUnlisted} />}
                <Stepper label={t('collectedParcels')} value={count} onChange={setCollected} max={MAX_PARCELS} min={recorded} />
                {waiting.length > 0 && (
                    <AppText size={13} color={colors.muted}>
                        {t('raiseCountHint')}
                    </AppText>
                )}
            </ScrollView>
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <Button label={t('visitDone')} icon="checkmark-circle" onPress={done} busy={busy} haptic testID="visit-done" />
            </View>
            {scanning && <VisitScanner onScan={visit.scan} onClose={() => setScanning(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.ground },
    loader: { marginTop: 48 },
    body: { padding: 20, gap: 18 },
    footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: '#ECE8E3' },
});
