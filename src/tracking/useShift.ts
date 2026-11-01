import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { api } from '@/lib/api';
import type { RiderShift } from '@/lib/types';
import { queuedCount } from '@/tracking/queue';
import { isTracking, requestTrackingPermission, startTracking, stopTracking } from '@/tracking/tracking';

/**
 * Start / end the shift: the server opens the shift, then the phone starts recording in the background;
 * ending stops recording, sends the last points and closes the shift.
 */
export function useShift() {
    const { user, refresh, t } = useAuth();
    const [busy, setBusy] = useState(false);
    const [tracking, setTracking] = useState(false);
    const [needsPermission, setNeedsPermission] = useState(false);
    const [lastShift, setLastShift] = useState<RiderShift | null>(null);
    const [waiting, setWaiting] = useState(0);
    const shift = user?.shift ?? null;

    useEffect(() => {
        isTracking().then(setTracking);
        setWaiting(queuedCount());
    }, [shift?.id]);

    // The phone records exactly while the server has a shift open: it starts again after the app was
    // restarted, and stops (removing the tracking notification) when the shift was ended elsewhere.
    useEffect(() => {
        if (shift && !tracking) {
            startTracking({ title: t('notificationTitle'), body: t('notificationBody') }).then(() => setTracking(true)).catch(() => undefined);
        }

        if (!shift && tracking && !busy) {
            stopTracking().then(() => setTracking(false)).catch(() => undefined);
        }
    }, [shift, tracking, busy, t]);

    const start = useCallback(async () => {
        setBusy(true);
        try {
            const permission = await requestTrackingPermission();
            setNeedsPermission(permission !== 'granted');

            if (permission === 'denied') {
                return;
            }

            await api('shifts/start', { method: 'POST' });
            await startTracking({ title: t('notificationTitle'), body: t('notificationBody') });
            setTracking(true);
            await refresh();
        } finally {
            setBusy(false);
        }
    }, [refresh, t]);

    const end = useCallback(async () => {
        setBusy(true);
        try {
            await stopTracking();
            setTracking(false);
            setLastShift(await api<RiderShift>('shifts/end', { method: 'POST' }).catch(() => null));
            setWaiting(queuedCount());
            await refresh();
        } finally {
            setBusy(false);
        }
    }, [refresh]);

    return { shift, tracking, busy, needsPermission, lastShift, waiting, start, end, openSettings: () => Linking.openSettings() };
}
