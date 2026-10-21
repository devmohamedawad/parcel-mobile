import { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapPreviewCard from '@/components/map/MapPreviewCard';
import LastShiftCard from '@/components/today/LastShiftCard';
import NextStopCard from '@/components/today/NextStopCard';
import OffShiftCard from '@/components/today/OffShiftCard';
import OnShiftCard from '@/components/today/OnShiftCard';
import TodayHeader from '@/components/today/TodayHeader';
import { useRemote } from '@/hooks/useRemote';
import { registerForPush } from '@/lib/push';
import type { TodayWork } from '@/lib/types';
import { useShift } from '@/tracking/useShift';
import { colors } from '@/theme';

export default function Today() {
    const { shift, tracking, busy, needsPermission, lastShift, waiting, start, end, openSettings } = useShift();
    const { data: work, refreshing, refresh } = useRemote<TodayWork>('today');
    const finished = work ? work.done_today.delivered + work.done_today.failed : 0;
    const next = work?.deliveries[0];

    useEffect(() => {
        registerForPush().catch(() => undefined);
    }, []);

    return (
        <SafeAreaView edges={['top']} style={styles.screen}>
            <ScrollView contentContainerStyle={styles.body} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.brand]} />}>
                <TodayHeader online={shift !== null} />
                {shift ? (
                    <>
                        <OnShiftCard shift={shift} tracking={tracking} waiting={waiting} busy={busy} onEnd={end} progress={work ? { done: finished, total: finished + work.deliveries.length } : undefined} />
                        {next && <NextStopCard parcel={next} />}
                        <MapPreviewCard />
                    </>
                ) : (
                    <>
                        <OffShiftCard busy={busy} needsPermission={needsPermission} onStart={start} onOpenSettings={openSettings} />
                        {lastShift && <LastShiftCard shift={lastShift} />}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    body: { padding: 20, paddingTop: 16, gap: 18 },
});
