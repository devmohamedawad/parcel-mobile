import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

/** Same size as the server keeps (App\Support\PhotoStore): every detail of a door photo, a fraction of the bytes. */
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Shrinks a camera photo before upload: at most MAX_EDGE pixels on the long side, high-quality JPEG.
 * A 3–5 MB photo uploads as a few hundred KB; if shrinking fails the original is sent (the server shrinks it then).
 */
export async function compressPhoto(photo: { uri: string; width: number; height: number }): Promise<{ uri: string; type: string; name: string } | null> {
    try {
        const context = ImageManipulator.manipulate(photo.uri);

        if (Math.max(photo.width, photo.height) > MAX_EDGE) {
            context.resize(photo.width >= photo.height ? { width: MAX_EDGE } : { height: MAX_EDGE });
        }

        const image = await (await context.renderAsync()).saveAsync({ compress: JPEG_QUALITY, format: SaveFormat.JPEG });

        return { uri: image.uri, type: 'image/jpeg', name: 'photo.jpg' };
    } catch {
        return null;
    }
}
