import * as Location from 'expo-location';

/** Where the rider is now (last known fix, so it never waits), sent with every parcel update. */
export async function currentPosition(): Promise<{ latitude?: number; longitude?: number }> {
    try {
        const fix = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60_000 });

        return fix ? { latitude: fix.coords.latitude, longitude: fix.coords.longitude } : {};
    } catch {
        return {};
    }
}
