// The background location task must be registered before anything else runs.
import '@/tracking/locationTask';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold, useFonts } from '@expo-google-fonts/cairo';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/auth/AuthContext';
import LaunchSplash from '@/components/LaunchSplash';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
    const [fontsLoaded] = useFonts({ Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold, ...Ionicons.font });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync().catch(() => undefined);
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }} />
            <Launch />
        </AuthProvider>
    );
}

function Launch() {
    const { ready } = useAuth();
    const [showing, setShowing] = useState(true);
    const done = useCallback(() => setShowing(false), []);

    return showing ? <LaunchSplash ready={ready} onDone={done} /> : null;
}
