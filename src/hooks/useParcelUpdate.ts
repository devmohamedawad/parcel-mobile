import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { api, ApiError } from '@/lib/api';
import { currentPosition } from '@/lib/position';
import type { ParcelDetail } from '@/lib/types';

type Fields = Record<string, string | number | undefined>;
export interface UploadFile {
    uri: string;
    name: string;
    type: string;
}

/**
 * Sends a rider update for a parcel with the current position. Validation errors come back per field;
 * anything else is shown in an alert.
 */
export function useParcelUpdate(tracking: string) {
    const { t } = useAuth();
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const send = useCallback(
        async (fields: Fields, files: Record<string, UploadFile | null> = {}): Promise<ParcelDetail | null> => {
            setBusy(true);
            setErrors({});
            try {
                const values: Fields = { ...fields, ...(await currentPosition()) };
                const attachments = Object.entries(files).filter((entry): entry is [string, UploadFile] => entry[1] !== null);
                let body: Fields | FormData = values;

                if (attachments.length > 0) {
                    const form = new FormData();
                    Object.entries(values).forEach(([key, value]) => value !== undefined && form.append(key, String(value)));
                    // React Native uploads a local file from { uri, name, type }.
                    attachments.forEach(([key, file]) => form.append(key, file as unknown as Blob));
                    body = form;
                }

                return await api<ParcelDetail>(`parcels/${tracking}/status`, { method: 'POST', body });
            } catch (exception) {
                if (exception instanceof ApiError && Object.keys(exception.fields).length > 0) {
                    setErrors(Object.fromEntries(Object.entries(exception.fields).map(([field, messages]) => [field, messages[0] ?? ''])));
                } else {
                    Alert.alert(exception instanceof ApiError && exception.code === 'network' ? t('noConnection') : exception instanceof Error ? exception.message : String(exception));
                }

                return null;
            } finally {
                setBusy(false);
            }
        },
        [tracking, t],
    );

    return { send, busy, errors };
}
