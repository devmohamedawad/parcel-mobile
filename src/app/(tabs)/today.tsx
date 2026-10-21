import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapPreviewCard from '@/components/map/MapPreviewCard';
import LastShiftCard from '@/components/today/LastShiftCard';
import OffShiftCard from '@/components/today/OffShiftCard';
import OnShiftCard from '@/components/today/OnShiftCard';
import TodayHeader from '@/components/today/TodayHeader';
import { registerForPush } from '@/lib/push';
import { useShift } from '@/tracking/useShift';

export default function Today() {
    const { shift, tracking, busy, needsPermission, lastShift, waiting, start, end, openSettings } = useShift();

    useEffect(() => {
        registerForPush().catch(() => undefined);
    }, []);

    return (
        <SafeAreaView edges={['top']} style={styles.screen}>
            <ScrollView contentContainerStyle={styles.body}>
                <TodayHeader online={shift !== null} />
                {shift ? (
                    <>
                        <OnShiftCard shift={shift} tracking={tracking} waiting={waiting} busy={busy} onEnd={end} />
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
