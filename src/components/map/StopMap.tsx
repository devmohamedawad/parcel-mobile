import { Camera, type CameraRef, Map, Marker, NativeUserLocation } from '@maplibre/maplibre-react-native';
import { useEffect, useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { MAP_STYLE } from '@/components/map/RiderMap';
import StopPin from '@/components/map/StopPin';

/** A map centred on one stop (dashed when it is only the middle of the area), with the rider's position. */
export default function StopMap({ stop, approximate = false, style }: { stop: [number, number]; approximate?: boolean; style?: StyleProp<ViewStyle> }) {
    const camera = useRef<CameraRef>(null);
    const [longitude, latitude] = stop;

    // Follow the stop when it moves, e.g. after the rider saves the door.
    useEffect(() => {
        camera.current?.easeTo({ center: [longitude, latitude], duration: 500 });
    }, [longitude, latitude]);

    return (
        <Map style={style} mapStyle={MAP_STYLE} logo={false} compass={false} scaleBar={false} touchRotate={false} touchPitch={false} attributionPosition={{ bottom: 28, left: 8 }}>
            <Camera ref={camera} initialViewState={{ center: stop, zoom: 14.5 }} />
            <NativeUserLocation />
            <Marker id="stop" lngLat={stop}>
                <StopPin tone={approximate ? 'approx' : 'next'} />
            </Marker>
        </Map>
    );
}
