import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

/** Maps the server's web path ("/rider/parcels/PK…" or "/rider") to the app screen. */
function openServerPath(url: unknown): void {
    if (typeof url !== 'string') {
        return;
    }

    const parcel = url.match(/^\/rider\/parcels\/([A-Za-z0-9-]+)/);

    if (parcel) {
        router.push({ pathname: '/parcel/[tracking]', params: { tracking: parcel[1] } });
    } else if (url.startsWith('/rider')) {
        router.navigate('/tasks');
    }
}

/** Opens the parcel (or the task list) when the rider taps a notification, including one that started the app. */
export function useNotificationLinks(enabled: boolean): void {
    const lastResponse = Notifications.useLastNotificationResponse();

    useEffect(() => {
        if (enabled && lastResponse?.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
            openServerPath(lastResponse.notification.request.content.data?.url);
            Notifications.clearLastNotificationResponseAsync().catch(() => undefined);
        }
    }, [enabled, lastResponse]);
}
