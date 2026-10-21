import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Avatar from '@/components/ui/Avatar';
import Pill from '@/components/ui/Pill';
import { formatDay } from '@/lib/format';
import { colors, radius } from '@/theme';

/** Greeting, online state and the rider's code / branch / date. */
export default function TodayHeader({ online }: { online: boolean }) {
    const { user, t, locale } = useAuth();

    if (!user) {
        return null;
    }

    const greeting = new Date().getHours() < 12 ? t('goodMorning') : t('goodEvening');
    const chips = [user.rider.code, user.rider.branch ? t('branch', { name: user.rider.branch }) : null, formatDay(locale)].filter(Boolean) as string[];

    return (
        <View style={styles.wrap}>
            <View style={styles.row}>
                <Avatar name={user.name} />
                <View style={styles.names}>
                    <AppText size={13} color={colors.muted}>
                        {greeting}
                    </AppText>
                    <AppText weight="extrabold" size={18} numberOfLines={1}>
                        {user.name}
                    </AppText>
                </View>
                <Pill label={online ? t('online') : t('offline')} tone={online ? 'success' : 'neutral'} dot />
            </View>
            <View style={styles.chips}>
                {chips.map((chip) => (
                    <View key={chip} style={styles.chip}>
                        <AppText weight="semibold" size={13} color={colors.body}>
                            {chip}
                        </AppText>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 14 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    names: { flex: 1, minWidth: 0 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { backgroundColor: colors.surface, borderRadius: radius.sm - 4, paddingHorizontal: 10, paddingVertical: 2 },
});
