import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Tag from '@/components/ui/Tag';
import { placeText } from '@/lib/stops';
import type { ParcelCard } from '@/lib/types';
import { colors, radius } from '@/theme';

/** A parcel on the task list; opens the parcel screen. */
export default function ParcelTaskCard({ parcel, next = false }: { parcel: ParcelCard; next?: boolean }) {
    const { t, locale } = useAuth();
    const collectsCash = Number(parcel.cod_amount) > 0;

    return (
        <Pressable
            accessibilityRole="button"
            testID={`task-${parcel.tracking_number}`}
            onPress={() => router.push({ pathname: '/parcel/[tracking]', params: { tracking: parcel.tracking_number } })}
            style={({ pressed }) => [styles.card, next && styles.next, pressed && styles.pressed]}
        >
            <View style={styles.top}>
                {next && <Tag label={t('next')} tone="brand" />}
                {parcel.package_type?.is_fragile && <Tag label={t('fragile')} tone="danger" />}
                {parcel.package_type?.requires_cold_chain && <Tag label={t('cold')} tone="info" />}
                <AppText weight="semibold" size={13} color={colors.muted} style={styles.ltr}>
                    {parcel.tracking_number}
                </AppText>
                <View style={styles.grow} />
                <AppText weight="extrabold" size={14} color={collectsCash ? colors.brandDeep : colors.success}>
                    {collectsCash ? t('money', { amount: parcel.cod_amount, currency: parcel.currency }) : t('paid')}
                </AppText>
            </View>
            <AppText weight="extrabold" size={16} numberOfLines={1}>
                {parcel.contact}
            </AppText>
            <AppText size={13} color={colors.body} numberOfLines={2}>
                {placeText(parcel, locale)}
            </AppText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: colors.surface, borderRadius: radius.lg - 2, padding: 14, gap: 4, borderWidth: 1.5, borderColor: colors.surface },
    next: { borderColor: '#F3C7B1' },
    pressed: { opacity: 0.85 },
    top: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
    ltr: { writingDirection: 'ltr' },
    grow: { flex: 1 },
});
