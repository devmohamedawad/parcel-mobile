import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import RiderMap from '@/components/map/RiderMap';
import RouteStops from '@/components/map/RouteStops';
import StopDetailsCard from '@/components/map/StopDetailsCard';
import UnlocatedStops from '@/components/map/UnlocatedStops';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { useToday } from '@/hooks/useToday';
import { lngLat, routeStops } from '@/lib/stops';
import { colors, radius, shadow } from '@/theme';

export default function MapScreen() {
    const { user, t } = useAuth();
    const insets = useSafeAreaInsets();
    const [follow, setFollow] = useState(true);
    // Bumped to fit the camera to every stop: once when the stops first load, and from the button.
    const [overviewKey, setOverviewKey] = useState(0);
    const { data: work } = useToday();
    const deliveries = work?.deliveries ?? [];
    const unlocated = deliveries.filter((parcel) => lngLat(parcel) === null);
    const located = deliveries.length - unlocated.length;
    const onShift = Boolean(user?.shift);
    const stops = routeStops(deliveries);
    const [selected, setSelected] = useState<string | null>(null);
    const open = stops.find((stop) => stop.parcel.tracking_number === selected);
    const hasStops = stops.length > 0;

    const showAllStops = () => {
        setFollow(false);
        setOverviewKey((key) => key + 1);
    };

    // Open on the whole route rather than on the rider, so stops far away are not missed.
    useEffect(() => {
        if (hasStops) {
            showAllStops();
        }
    }, [hasStops]);
    const subtitle = deliveries.length > 0 ? (located === 0 ? t('noTasksOnMap') : unlocated.length > 0 ? t('stopsOnMap', { count: located, total: deliveries.length }) : t('stopsCount', { count: located })) : onShift ? t('trackingOn') : t('mapOffShift');

    return (
        <View style={styles.screen}>
            <RiderMap style={StyleSheet.absoluteFill} follow={follow} onFollowChange={setFollow} overview={stops.map((stop) => stop.position)} overviewKey={overviewKey}>
                <RouteStops stops={stops} selected={open ? selected : null} onSelect={setSelected} />
            </RiderMap>

            <View style={[styles.top, { top: insets.top + 12 }]}>
                <View style={styles.title}>
                    <Icon name="git-branch-outline" size={20} color={colors.brandText} />
                    <View style={styles.titleText}>
                        <AppText weight="extrabold" size={15}>
                            {deliveries.length > 0 ? t('mapRoute') : t('mapTitle')}
                        </AppText>
                        <AppText size={12} color={colors.muted}>
                            {subtitle}
                        </AppText>
                    </View>
                </View>
            </View>

            {!open && <UnlocatedStops parcels={unlocated} />}

            <View style={[styles.mapButtons, open && styles.mapButtonsAbove]}>
                {hasStops && (
                    <Pressable accessibilityRole="button" accessibilityLabel={t('showAllStops')} onPress={showAllStops} style={styles.mapButton} testID="map-all-stops">
                        <Icon name="git-branch-outline" size={24} color={colors.brandText} />
                    </Pressable>
                )}
                {!follow && (
                    <Pressable accessibilityRole="button" accessibilityLabel={t('myLocation')} onPress={() => setFollow(true)} style={styles.mapButton}>
                        <Icon name="locate" size={24} color={colors.info} />
                    </Pressable>
                )}
            </View>

            {open && <StopDetailsCard parcel={open.parcel} number={open.number} onClose={() => setSelected(null)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#EEEDE8' },
    top: { position: 'absolute', start: 16, end: 16 },
    title: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface, ...shadow.float },
    titleText: { flex: 1 },
    mapButtons: { position: 'absolute', bottom: 24, end: 16, gap: 10 },
    // Above the stop card while it is open.
    mapButtonsAbove: { bottom: 230 },
    mapButton: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.float },
});
