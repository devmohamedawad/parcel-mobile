import { useEffect, useState } from 'react';

/**
 * Seconds left until `until` (an ISO time), ticking every second; below zero once it has passed.
 * Null when there is no time to count to.
 */
export function useCountdown(until: string | null | undefined): number | null {
    const target = until ? Date.parse(until) : NaN;
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (Number.isNaN(target)) {
            return;
        }
        const timer = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(timer);
    }, [target]);

    return Number.isNaN(target) ? null : Math.round((target - now) / 1000);
}
