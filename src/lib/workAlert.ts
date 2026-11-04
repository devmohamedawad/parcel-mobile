import { router } from 'expo-router';
import { Alert } from 'react-native';
import { ApiError } from '@/lib/api';
import type { StringKey } from '@/lib/i18n';

type Translate = (key: StringKey) => string;

/**
 * Shows why a rider update failed. A parcel or visit that is no longer the rider's (moved to another
 * rider or cancelled by the branch) answers 404: say so and go back to the refreshed list.
 */
export function alertWorkError(exception: unknown, t: Translate): void {
    if (exception instanceof ApiError && exception.status === 404) {
        Alert.alert(t('workGoneTitle'), t('workGoneBody'), [{ text: t('ok'), onPress: () => router.back() }], { cancelable: false });
    } else if (exception instanceof ApiError && exception.code === 'network') {
        Alert.alert(t('noConnection'));
    } else {
        Alert.alert(exception instanceof Error ? exception.message : String(exception));
    }
}
