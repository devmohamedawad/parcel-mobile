import { GeoJSONSource, Layer, Marker } from '@maplibre/maplibre-react-native';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import StopPin from '@/components/map/StopPin';
import { lngLat } from '@/lib/stops';
import type { ParcelCard } from '@/lib/types';
import { colors } from '@/theme';

/** The deliveries' located stops in route order: a line through them and numbered pins (first = next). */
export default function RouteStops({ deliveries }: { deliveries: ParcelCard[] }) {
    const stops = deliveries.flatMap((parcel, index) => {
        const position = lngLat(parcel);

        return position ? [{ parcel, position, number: index + 1 }] : [];
    });

    if (stops.length === 0) {
        return null;
    }

    return (
        <>
            {stops.length > 1 && (
                <GeoJSONSource id="route" data={{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: stops.map((stop) => stop.position) } }}>
                    <Layer type="line" id="route-casing" paint={{ 'line-color': '#FFFFFF', 'line-width': 9 }} layout={{ 'line-cap': 'round', 'line-join': 'round' }} />
                    <Layer type="line" id="route-line" paint={{ 'line-color': colors.brandStrong, 'line-width': 5, 'line-dasharray': [2, 1.5] }} layout={{ 'line-cap': 'round', 'line-join': 'round' }} />
                </GeoJSONSource>
            )}
            {stops.map((stop, index) => (
                <Marker key={stop.parcel.tracking_number} id={stop.parcel.tracking_number} lngLat={stop.position}>
                    <Pressable accessibilityRole="button" accessibilityLabel={stop.parcel.contact} onPress={() => router.push({ pathname: '/parcel/[tracking]', params: { tracking: stop.parcel.tracking_number } })}>
                        <StopPin label={String(stop.number)} tone={index === 0 ? 'next' : 'open'} />
                    </Pressable>
                </Marker>
            ))}
        </>
    );
}
