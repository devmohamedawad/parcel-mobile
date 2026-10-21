/**
 * Where the Parcel server is. Set EXPO_PUBLIC_API_URL for each build (EAS env or .env);
 * the default is the development server on the office Tailscale network.
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://100.75.65.18:8010').replace(/\/$/, '');

export const BRAND_COLOR = '#E0561B';
