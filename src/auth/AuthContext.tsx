import * as Device from 'expo-device';
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { deviceLocale, type Locale, type StringKey, translate } from '@/lib/i18n';
import { clearToken, getToken, setToken } from '@/lib/session';
import type { RiderProfile } from '@/lib/types';

interface AuthState {
    ready: boolean;
    user: RiderProfile | null;
    locale: Locale;
    t: (key: StringKey, replacements?: Record<string, string | number>) => string;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/** Who is signed in on this phone; restores the session from the saved token on start. */
export function AuthProvider({ children }: PropsWithChildren) {
    const [ready, setReady] = useState(false);
    const [user, setUser] = useState<RiderProfile | null>(null);
    const [locale] = useState<Locale>(deviceLocale);

    const refresh = useCallback(async () => {
        setUser(await api<RiderProfile>('me', { locale }));
    }, [locale]);

    useEffect(() => {
        (async () => {
            if (await getToken()) {
                await refresh().catch(() => clearToken());
            }
            setReady(true);
        })();
        // Only on start.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo<AuthState>(
        () => ({
            ready,
            user,
            locale,
            t: (key, replacements) => translate(locale, key, replacements),
            signIn: async (email, password) => {
                const result = await api<{ token: string; user: RiderProfile }>('login', { method: 'POST', body: { email, password, device_name: Device.modelName ?? 'Phone' }, locale });
                await setToken(result.token);
                setUser(result.user);
            },
            signOut: async () => {
                await api('logout', { method: 'POST', locale }).catch(() => undefined);
                await clearToken();
                setUser(null);
            },
            refresh,
        }),
        [ready, user, locale, refresh],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
    const state = useContext(AuthContext);

    if (!state) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return state;
}
