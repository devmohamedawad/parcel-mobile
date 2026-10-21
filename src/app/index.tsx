import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { BRAND_COLOR } from '@/config';

/** Sends the rider to Today when signed in, otherwise to the sign-in screen. */
export default function Index() {
    const { ready, user } = useAuth();

    if (!ready) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={BRAND_COLOR} size="large" />
            </View>
        );
    }

    return <Redirect href={user ? '/today' : '/login'} />;
}
