import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useRemote } from '@/hooks/useRemote';
import type { TodayWork } from '@/lib/types';

/**
 * Where the rider stands as a query string, rounded to about 100 m so GPS drift does not reload the
 * list. It is read each time the screen comes into view: the last known fix first, then a fresh one.
 */
function useStandingPoint(): string {
    const [query, setQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            let active = true;
            const take = (fix: Location.LocationObject | null) => {
                if (active && fix) {
                    setQuery(`?latitude=${fix.coords.latitude.toFixed(3)}&longitude=${fix.coords.longitude.toFixed(3)}`);
                }
            };

            (async () => {
                try {
                    take(await Location.getLastKnownPositionAsync({ maxAge: 5 * 60_000 }));
                    take(await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
                } catch {
                    // No permission or no fix: the server orders from the rider's last position or the warehouse.
                }
            })();

            return () => {
                active = false;
            };
        }, []),
    );

    return query;
}

/** The rider's day, with the deliveries ordered from where the phone stands now. */
export function useToday() {
    return useRemote<TodayWork>(`today${useStandingPoint()}`);
}
