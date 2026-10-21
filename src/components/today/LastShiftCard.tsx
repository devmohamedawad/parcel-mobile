import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { hoursAndMinutes } from '@/lib/format';
import type { RiderShift } from '@/lib/types';
import { colors } from '@/theme';

/** Duration and distance of the shift that just ended. */
export default function LastShiftCard({ shift }: { shift: RiderShift }) {
    const { t } = useAuth();
    const seconds = shift.ended_at ? (new Date(shift.ended_at).getTime() - new Date(shift.started_at).getTime()) / 1000 : 0;
    const duration = t('hoursMinutes', hoursAndMinutes(seconds));

    return (
        <Card style={styles.card}>
            <View style={styles.icon}>
                <Icon name="git-branch-outline" size={22} color={colors.body} />
            </View>
            <View style={styles.text}>
                <AppText weight="bold" size={15}>
                    {t('lastShift')}
                </AppText>
                <AppText size={13} color={colors.muted}>
                    {t('lastShiftSummary', { duration, km: (shift.distance_meters / 1000).toFixed(1) })}
                </AppText>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
    icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.ground, alignItems: 'center', justifyContent: 'center' },
    text: { flex: 1 },
});
