import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/config';

const SERVER_KEY = 'babjet.rider.server';

let current: string | null = null;

/** "100.75.65.18:8010" or "https://x.com/" → "http://100.75.65.18:8010" / "https://x.com". */
export function normalizeServerUrl(input: string): string {
    const trimmed = input.trim().replace(/\/+$/, '');

    return /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
}

/** The server the app talks to: the one saved on this phone, or the address built into the app. */
export async function getServerUrl(): Promise<string> {
    if (current === null) {
        current = (await SecureStore.getItemAsync(SERVER_KEY)) ?? API_URL;
    }

    return current;
}

/** Saves the address; the built-in one clears the saved value so a new build's default applies again. */
export async function setServerUrl(url: string): Promise<void> {
    current = normalizeServerUrl(url);

    if (current === API_URL) {
        await SecureStore.deleteItemAsync(SERVER_KEY);
    } else {
        await SecureStore.setItemAsync(SERVER_KEY, current);
    }
}

/** True when the address answers like the Parcel rider API (any HTTP answer from /api/rider/v1/me). */
export async function serverAnswers(url: string): Promise<boolean> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    try {
        const response = await fetch(`${normalizeServerUrl(url)}/api/rider/v1/me`, { headers: { Accept: 'application/json' }, signal: controller.signal });

        return response.status === 401 || response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
}
