import { router } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { api } from '@/lib/api';
import { navigateTo } from '@/lib/links';
import { currentPosition } from '@/lib/position';

/**
 * "Head there": for a parcel out for delivery, tells the server the rider is driving to it now (its trip
 * starts here, the branch sees where the rider is going and the recipient is texted the rider is on the
 * way), then drives there inside the app with the countdown. The navigation opens even when the server
 * cannot be reached. Other stops (collecting from a merchant) open the phone's maps app.
 */
export function useHeadThere(parcel: { tracking_number: string; status: string }, position: [number, number] | null, onRecorded?: () => void) {
    const { t } = useAuth();
    const delivering = parcel.status === 'out_for_delivery';

    const go = async () => {
        if (!delivering) {
            if (position) {
                navigateTo(position);
            }
            return;
        }

        try {
            await api(`parcels/${parcel.tracking_number}/set-off`, { method: 'POST', body: await currentPosition() });
            onRecorded?.();
        } catch {
            // Driving there matters more than the record; the trip then starts at the previous stop.
        }

        router.push({ pathname: '/navigate/[tracking]', params: { tracking: parcel.tracking_number } });
    };

    return { label: delivering ? t('headThere') : t('navigate'), go };
}
