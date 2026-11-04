import { GeoJSONSource, Layer, Marker } from '@maplibre/maplibre-react-native';
import StopPin from '@/components/map/StopPin';
import type { RouteStop } from '@/lib/stops';
import { colors } from '@/theme';

interface RouteStopsProps {
    stops: RouteStop[];
    selected: string | null;
    /** Tapping a pin selects it; tapping the selected one again clears it. */
    onSelect: (trackingNumber: string | null) => void;
}

/**
 * The deliveries' located stops in route order: a line through them and numbered pins (first = next).
 * The press is the marker's own (a touchable inside a marker never gets the touch on Android).
 */
export default function RouteStops({ stops, selected, onSelect }: RouteStopsProps) {
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
            {stops.map((stop) => {
                const tracking = stop.parcel.tracking_number;

                return (
                    <Marker key={tracking} id={tracking} lngLat={stop.position} onPress={() => onSelect(selected === tracking ? null : tracking)}>
                        <StopPin label={String(stop.number)} tone={selected === tracking || (selected === null && stop.number === 1) ? 'next' : stop.parcel.approximate ? 'approx' : 'open'} />
                    </Marker>
                );
            })}
        </>
    );
}
