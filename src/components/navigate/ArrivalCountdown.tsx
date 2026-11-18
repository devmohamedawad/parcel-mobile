import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { useCountdown } from '@/hooks/useCountdown';
import { clockText } from '@/lib/navigation';
import { colors, radius } from '@/theme';

/**
 * Time left until the arrival expected when the rider pressed "Head there"; red with the time over once
 * it has passed (the branch is told when the rider stays late).
 */
export default function ArrivalCountdown({ expectedAt, compact = false }: { expectedAt: string | null; compact?: boolean }) {
    const { t, locale } = useAuth();
    const left = useCountdown(expectedAt);

    if (left === null || expectedAt === null) {
        return null;
    }

    const late = left < 0;
    const at = new Date(expectedAt).toLocaleTimeString(locale === 'ar' ? 'ar-KW' : 'en-GB', { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={[styles.box, late ? styles.late : styles.onTime, compact && styles.compact]} testID="arrival-countdown">
            <Icon name={late ? 'alert-circle' : 'time-outline'} size={compact ? 20 : 24} color={late ? colors.danger : colors.info} />
            <View style={styles.text}>
                <AppText size={12} weight="semibold" color={late ? colors.danger : colors.muted}>
                    {late ? t('late') : t('timeLeft')}
                </AppText>
                <AppText weight="extrabold" size={compact ? 22 : 30} color={late ? colors.danger : colors.ink} style={styles.clock}>
                    {late ? `+${clockText(left)}` : clockText(left)}
                </AppText>
            </View>
            <AppText size={12} color={colors.muted} style={styles.at}>
                {t('expectedAt', { time: at })}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    box: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.md },
    compact: { paddingVertical: 8 },
    onTime: { backgroundColor: '#EAF1FE' },
    late: { backgroundColor: '#FDECEC' },
    text: { flexShrink: 0 },
    clock: { writingDirection: 'ltr', lineHeight: 36 },
    at: { flex: 1, textAlign: 'right' },
});
