import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { doorPosition } from '@/lib/doorPosition';
import type { ParcelDetail } from '@/lib/types';
import { alertWorkError } from '@/lib/workAlert';

/**
 * At the recipient's door: saves where the rider stands as the parcel's delivery place, so the next
 * visit (and the map) goes straight to the door. Replacing a known place asks first.
 */
export default function SaveDoorLocationButton({ parcel, onSaved }: { parcel: ParcelDetail; onSaved: () => void }) {
    const { t } = useAuth();
    const [busy, setBusy] = useState(false);
    const known = parcel.delivery.latitude !== null && !parcel.delivery.approximate;

    const save = async () => {
        setBusy(true);
        try {
            const position = await doorPosition();

            if (!position) {
                Alert.alert(t('locationNeededToSave'));

                return;
            }

            await api(`parcels/${parcel.tracking_number}/location`, { method: 'POST', body: position });
            Alert.alert(t('doorLocationSaved'));
            onSaved();
        } catch (exception) {
            alertWorkError(exception, t);
        } finally {
            setBusy(false);
        }
    };

    const confirm = () =>
        known
            ? Alert.alert(t('replaceDoorLocationTitle'), t('replaceDoorLocationBody'), [
                  { text: t('cancel'), style: 'cancel' },
                  { text: t('saveDoorLocation'), onPress: save },
              ])
            : save();

    return <Button label={t('saveDoorLocation')} icon="pin-outline" variant="outline" size="md" busy={busy} onPress={confirm} testID="save-door-location" />;
}
