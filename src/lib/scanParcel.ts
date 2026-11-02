import { api } from '@/lib/api';
import { currentPosition } from '@/lib/position';
import type { ParcelAction, ParcelDetail } from '@/lib/types';

/**
 * Records the step a label scan stands for (collected at the merchant, taken out of the warehouse).
 * Returns that step, or null when the rider has to choose on the parcel screen or the parcel could not be
 * loaded (the parcel screen then says why). A refused step (e.g. cash limit reached) is thrown with its message.
 */
export async function recordScan(tracking: string): Promise<ParcelAction | null> {
    let parcel: ParcelDetail;

    try {
        parcel = await api<ParcelDetail>(`parcels/${tracking}`);
    } catch {
        return null;
    }

    if (!parcel.scan_action) {
        return null;
    }

    await api(`parcels/${tracking}/status`, { method: 'POST', body: { action: parcel.scan_action, ...(await currentPosition()) } });

    return parcel.scan_action;
}
