import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import { openParcels } from '@/lib/stops';
import type { TodayWork } from '@/lib/types';
import { colors, radius } from '@/theme';

/** Delivered / failed / left counts and the cash the rider holds. */
export default function DaySummary({ work }: { work: TodayWork }) {
    const { t } = useAuth();
    const cells = [
        { value: work.done_today.delivered, label: t('action_delivered'), color: colors.success },
        { value: openParcels(work).length + work.pickup_stops.length, label: t('remaining'), color: colors.ink },
        { value: work.done_today.failed, label: t('action_failed'), color: colors.danger },
    ];

    return (
        <View style={styles.wrap}>
            <View style={styles.grid}>
                {cells.map((cell) => (
                    <View key={cell.label} style={styles.cell}>
                        <AppText weight="extrabold" size={22} color={cell.color}>
                            {cell.value}
                        </AppText>
                        <AppText size={13} color={colors.muted}>
                            {cell.label}
                        </AppText>
                    </View>
                ))}
            </View>
            <View style={[styles.cash, work.cash.reached && styles.cashReached]}>
                <AppText size={14} color={work.cash.reached ? colors.danger : colors.body}>
                    {work.cash.reached ? t('cashLimitReached') : t('cashOnHand')}
                </AppText>
                <AppText weight="extrabold" size={15} color={work.cash.reached ? colors.danger : colors.ink}>
                    {t('money', { amount: work.cash.on_hand, currency: work.cash.currency })}
                </AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 10 },
    grid: { flexDirection: 'row', gap: 10 },
    cell: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
    cash: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10 },
    cashReached: { backgroundColor: '#FDECEC' },
});
