import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { api } from '@/lib/api';

/** A turn on the way to the stop, as the routing server (OSRM) describes it. */
export interface RoadStep {
    /** depart, turn, new name, continue, merge, on ramp, off ramp, fork, end of road, roundabout, rotary, exit roundabout, arrive, … */
    type: string;
    /** left, right, slight left, sharp right, straight, uturn, … */
    modifier: string | null;
    /** The exit to take at a roundabout. */
    exit: number | null;
    name: string;
    /** Metres driven after this turn, up to the next one. */
    distance_m: number;
    /** [longitude, latitude] of the turn. */
    location: [number, number];
}

/** The way from the rider to a stop: along the roads, or a straight line when the server has no road. */
export interface Road {
    /** [longitude, latitude], from the rider to the stop. */
    coordinates: [number, number][];
    by_road: boolean;
    distance_m: number | null;
    duration_s: number | null;
    /** The turns in order (empty on a straight line). */
    steps: RoadStep[];
}

interface Follow {
    /** Ask again after the rider moved this far… */
    movedMetres: number;
    /** …but not more often than this. */
    minIntervalMs: number;
}

/** On the map screen the road only has to keep up roughly. */
const MAP_FOLLOW: Follow = { movedMetres: 50, minIntervalMs: 8_000 };

/**
 * The road from where the rider is to a parcel's stop, while the screen is in view; it follows the
 * rider as they drive and is asked again when the stop or its place changes. `position` is the rider's
 * latest fix ([longitude, latitude]). Both are null until known.
 */
export function useRoadToStop(trackingNumber: string | null, place: [number, number] | null, follow: Follow = MAP_FOLLOW): { road: Road | null; position: [number, number] | null } {
    const [road, setRoad] = useState<Road | null>(null);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const lastAsked = useRef(0);
    const placeKey = place ? place.join(',') : '';
    const { movedMetres, minIntervalMs } = follow;

    useFocusEffect(
        useCallback(() => {
            if (!trackingNumber || !placeKey) {
                setRoad(null);
                return;
            }

            // A road to the previous stop must not stay on the map while the new one loads.
            setRoad(null);
            let active = true;
            let subscription: Location.LocationSubscription | null = null;
            lastAsked.current = 0;

            const ask = async (fix: Location.LocationObject | null) => {
                if (!fix || !active) {
                    return;
                }
                setPosition([fix.coords.longitude, fix.coords.latitude]);
                if (Date.now() - lastAsked.current < minIntervalMs) {
                    return;
                }
                lastAsked.current = Date.now();
                try {
                    const { latitude, longitude } = fix.coords;
                    const result = await api<Road>(`parcels/${trackingNumber}/road?latitude=${latitude.toFixed(6)}&longitude=${longitude.toFixed(6)}`);
                    if (active) {
                        setRoad(result);
                    }
                } catch {
                    // Offline or the stop is gone: keep the last road until the list reloads.
                }
            };

            (async () => {
                try {
                    await ask(await Location.getLastKnownPositionAsync({ maxAge: 5 * 60_000 }));
                    const watch = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: movedMetres }, (fix) => ask(fix));
                    if (active) {
                        subscription = watch;
                    } else {
                        watch.remove();
                    }
                } catch {
                    // No location permission: the map shows the stops without the road.
                }
            })();

            return () => {
                active = false;
                subscription?.remove();
            };
        }, [trackingNumber, placeKey, movedMetres, minIntervalMs]),
    );

    return { road, position };
}
