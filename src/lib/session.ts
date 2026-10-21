import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'babjet.rider.token';

/** The rider's API token, kept in the phone's secure storage. */
export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}
