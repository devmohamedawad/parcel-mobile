import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { localized } from '@/lib/stops';
import type { ParcelCard } from '@/lib/types';
import { colors, radius, shadow } from '@/theme';

/** Deliveries without a saved location, so they cannot be drawn: listed under the map to open them. */
export default function UnlocatedStops({ parcels }: { parcels: ParcelCard[] }) {
    const { t, locale } = useAuth();

    if (parcels.length === 0) {
        return null;
    }

    return (
        <View style={styles.panel} testID="unlocated-stops">
            <View style={styles.heading}>
                <Icon name="location-outline" size={18} color={colors.muted} />
                <AppText weight="bold" size={13} color={colors.muted}>
                    {t('notOnMap', { count: parcels.length })}
                </AppText>
            </View>
            {parcels.map((parcel) => (
                <Pressable key={parcel.tracking_number} accessibilityRole="button" onPress={() => router.push({ pathname: '/parcel/[tracking]', params: { tracking: parcel.tracking_number } })} style={styles.row}>
                    <AppText weight="bold" size={14} style={styles.tracking}>
                        {parcel.tracking_number}
                    </AppText>
                    <AppText size={13} color={colors.muted} numberOfLines={1} style={styles.area}>
                        {localized(parcel.area, locale)}
                    </AppText>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    panel: { position: 'absolute', bottom: 24, start: 16, end: 84, padding: 12, gap: 6, borderRadius: radius.md, backgroundColor: colors.surface, ...shadow.float },
    heading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 36 },
    // Tracking numbers read left to right even on an Arabic screen.
    tracking: { writingDirection: 'ltr' },
    area: { flex: 1 },
});
