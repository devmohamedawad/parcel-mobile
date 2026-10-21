import { router } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import Button from '@/components/Button';
import { ApiError } from '@/lib/api';

export default function Login() {
    const { signIn, t } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {
        setBusy(true);
        setError(null);
        try {
            await signIn(email.trim(), password);
            router.replace('/today');
        } catch (exception) {
            setError(exception instanceof ApiError ? (exception.fields.email?.[0] ?? exception.message) : String(exception));
        } finally {
            setBusy(false);
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
                <Image source={require('../../assets/icon.png')} style={styles.logo} />
                <Text style={styles.title}>BabJet Rider</Text>
                <View style={styles.card}>
                    <TextInput style={styles.input} placeholder={t('email')} autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} />
                    <TextInput style={styles.input} placeholder={t('password')} secureTextEntry autoComplete="password" value={password} onChangeText={setPassword} />
                    {error && <Text style={styles.error}>{error}</Text>}
                    <Button label={busy ? t('signingIn') : t('signIn')} onPress={submit} busy={busy} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    body: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
    logo: { width: 96, height: 96, borderRadius: 24, alignSelf: 'center' },
    title: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: '#1F1B18' },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, gap: 12 },
    input: { borderWidth: 1, borderColor: '#E7E2DC', borderRadius: 14, paddingHorizontal: 14, minHeight: 50, fontSize: 16 },
    error: { color: '#C62828' },
});
