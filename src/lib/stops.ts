import type { Locale } from '@/lib/i18n';
import type { ParcelCard, Stop, TodayWork, Translated } from '@/lib/types';

/** The name in the rider's language, falling back to any language given. */
export function localized(names: Translated | null | undefined, locale: Locale): string {
    if (!names) {
        return '';
    }

    return names[locale] ?? names.en ?? Object.values(names)[0] ?? '';
}

/** "Salmiya · Block 10, Street 5" */
export function placeText(stop: Pick<Stop, 'area' | 'line'>, locale: Locale): string {
    return [localized(stop.area, locale), stop.line].filter(Boolean).join(' · ');
}

/**
 * [longitude, latitude] for the map: the stop's own place, or else the middle of its area (the stop is
 * then `approximate`); null when neither is known.
 */
export function lngLat(stop: Pick<Stop, 'latitude' | 'longitude' | 'area_latitude' | 'area_longitude'>): [number, number] | null {
    if (stop.latitude !== null && stop.longitude !== null) {
        return [Number(stop.longitude), Number(stop.latitude)];
    }

    if (stop.area_latitude != null && stop.area_longitude != null) {
        return [Number(stop.area_longitude), Number(stop.area_latitude)];
    }

    return null;
}

/** Every parcel still on the rider's list, in the order they are worked. */
export function openParcels(work: TodayWork): ParcelCard[] {
    return [...work.pickups, ...work.in_hand, ...work.deliveries, ...work.returns];
}

/** A delivery placed on the map, numbered in route order (1 = next). */
export interface RouteStop {
    parcel: ParcelCard;
    position: [number, number];
    number: number;
}

/** The deliveries that have a map place, keeping their route number. */
export function routeStops(deliveries: ParcelCard[]): RouteStop[] {
    return deliveries.flatMap((parcel, index) => {
        const position = lngLat(parcel);

        return position ? [{ parcel, position, number: index + 1 }] : [];
    });
}
