import { Camera, Map, Marker, NativeUserLocation } from '@maplibre/maplibre-react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { MAP_STYLE } from '@/components/map/RiderMap';
import StopPin from '@/components/map/StopPin';

/** A map centred on one stop, with the rider's position. */
export default function StopMap({ stop, style }: { stop: [number, number]; style?: StyleProp<ViewStyle> }) {
    return (
        <Map style={style} mapStyle={MAP_STYLE} logo={false} compass={false} scaleBar={false} touchRotate={false} touchPitch={false} attributionPosition={{ bottom: 28, left: 8 }}>
            <Camera initialViewState={{ center: stop, zoom: 14.5 }} />
            <NativeUserLocation />
            <Marker id="stop" lngLat={stop}>
                <StopPin tone="next" />
            </Marker>
        </Map>
    );
}
