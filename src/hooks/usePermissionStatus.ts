import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export type LocationAccess = 'always' | 'whileUsing' | 'off';

interface PermissionStatus {
    location: LocationAccess;
    notifications: boolean;
}

async function readStatus(): Promise<PermissionStatus> {
    const [foreground, background, notifications] = await Promise.all([Location.getForegroundPermissionsAsync(), Location.getBackgroundPermissionsAsync(), Notifications.getPermissionsAsync()]);

    return {
        location: background.granted ? 'always' : foreground.granted ? 'whileUsing' : 'off',
        notifications: notifications.granted,
    };
}

/** Location and notification permissions, re-read when the rider comes back from the phone settings. */
export function usePermissionStatus(): PermissionStatus | null {
    const [status, setStatus] = useState<PermissionStatus | null>(null);

    useEffect(() => {
        readStatus().then(setStatus).catch(() => undefined);
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                readStatus().then(setStatus).catch(() => undefined);
            }
        });

        return () => subscription.remove();
    }, []);

    return status;
}
