import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { api, ApiError } from '@/lib/api';

interface Remote<T> {
    data: T | null;
    error: ApiError | null;
    /** First load, before any data. */
    loading: boolean;
    /** Pull-to-refresh in progress. */
    refreshing: boolean;
    refresh: () => Promise<void>;
}

/** Loads an API path and reloads it every time the screen comes into view. */
export function useRemote<T>(path: string | null): Remote<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const current = useRef(path);
    current.current = path;

    const load = useCallback(async () => {
        if (!path) {
            setLoading(false);
            return;
        }
        try {
            const result = await api<T>(path);
            if (current.current === path) {
                setData(result);
                setError(null);
            }
        } catch (exception) {
            setError(exception instanceof ApiError ? exception : new ApiError(0, 'unknown', String(exception)));
        } finally {
            setLoading(false);
        }
    }, [path]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    const refresh = useCallback(async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }, [load]);

    return { data, error, loading, refreshing, refresh };
}
