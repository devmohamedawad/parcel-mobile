import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { localized } from '@/lib/stops';
import type { ParcelCard } from '@/lib/types';
import { colors, radius, shadow } from '@/theme';

/** The box above a tapped stop: its number, who and where, the cash to collect; tapping it opens the parcel. */
export default function StopCallout({ parcel, number }: { parcel: ParcelCard; number: number }) {
    const { t, locale } = useAuth();
    const collectsCash = Number(parcel.cod_amount) > 0;

    return (
        <View style={styles.wrap} testID="stop-callout">
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/parcel/[tracking]', params: { tracking: parcel.tracking_number } })} style={styles.box}>
                <View style={styles.number}>
                    <AppText weight="extrabold" size={14} color="#FFFFFF">
                        {number}
                    </AppText>
                </View>
                <View style={styles.text}>
                    <AppText weight="bold" size={14} numberOfLines={1}>
                        {parcel.contact}
                    </AppText>
                    <AppText size={12} color={colors.muted} numberOfLines={1}>
                        {[localized(parcel.area, locale), parcel.tracking_number].filter(Boolean).join(' · ')}
                    </AppText>
                    <AppText weight="semibold" size={12} color={collectsCash ? colors.brandDeep : colors.successText}>
                        {collectsCash ? t('money', { amount: parcel.cod_amount, currency: parcel.currency }) : t('paid')}
                    </AppText>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.muted} directional />
            </Pressable>
            <View style={styles.tail} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { alignItems: 'center' },
    box: { flexDirection: 'row', alignItems: 'center', gap: 10, width: 240, padding: 10, borderRadius: radius.md, backgroundColor: colors.surface, ...shadow.float },
    number: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.brandStrong, alignItems: 'center', justifyContent: 'center' },
    text: { flex: 1, gap: 1 },
    tail: { width: 14, height: 14, marginTop: -7, backgroundColor: colors.surface, transform: [{ rotate: '45deg' }] },
});
