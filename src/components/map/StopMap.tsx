import { Camera, Map, Marker, NativeUserLocation } from '@maplibre/maplibre-react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { MAP_STYLE } from '@/components/map/RiderMap';
import StopPin from '@/components/map/StopPin';

/** A map centred on one stop (dashed when it is only the middle of the area), with the rider's position. */
export default function StopMap({ stop, approximate = false, style }: { stop: [number, number]; approximate?: boolean; style?: StyleProp<ViewStyle> }) {
    return (
        <Map style={style} mapStyle={MAP_STYLE} logo={false} compass={false} scaleBar={false} touchRotate={false} touchPitch={false} attributionPosition={{ bottom: 28, left: 8 }}>
            <Camera initialViewState={{ center: stop, zoom: 14.5 }} />
            <NativeUserLocation />
            <Marker id="stop" lngLat={stop}>
                <StopPin tone={approximate ? 'approx' : 'next'} />
            </Marker>
        </Map>
    );
}
