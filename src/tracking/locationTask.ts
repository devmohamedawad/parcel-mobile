import type { LocationObject } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { enqueue, flush } from '@/tracking/queue';

export const LOCATION_TASK = 'babjet-rider-location';

/**
 * Runs in the background while the shift is open: every position the OS delivers is queued on the phone,
 * then the queue is sent to the server. Must be defined at the top level (imported by the root layout).
 */
TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) {
        return;
    }

    const { locations } = data as { locations: LocationObject[] };

    enqueue(
        locations.map((location) => ({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy ?? null,
            speed: location.coords.speed ?? null,
            heading: location.coords.heading ?? null,
            recorded_at: new Date(location.timestamp).toISOString(),
        })),
    );

    await flush();
});
