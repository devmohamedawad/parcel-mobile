import { GeoJSONSource, Layer, Marker } from '@maplibre/maplibre-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';
import StopCallout from '@/components/map/StopCallout';
import StopPin from '@/components/map/StopPin';
import { lngLat } from '@/lib/stops';
import type { ParcelCard } from '@/lib/types';
import { colors } from '@/theme';

/**
 * The deliveries' located stops in route order: a line through them and numbered pins (first = next).
 * Tapping a pin shows its box above it (tapping another moves it there, the same one closes it).
 */
export default function RouteStops({ deliveries }: { deliveries: ParcelCard[] }) {
    const [selected, setSelected] = useState<string | null>(null);
    const stops = deliveries.flatMap((parcel, index) => {
        const position = lngLat(parcel);

        return position ? [{ parcel, position, number: index + 1 }] : [];
    });

    if (stops.length === 0) {
        return null;
    }

    const open = stops.find((stop) => stop.parcel.tracking_number === selected);

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
                    <Pressable accessibilityRole="button" accessibilityLabel={`${stop.number} ${stop.parcel.contact}`} hitSlop={8} onPress={() => setSelected((current) => (current === stop.parcel.tracking_number ? null : stop.parcel.tracking_number))}>
                        <StopPin label={String(stop.number)} tone={index === 0 ? 'next' : 'open'} />
                    </Pressable>
                </Marker>
            ))}
            {open && (
                <Marker key={`callout-${open.parcel.tracking_number}`} id={`callout-${open.parcel.tracking_number}`} lngLat={open.position} anchor="bottom" offset={[0, -20]}>
                    <StopCallout parcel={open.parcel} number={open.number} />
                </Marker>
            )}
        </>
    );
}
