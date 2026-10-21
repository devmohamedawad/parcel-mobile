import * as Location from 'expo-location';
import { BRAND_COLOR } from '@/config';
import { LOCATION_TASK } from '@/tracking/locationTask';
import { flush } from '@/tracking/queue';

export type TrackingPermission = 'granted' | 'foreground-only' | 'denied';

/**
 * Asks for location "while using" first, then "all the time" (Android opens the system settings for it).
 */
export async function requestTrackingPermission(): Promise<TrackingPermission> {
    const foreground = await Location.requestForegroundPermissionsAsync();

    if (foreground.status !== 'granted') {
        return 'denied';
    }

    const background = await Location.requestBackgroundPermissionsAsync();

    return background.status === 'granted' ? 'granted' : 'foreground-only';
}

/**
 * Starts recording a point every 30 s or 50 m (decided by the owner), with the ongoing notification
 * Android requires for background location.
 */
export async function startTracking(notification: { title: string; body: string }): Promise<void> {
    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) {
        return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
        accuracy: Location.Accuracy.High,
        timeInterval: 30_000,
        distanceInterval: 50,
        deferredUpdatesInterval: 60_000,
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
        activityType: Location.ActivityType.AutomotiveNavigation,
        foregroundService: {
            notificationTitle: notification.title,
            notificationBody: notification.body,
            notificationColor: BRAND_COLOR,
            killServiceOnDestroy: false,
        },
    });
}

/** Stops recording and sends what is still queued on the phone. */
export async function stopTracking(): Promise<void> {
    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    }

    await flush();
}

export async function isTracking(): Promise<boolean> {
    return Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
}
