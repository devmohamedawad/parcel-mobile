import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import DaySummary from '@/components/tasks/DaySummary';
import ParcelTaskCard from '@/components/tasks/ParcelTaskCard';
import ParcelFinder from '@/components/tasks/ParcelFinder';
import PickupStopCard from '@/components/tasks/PickupStopCard';
import TasksEmpty from '@/components/tasks/TasksEmpty';
import UnlistedParcelCard from '@/components/tasks/UnlistedParcelCard';
import AppText from '@/components/ui/AppText';
import FadeIn from '@/components/ui/FadeIn';
import { useRemote } from '@/hooks/useRemote';
import { formatDay } from '@/lib/format';
import type { StringKey } from '@/lib/i18n';
import type { ParcelCard, PickupStop, TodayWork, UnlistedParcel } from '@/lib/types';
import { colors } from '@/theme';

type Row = { kind: 'stop'; stop: PickupStop } | { kind: 'parcel'; parcel: ParcelCard; next: boolean } | { kind: 'unlisted'; parcel: UnlistedParcel };

function sections(work: TodayWork): { title: StringKey; data: Row[] }[] {
    const parcels = (list: ParcelCard[], markFirst = false): Row[] => list.map((parcel, index) => ({ kind: 'parcel', parcel, next: markFirst && index === 0 }));

    return [
        { title: 'sectionDeliver' as const, data: parcels(work.deliveries, true) },
        { title: 'sectionVisits' as const, data: work.pickup_stops.map((stop): Row => ({ kind: 'stop', stop })) },
        { title: 'sectionCollect' as const, data: parcels(work.pickups) },
        { title: 'sectionInHand' as const, data: parcels(work.in_hand) },
        { title: 'sectionUnlisted' as const, data: (work.unlisted ?? []).map((parcel): Row => ({ kind: 'unlisted', parcel })) },
        { title: 'sectionReturns' as const, data: parcels(work.returns) },
    ].filter((section) => section.data.length > 0);
}

export default function Tasks() {
    const { t, locale } = useAuth();
    const { data, error, loading, refreshing, refresh } = useRemote<TodayWork>('today');
    const list = data ? sections(data) : [];

    return (
        <SafeAreaView edges={['top']} style={styles.screen}>
            <View style={styles.header}>
                <AppText weight="extrabold" size={26}>
                    {t('tabTasks')}
                </AppText>
                <AppText size={13} color={colors.muted}>
                    {formatDay(locale)}
                </AppText>
            </View>
            <SectionList
                sections={list}
                keyExtractor={(row) => (row.kind === 'stop' ? `stop-${row.stop.id}` : row.kind === 'unlisted' ? `unlisted-${row.parcel.id}` : row.parcel.tracking_number)}
                contentContainerStyle={styles.body}
                stickySectionHeadersEnabled={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.brand]} tintColor={colors.brand} />}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <>
                        <ParcelFinder />
                        {data && <DaySummary work={data} />}
                    </>
                }
                ListEmptyComponent={loading ? undefined : <TasksEmpty failed={error !== null} />}
                renderSectionHeader={({ section }) => (
                    <AppText weight="extrabold" size={13} color={colors.muted} style={styles.sectionTitle}>
                        {t(section.title)} · {section.data.length}
                    </AppText>
                )}
                renderItem={({ item, index }) => (
                    <FadeIn index={index}>
                        {item.kind === 'stop' ? <PickupStopCard stop={item.stop} /> : item.kind === 'unlisted' ? <UnlistedParcelCard parcel={item.parcel} onLeft={refresh} /> : <ParcelTaskCard parcel={item.parcel} next={item.next} />}
                    </FadeIn>
                )}
                ItemSeparatorComponent={() => <View style={styles.gap} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: { backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#ECE8E3' },
    body: { padding: 20, paddingBottom: 32, flexGrow: 1 },
    sectionTitle: { marginTop: 18, marginBottom: 8 },
    gap: { height: 10 },
});
