import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { ApiError } from '@/lib/api';
import { colors, radius } from '@/theme';

export default function Login() {
    const { signIn, t } = useAuth();
    const insets = useSafeAreaInsets();
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
            if (exception instanceof ApiError) {
                setError(exception.code === 'network' ? t('noConnection') : (exception.fields.email?.[0] ?? exception.message));
            } else {
                setError(String(exception));
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
                <View style={[styles.hero, { paddingTop: insets.top + 40 }]}>
                    <View style={styles.logoTile}>
                        <Image source={require('../../assets/brand-icon.webp')} style={styles.logo} contentFit="contain" accessibilityLabel="BabJet" />
                    </View>
                    <AppText weight="extrabold" size={28} color="#FFFFFF" style={styles.center}>
                        {t('brandTitle')}
                    </AppText>
                    <AppText weight="medium" size={15} color="#FFF4EE" style={styles.center}>
                        {t('brandSubtitle')}
                    </AppText>
                </View>

                <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
                    <View style={styles.heading}>
                        <AppText weight="extrabold" size={22}>
                            {t('hello')}
                        </AppText>
                        <AppText size={14} color={colors.muted}>
                            {t('signInHint')}
                        </AppText>
                    </View>
                    <TextField label={t('email')} icon="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" ltr testID="login-email" />
                    <TextField label={t('password')} icon="lock-closed-outline" value={password} onChangeText={setPassword} secret showLabel={t('showPassword')} hideLabel={t('hidePassword')} autoComplete="password" onSubmitEditing={submit} testID="login-password" />
                    {error && (
                        <View style={styles.error} accessibilityLiveRegion="polite">
                            <AppText weight="semibold" size={14} color={colors.danger}>
                                {error}
                            </AppText>
                        </View>
                    )}
                    <Button label={t('signIn')} onPress={submit} busy={busy} haptic testID="login-submit" />
                    <AppText size={14} color={colors.muted} style={styles.center}>
                        {t('forgotPassword')}
                    </AppText>
                    <View style={styles.grow} />
                    <AppText size={12} color={colors.subtle} style={styles.center}>
                        {t('version', { version: Constants.expoConfig?.version ?? '' })}
                    </AppText>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.brand },
    scroll: { flexGrow: 1 },
    hero: { alignItems: 'center', gap: 6, paddingHorizontal: 24, paddingBottom: 36 },
    logoTile: { width: 84, height: 84, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: '#78280A', shadowOpacity: 0.25, shadowRadius: 30, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
    logo: { width: 64, height: 64 },
    center: { textAlign: 'center' },
    sheet: { flexGrow: 1, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: 24, paddingTop: 32, gap: 20 },
    heading: { gap: 2 },
    error: { backgroundColor: '#FDECEC', borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 10 },
    grow: { flexGrow: 1 },
});
