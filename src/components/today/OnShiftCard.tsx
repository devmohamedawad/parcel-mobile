import { Alert, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { useElapsedSeconds } from '@/hooks/useElapsedSeconds';
import { formatClock, formatTime } from '@/lib/format';
import type { RiderShift } from '@/lib/types';
import { colors } from '@/theme';

interface OnShiftCardProps {
    shift: RiderShift;
    tracking: boolean;
    waiting: number;
    busy: boolean;
    onEnd: () => void;
    /** Deliveries finished (delivered or failed) out of today's total. */
    progress?: { done: number; total: number };
}

/** Dark card with the live shift clock and route-recording state. */
export default function OnShiftCard({ shift, tracking, waiting, busy, onEnd, progress }: OnShiftCardProps) {
    const { t, locale } = useAuth();
    const elapsed = useElapsedSeconds(shift.started_at);

    const confirmEnd = () =>
        Alert.alert(t('endShiftTitle'), t('endShiftBody'), [
            { text: t('cancel'), style: 'cancel' },
            { text: t('endShift'), style: 'destructive', onPress: onEnd },
        ]);

    return (
        <Card tone="night">
            <View style={styles.top}>
                <View style={styles.clock}>
                    <AppText size={13} color={colors.nightMuted}>
                        {t('onShiftSince', { time: formatTime(locale, shift.started_at) })}
                    </AppText>
                    <AppText weight="extrabold" size={38} color="#FFFFFF" style={styles.digits} testID="shift-clock">
                        {formatClock(elapsed)}
                    </AppText>
                </View>
            </View>
            <View style={styles.status}>
                <Icon name={tracking ? 'location' : 'location-outline'} size={18} color={tracking ? '#4ADE80' : colors.nightMuted} />
                <AppText size={13} color={colors.nightMuted}>
                    {tracking ? t('trackingOn') : t('trackingPaused')}
                    {waiting > 0 ? ` · ${t('waiting', { count: waiting })}` : ''}
                </AppText>
            </View>
            {progress && progress.total > 0 && (
                <View style={styles.progress}>
                    <View style={styles.progressText}>
                        <AppText weight="bold" size={14} color="#FFFFFF">
                            {t('todayProgress')}
                        </AppText>
                        <AppText weight="bold" size={14} color="#FFFFFF">
                            {t('progress', progress)}
                        </AppText>
                    </View>
                    <View style={styles.track}>
                        <View style={[styles.fill, { width: `${Math.min(100, (progress.done / progress.total) * 100)}%` }]} />
                    </View>
                </View>
            )}
            <Button label={t('endShift')} icon="stop-circle-outline" onPress={confirmEnd} busy={busy} variant="onDark" size="md" testID="shift-end" />
        </Card>
    );
}

const styles = StyleSheet.create({
    top: { flexDirection: 'row', alignItems: 'flex-start' },
    clock: { flex: 1 },
    digits: { alignSelf: 'flex-start', fontVariant: ['tabular-nums'], writingDirection: 'ltr', lineHeight: 50 },
    status: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    progress: { gap: 8 },
    progressText: { flexDirection: 'row', justifyContent: 'space-between' },
    track: { height: 8, borderRadius: 4, backgroundColor: colors.nightLine, overflow: 'hidden' },
    fill: { height: 8, borderRadius: 4, backgroundColor: colors.brandOnDark },
});
