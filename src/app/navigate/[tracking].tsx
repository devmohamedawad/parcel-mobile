import { Marker } from '@maplibre/maplibre-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import RiderMap from '@/components/map/RiderMap';
import RoadToNextStop from '@/components/map/RoadToNextStop';
import StopPin from '@/components/map/StopPin';
import NavigationPanel from '@/components/navigate/NavigationPanel';
import TurnBanner from '@/components/navigate/TurnBanner';
import TasksEmpty from '@/components/tasks/TasksEmpty';
import Icon from '@/components/ui/Icon';
import { useRoadToStop } from '@/hooks/useRoadToStop';
import { useToday } from '@/hooks/useToday';
import { lngLat, openParcels } from '@/lib/stops';
import { colors, radius, shadow } from '@/theme';

/** Turn-by-turn needs fresh turns: ask again every 20 m driven, at most every 5 seconds. */
const NAVIGATION_FOLLOW = { movedMetres: 20, minIntervalMs: 5_000 };

/**
 * Driving to a stop inside the app: the map follows the rider's direction along the street route, the
 * next turn is written at the top, and the bottom counts down to the expected arrival. "I've arrived"
 * opens the parcel to deliver it.
 */
export default function NavigateScreen() {
    const { tracking } = useLocalSearchParams<{ tracking: string }>();
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const [follow, setFollow] = useState(true);
    const { data: work, error } = useToday();
    const parcel = work ? openParcels(work).find((open) => open.tracking_number === tracking) : undefined;
    const place = parcel ? lngLat(parcel) : null;
    const heading = work?.heading?.tracking_number === tracking ? work.heading : null;
    const { road, position } = useRoadToStop(parcel ? tracking : null, place, NAVIGATION_FOLLOW);

    if (work && (!parcel || !place)) {
        return (
            <View style={[styles.screen, styles.gone, { paddingTop: insets.top + 24 }]}>
                <TasksEmpty failed={error !== null} missing />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <RiderMap style={StyleSheet.absoluteFill} follow={follow} onFollowChange={setFollow} navigating>
                <RoadToNextStop road={road} />
                {place && (
                    <Marker id="destination" lngLat={place}>
                        <StopPin tone={parcel?.approximate ? 'approx' : 'next'} />
                    </Marker>
                )}
            </RiderMap>

            <View style={[styles.top, { top: insets.top + 10 }]}>
                <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => router.back()} hitSlop={8} style={styles.back}>
                    <Icon name="arrow-back" size={22} directional />
                </Pressable>
                <View style={styles.banner}>
                    <TurnBanner road={road} position={position} />
                </View>
            </View>

            {!follow && (
                <Pressable accessibilityRole="button" accessibilityLabel={t('myLocation')} onPress={() => setFollow(true)} style={styles.recenter}>
                    <Icon name="navigate" size={24} color={colors.info} />
                </Pressable>
            )}

            {parcel && <NavigationPanel parcel={parcel} heading={heading} road={road} onArrived={() => router.replace({ pathname: '/parcel/[tracking]', params: { tracking } })} />}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#EEEDE8' },
    gone: { paddingHorizontal: 20 },
    top: { position: 'absolute', start: 12, end: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    back: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.float },
    banner: { flex: 1 },
    recenter: { position: 'absolute', end: 16, bottom: 300, width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.float },
});
