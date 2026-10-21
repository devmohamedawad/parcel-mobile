import { API_URL } from '@/config';
import { getToken } from '@/lib/session';

/** An error answered by the Parcel API: `{"error": {"code", "message", "fields"?}}`. */
export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
        message: string,
        public readonly fields: Record<string, string[]> = {},
    ) {
        super(message);
    }
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'DELETE';
    body?: unknown;
    locale?: string;
}

/**
 * Calls the rider app API (`/api/rider/v1/...`) with the saved token and returns `data`.
 */
export async function api<T>(path: string, { method = 'GET', body, locale = 'ar' }: RequestOptions = {}): Promise<T> {
    const token = await getToken();
    let response: Response;

    try {
        response = await fetch(`${API_URL}/api/rider/v1/${path.replace(/^\//, '')}`, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': locale,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        throw new ApiError(0, 'network', 'No connection to the server.');
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        const error = json?.error ?? {};
        throw new ApiError(response.status, error.code ?? 'server_error', error.message ?? 'Something went wrong.', error.fields ?? {});
    }

    return json?.data as T;
}
