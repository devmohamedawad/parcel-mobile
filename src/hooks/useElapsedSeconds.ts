import { useEffect, useState } from 'react';

/** Seconds since `since` (ISO time), ticking every second; 0 when there is no start time. */
export function useElapsedSeconds(since: string | null): number {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!since) {
            return;
        }
        const timer = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(timer);
    }, [since]);

    return since ? (now - new Date(since).getTime()) / 1000 : 0;
}
