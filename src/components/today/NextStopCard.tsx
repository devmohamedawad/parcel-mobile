import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import ArrivalCountdown from '@/components/navigate/ArrivalCountdown';
import ParcelTaskCard from '@/components/tasks/ParcelTaskCard';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { useHeadThere } from '@/hooks/useHeadThere';
import { callPhone } from '@/lib/links';
import { lngLat } from '@/lib/stops';
import type { Heading, ParcelCard } from '@/lib/types';
import { colors, radius } from '@/theme';

interface NextStopCardProps {
    parcel: ParcelCard;
    /** Set while the rider is already driving to this parcel. */
    heading: Heading | null;
    onHeadedThere?: () => void;
}

/**
 * The next order in route order, impossible to miss: one big "I'm heading there now" button that tells
 * the branch and the recipient and starts the in-app navigation; once on the way, the countdown and a
 * button back to the navigation.
 */
export default function NextStopCard({ parcel, heading, onHeadedThere }: NextStopCardProps) {
    const { t } = useAuth();
    const position = lngLat(parcel);
    const headThere = useHeadThere(parcel, position, onHeadedThere);
    const [busy, setBusy] = useState(false);
    const onTheWay = heading?.tracking_number === parcel.tracking_number;

    const start = async () => {
        setBusy(true);
        try {
            await headThere.go();
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={[styles.wrap, onTheWay && styles.onTheWay]} testID="next-stop">
            <View style={styles.head}>
                <AppText weight="extrabold" size={18}>
                    {t('nextOrder')}
                </AppText>
                <AppText weight="bold" size={14} color={colors.brandText} onPress={() => router.navigate('/tasks')} accessibilityRole="link">
                    {t('allTasks')}
                </AppText>
            </View>
            <ParcelTaskCard parcel={parcel} next />
            {onTheWay && <ArrivalCountdown expectedAt={heading.expected_at} compact />}
            {position &&
                (onTheWay ? (
                    <Button label={t('continueNavigation')} icon="navigate" size="lg" onPress={() => router.push({ pathname: '/navigate/[tracking]', params: { tracking: parcel.tracking_number } })} testID="next-stop-continue" />
                ) : (
                    <Button label={t('headThereNow')} icon="navigate" size="lg" haptic busy={busy} onPress={start} testID="next-stop-head-there" />
                ))}
            {parcel.phone && <Button label={t('call')} icon="call-outline" variant="secondary" size="md" onPress={() => callPhone(parcel.phone!)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 12, padding: 14, borderRadius: radius.xl, backgroundColor: colors.brandTint, borderWidth: 1.5, borderColor: '#F3C7B1' },
    onTheWay: { backgroundColor: '#F2F6FE', borderColor: '#BFD3FB' },
    head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
