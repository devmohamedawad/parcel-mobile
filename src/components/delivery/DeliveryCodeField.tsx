import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import FieldError from '@/components/ui/FieldError';
import TextField from '@/components/ui/TextField';
import { api, ApiError } from '@/lib/api';
import { colors } from '@/theme';

interface DeliveryCodeFieldProps {
    tracking: string;
    value: string;
    onChange: (code: string) => void;
    canResend: boolean;
    error?: string;
}

/** The 4-digit code the recipient got by SMS, with a button to text a new one. */
export default function DeliveryCodeField({ tracking, value, onChange, canResend, error }: DeliveryCodeFieldProps) {
    const { t } = useAuth();
    const [sending, setSending] = useState(false);

    const resend = async () => {
        setSending(true);
        try {
            await api(`parcels/${tracking}/delivery-code`, { method: 'POST' });
            Alert.alert(t('codeResent'));
        } catch (exception) {
            Alert.alert(exception instanceof ApiError ? exception.message : String(exception));
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={styles.wrap}>
            <TextField label={t('codeLabel')} icon="keypad-outline" value={value} onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" maxLength={4} ltr testID="delivery-code" />
            <AppText size={13} color={colors.muted}>
                {t('codeHint')}
            </AppText>
            <FieldError message={error} />
            {canResend && <Button label={t('resendCode')} icon="refresh" variant="secondary" size="sm" busy={sending} onPress={resend} />}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 6 },
});
