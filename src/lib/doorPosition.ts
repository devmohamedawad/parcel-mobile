import * as Location from 'expo-location';

/**
 * A fresh, precise fix of where the rider stands now (for saving a recipient's door), or null when
 * location is off or the fix fails. Unlike currentPosition() it waits for the GPS.
 */
export async function doorPosition(): Promise<{ latitude: number; longitude: number; accuracy: number | null } | null> {
    try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) {
            return null;
        }

        const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });

        return { latitude: fix.coords.latitude, longitude: fix.coords.longitude, accuracy: fix.coords.accuracy };
    } catch {
        return null;
    }
}
