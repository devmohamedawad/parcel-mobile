import type { Locale } from '@/lib/i18n';

/** Arabic text with Latin digits, as used across Kuwait apps. */
function intlLocale(locale: Locale): string {
    return locale === 'ar' ? 'ar-u-nu-latn' : 'en';
}

export function formatTime(locale: Locale, iso: string): string {
    return new Date(iso).toLocaleTimeString(intlLocale(locale), { hour: 'numeric', minute: '2-digit' });
}

export function formatDay(locale: Locale, date: Date = new Date()): string {
    return date.toLocaleDateString(intlLocale(locale), { weekday: 'long', day: 'numeric', month: 'long' });
}

/** 02:14:36 */
export function formatClock(totalSeconds: number): string {
    const seconds = Math.max(0, Math.floor(totalSeconds));

    return [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((part) => String(part).padStart(2, '0')).join(':');
}

export function hoursAndMinutes(totalSeconds: number): { h: number; m: number } {
    const minutes = Math.max(0, Math.round(totalSeconds / 60));

    return { h: Math.floor(minutes / 60), m: minutes % 60 };
}
