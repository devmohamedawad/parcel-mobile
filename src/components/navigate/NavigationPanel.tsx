import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import ArrivalCountdown from '@/components/navigate/ArrivalCountdown';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import type { Road } from '@/hooks/useRoadToStop';
import { callPhone } from '@/lib/links';
import { placeText } from '@/lib/stops';
import type { Heading, ParcelCard } from '@/lib/types';
import { colors, radius, shadow } from '@/theme';

interface NavigationPanelProps {
    parcel: ParcelCard;
    heading: Heading | null;
    road: Road | null;
    onArrived: () => void;
}

/** The bottom of the navigation screen: the countdown, what is left of the road, who waits and the buttons. */
export default function NavigationPanel({ parcel, heading, road, onArrived }: NavigationPanelProps) {
    const { t, locale } = useAuth();
    const insets = useSafeAreaInsets();
    const left = road?.by_road && road.duration_s !== null && road.distance_m !== null ? t('roadLeft', { minutes: Math.max(1, Math.round(road.duration_s / 60)), km: (road.distance_m / 1000).toFixed(1) }) : null;

    return (
        <View style={[styles.panel, { paddingBottom: insets.bottom + 16 }]}>
            {heading && <ArrivalCountdown expectedAt={heading.expected_at} />}
            <View style={styles.who}>
                <View style={styles.whoText}>
                    <AppText weight="extrabold" size={17} numberOfLines={1}>
                        {t('onTheWayTo', { name: parcel.contact })}
                    </AppText>
                    <AppText size={13} color={colors.body} numberOfLines={1}>
                        {placeText(parcel, locale)}
                    </AppText>
                </View>
                {left && (
                    <AppText weight="extrabold" size={15} color={colors.info} testID="navigation-road-left">
                        {left}
                    </AppText>
                )}
            </View>
            <View style={styles.buttons}>
                {parcel.phone && (
                    <View style={styles.button}>
                        <Button label={t('call')} icon="call-outline" variant="secondary" size="md" onPress={() => callPhone(parcel.phone!)} />
                    </View>
                )}
                <View style={styles.wide}>
                    <Button label={t('arrived')} icon="checkmark-circle" size="md" haptic onPress={onArrived} testID="navigation-arrived" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    panel: { position: 'absolute', start: 0, end: 0, bottom: 0, gap: 12, paddingHorizontal: 16, paddingTop: 16, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, ...shadow.float },
    who: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    whoText: { flex: 1 },
    buttons: { flexDirection: 'row', gap: 10 },
    button: { flex: 1 },
    wide: { flex: 2 },
});
