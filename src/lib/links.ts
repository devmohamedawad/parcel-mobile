import { Linking, Platform } from 'react-native';

export function callPhone(phone: string): void {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => undefined);
}

export function openWhatsApp(phone: string): void {
    Linking.openURL(`https://wa.me/${phone.replace(/\D+/g, '')}`).catch(() => undefined);
}

const directionsUrl = (latitude: number, longitude: number) => `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

/**
 * Opens the drop-off in the rider's navigation app. On Android a geo: link lets the rider pick
 * Google Maps, Waze, Petal Maps or any other installed app (or uses the one they set as default);
 * without any maps app, directions open in the browser.
 */
export function navigateTo([longitude, latitude]: [number, number]): void {
    const url = Platform.OS === 'android' ? `geo:${latitude},${longitude}?q=${latitude},${longitude}` : directionsUrl(latitude, longitude);

    Linking.openURL(url).catch(() => Linking.openURL(directionsUrl(latitude, longitude)).catch(() => undefined));
}
