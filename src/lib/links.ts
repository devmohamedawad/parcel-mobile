import { Linking } from 'react-native';

export function callPhone(phone: string): void {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => undefined);
}

export function openWhatsApp(phone: string): void {
    Linking.openURL(`https://wa.me/${phone.replace(/\D+/g, '')}`).catch(() => undefined);
}

/** Turn-by-turn directions in the phone's maps app (Google Maps on Android). */
export function navigateTo([longitude, latitude]: [number, number]): void {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`).catch(() => undefined);
}
