import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { callPhone, navigateTo } from '@/lib/links';
import { lngLat, localized } from '@/lib/stops';
import type { ParcelCard } from '@/lib/types';
import { colors, radius, shadow } from '@/theme';

interface StopDetailsCardProps {
    parcel: ParcelCard;
    /** The stop's place in the route (1 = next). */
    number: number;
    onClose: () => void;
}

/**
 * The tapped stop at the bottom of the map: who, where and the cash to collect, with call, navigate
 * and open. Drawn over the map, not inside it, so its buttons always respond.
 */
export default function StopDetailsCard({ parcel, number, onClose }: StopDetailsCardProps) {
    const { t, locale } = useAuth();
    const collectsCash = Number(parcel.cod_amount) > 0;
    const position = lngLat(parcel);

    return (
        <View style={styles.card} testID="stop-details">
            <View style={styles.head}>
                <View style={styles.number}>
                    <AppText weight="extrabold" size={15} color="#FFFFFF">
                        {number}
                    </AppText>
                </View>
                <View style={styles.text}>
                    <AppText weight="extrabold" size={16} numberOfLines={1}>
                        {parcel.contact}
                    </AppText>
                    <AppText size={13} color={colors.muted} numberOfLines={2}>
                        {[localized(parcel.area, locale), parcel.line].filter(Boolean).join(' · ')}
                    </AppText>
                    <AppText size={12} color={colors.subtle} style={styles.ltr}>
                        {parcel.tracking_number}
                    </AppText>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={t('close')} onPress={onClose} hitSlop={10} testID="stop-details-close">
                    <Icon name="close" size={22} color={colors.muted} />
                </Pressable>
            </View>
            <AppText weight="bold" size={14} color={collectsCash ? colors.brandDeep : colors.successText}>
                {collectsCash ? t('money', { amount: parcel.cod_amount, currency: parcel.currency }) : t('paid')}
            </AppText>
            <View style={styles.buttons}>
                {parcel.phone && (
                    <View style={styles.button}>
                        <Button label={t('call')} icon="call-outline" variant="outline" size="md" onPress={() => callPhone(parcel.phone ?? '')} />
                    </View>
                )}
                {position && (
                    <View style={styles.button}>
                        <Button label={t('navigate')} icon="navigate-outline" variant="outline" size="md" onPress={() => navigateTo(position)} />
                    </View>
                )}
                <View style={styles.button}>
                    <Button label={t('details')} icon="open-outline" size="md" onPress={() => router.push({ pathname: '/parcel/[tracking]', params: { tracking: parcel.tracking_number } })} testID="stop-details-open" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { position: 'absolute', start: 12, end: 12, bottom: 12, gap: 10, padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.float },
    head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    number: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.brandStrong, alignItems: 'center', justifyContent: 'center' },
    text: { flex: 1, gap: 2 },
    ltr: { writingDirection: 'ltr', textAlign: 'left' },
    buttons: { flexDirection: 'row', gap: 8 },
    button: { flex: 1 },
});
