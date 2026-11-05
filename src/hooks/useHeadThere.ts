import { useAuth } from '@/auth/AuthContext';
import { api } from '@/lib/api';
import { navigateTo } from '@/lib/links';
import { currentPosition } from '@/lib/position';

/**
 * "Head there": for a parcel out for delivery, tells the server the rider is driving to it now (its trip
 * starts here and the branch sees where the rider is going), then opens directions. Other stops only
 * open directions. Directions open even when the server cannot be reached.
 */
export function useHeadThere(parcel: { tracking_number: string; status: string }, position: [number, number] | null, onRecorded?: () => void) {
    const { t } = useAuth();
    const delivering = parcel.status === 'out_for_delivery';

    const go = async () => {
        if (delivering) {
            try {
                await api(`parcels/${parcel.tracking_number}/set-off`, { method: 'POST', body: await currentPosition() });
                onRecorded?.();
            } catch {
                // Directions matter more than the record; the trip then starts at the previous stop.
            }
        }

        if (position) {
            navigateTo(position);
        }
    };

    return { label: delivering ? t('headThere') : t('navigate'), go };
}
