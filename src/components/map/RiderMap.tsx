import { Camera, type CameraRef, Map, NativeUserLocation, type TrackUserLocation } from '@maplibre/maplibre-react-native';
import { type ReactNode, useEffect, useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

/** Free OpenStreetMap vector tiles (OpenFreeMap), no key and no usage fees. */
export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const KUWAIT_CITY: [number, number] = [47.9774, 29.3759];

/** Room around the stops when showing them all: below the title card, above the stop card. */
const OVERVIEW_PADDING = { top: 140, right: 50, bottom: 260, left: 50 };

interface RiderMapProps {
    style?: StyleProp<ViewStyle>;
    /** Keep the camera on the rider; turns off when the rider drags the map. */
    follow: boolean;
    onFollowChange?: (following: boolean) => void;
    /** A small preview map that cannot be moved. */
    still?: boolean;
    /** Places to show together ([lng, lat]); the camera fits them each time `overviewKey` changes. */
    overview?: [number, number][];
    overviewKey?: number;
    /** Sources, layers and markers drawn on the map. */
    children?: ReactNode;
}

/** OpenStreetMap map centred on the rider's position, or fitted to the route's stops. */
export default function RiderMap({ style, follow, onFollowChange, still = false, overview = [], overviewKey = 0, children }: RiderMapProps) {
    const camera = useRef<CameraRef>(null);
    const tracking: TrackUserLocation | undefined = follow ? 'default' : undefined;
    const places = JSON.stringify(overview);

    useEffect(() => {
        const points = JSON.parse(places) as [number, number][];

        if (overviewKey === 0 || points.length === 0) {
            return;
        }

        const lngs = points.map((point) => point[0]);
        const lats = points.map((point) => point[1]);
        // One stop has no extent: widen it a little so the camera does not zoom in all the way.
        const pad = points.length === 1 ? 0.01 : 0;
        camera.current?.fitBounds([Math.min(...lngs) - pad, Math.min(...lats) - pad, Math.max(...lngs) + pad, Math.max(...lats) + pad], { padding: OVERVIEW_PADDING, duration: 600 });
    }, [overviewKey, places]);

    return (
        <Map style={style} mapStyle={MAP_STYLE} logo={false} compass={!still} scaleBar={false} dragPan={!still} touchRotate={false} touchPitch={false} attributionPosition={{ bottom: 8, left: 8 }}>
            <Camera ref={camera} initialViewState={{ center: KUWAIT_CITY, zoom: 14 }} trackUserLocation={tracking} onTrackUserLocationChange={(event) => onFollowChange?.(event.nativeEvent.trackUserLocation !== null)} />
            <NativeUserLocation mode={still ? 'default' : 'heading'} />
            {children}
        </Map>
    );
}
