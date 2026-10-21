import { Camera, Map, NativeUserLocation, type TrackUserLocation } from '@maplibre/maplibre-react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

/** Free OpenStreetMap vector tiles (OpenFreeMap), no key and no usage fees. */
export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const KUWAIT_CITY: [number, number] = [47.9774, 29.3759];

interface RiderMapProps {
    style?: StyleProp<ViewStyle>;
    /** Keep the camera on the rider; turns off when the rider drags the map. */
    follow: boolean;
    onFollowChange?: (following: boolean) => void;
    /** A small preview map that cannot be moved. */
    still?: boolean;
    /** Sources, layers and markers drawn on the map. */
    children?: ReactNode;
}

/** OpenStreetMap map centred on the rider's position. */
export default function RiderMap({ style, follow, onFollowChange, still = false, children }: RiderMapProps) {
    const tracking: TrackUserLocation | undefined = follow ? 'default' : undefined;

    return (
        <Map style={style} mapStyle={MAP_STYLE} logo={false} compass={!still} scaleBar={false} dragPan={!still} touchRotate={false} touchPitch={false} attributionPosition={{ bottom: 8, left: 8 }}>
            <Camera initialViewState={{ center: KUWAIT_CITY, zoom: 14 }} trackUserLocation={tracking} onTrackUserLocationChange={(event) => onFollowChange?.(event.nativeEvent.trackUserLocation !== null)} />
            <NativeUserLocation mode={still ? 'default' : 'heading'} />
            {children}
        </Map>
    );
}
