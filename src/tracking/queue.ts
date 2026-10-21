import { File, Paths } from 'expo-file-system';
import { api, ApiError } from '@/lib/api';

export interface QueuedPoint {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    speed: number | null;
    heading: number | null;
    recorded_at: string;
}

/** Most points sent in one request (the server accepts up to 500). */
const BATCH_SIZE = 200;

/** Points kept when the phone stays offline for very long (about a full day at one point per 30 s). */
const MAX_QUEUED = 5000;

const file = () => new File(Paths.document, 'location-queue.json');

function read(): QueuedPoint[] {
    const queue = file();

    if (!queue.exists) {
        return [];
    }

    try {
        return JSON.parse(queue.textSync()) as QueuedPoint[];
    } catch {
        return [];
    }
}

function write(points: QueuedPoint[]): void {
    const queue = file();

    if (!queue.exists) {
        queue.create();
    }

    queue.write(JSON.stringify(points.slice(-MAX_QUEUED)));
}

/** Keeps points on the phone until the server has them, so nothing is lost without a connection. */
export function enqueue(points: QueuedPoint[]): void {
    write([...read(), ...points]);
}

export function queuedCount(): number {
    return read().length;
}

/**
 * Sends the queued points in batches; stops at the first network error and tries again next time.
 * Points refused because no shift is open are dropped (the shift was ended elsewhere).
 */
export async function flush(): Promise<void> {
    let queue = read();

    while (queue.length > 0) {
        const batch = queue.slice(0, BATCH_SIZE);

        try {
            await api('locations', { method: 'POST', body: { points: batch } });
        } catch (error) {
            const dropped = error instanceof ApiError && (error.status === 409 || error.status === 422);

            if (!dropped) {
                return;
            }
        }

        queue = queue.slice(batch.length);
        write(queue);
    }
}
