import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { Road } from '@/hooks/useRoadToStop';
import { colors } from '@/theme';

/**
 * The road from the rider to the next stop: a solid line along the streets (dashed when it is only a
 * straight line because the routing server did not answer).
 */
export default function RoadToNextStop({ road }: { road: Road | null }) {
    if (!road || road.coordinates.length < 2) {
        return null;
    }

    return (
        <GeoJSONSource id="road-next" data={{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: road.coordinates } }}>
            <Layer type="line" id="road-next-casing" paint={{ 'line-color': '#FFFFFF', 'line-width': 10 }} layout={{ 'line-cap': 'round', 'line-join': 'round' }} />
            <Layer type="line" id="road-next-line" paint={{ 'line-color': colors.info, 'line-width': 6, ...(road.by_road ? {} : { 'line-dasharray': [1, 1.5] }) }} layout={{ 'line-cap': 'round', 'line-join': 'round' }} />
        </GeoJSONSource>
    );
}
