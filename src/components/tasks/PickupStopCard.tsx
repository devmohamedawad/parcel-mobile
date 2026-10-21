import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import type { StringKey } from '@/lib/i18n';
import { localized } from '@/lib/stops';
import type { PickupStop } from '@/lib/types';
import { colors, radius } from '@/theme';

/** A merchant visit on the task list; opens the visit screen. */
export default function PickupStopCard({ stop }: { stop: PickupStop }) {
    const { t, locale } = useAuth();
    const details = [localized(stop.area, locale), stop.expected_parcels ? t('expectedParcels', { count: stop.expected_parcels }) : null, t(`window_${stop.time_window}` as StringKey)].filter(Boolean).join(' · ');

    return (
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/visit/[id]', params: { id: String(stop.id) } })} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <View style={styles.icon}>
                <Icon name="storefront-outline" size={22} color={colors.info} />
            </View>
            <View style={styles.text}>
                <AppText weight="extrabold" size={16} numberOfLines={1}>
                    {stop.merchant}
                </AppText>
                <AppText size={13} color={colors.body} numberOfLines={2}>
                    {details}
                </AppText>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.subtle} directional />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg - 2, padding: 14 },
    pressed: { opacity: 0.85 },
    icon: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#E8EEFD', alignItems: 'center', justifyContent: 'center' },
    text: { flex: 1, minWidth: 0 },
});
