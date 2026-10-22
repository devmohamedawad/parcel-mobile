import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { BRAND_COLOR } from '@/config';
import { api } from '@/lib/api';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Asks for notification permission and registers this phone's Expo push token with the server.
 * Returns false when the rider refused or this is an iPhone simulator (Android emulators with Google APIs work).
 */
export async function registerForPush(): Promise<boolean> {
    if (!Device.isDevice && Platform.OS === 'ios') {
        return false;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'BabJet',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: BRAND_COLOR,
        });
    }

    const existing = await Notifications.getPermissionsAsync();
    const status = existing.status === 'granted' ? existing.status : (await Notifications.requestPermissionsAsync()).status;

    if (status !== 'granted') {
        return false;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    await api('push-tokens', { method: 'POST', body: { token, platform: Platform.OS, device_name: Device.modelName } });

    return true;
}
