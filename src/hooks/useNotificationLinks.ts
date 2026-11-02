import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { openServerPath } from '@/lib/serverPaths';

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
