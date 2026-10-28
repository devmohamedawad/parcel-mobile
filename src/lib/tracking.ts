/** A typed or scanned tracking number as the server stores it: no spaces, upper case. */
export function normaliseTracking(value: string): string {
    return value.replace(/\s+/g, '').toUpperCase();
}
