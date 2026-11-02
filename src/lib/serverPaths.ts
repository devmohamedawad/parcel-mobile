import { router } from 'expo-router';

/** Maps the server's web path ("/rider/parcels/PK…" or "/rider") to the app screen. */
export function openServerPath(url: unknown): void {
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
