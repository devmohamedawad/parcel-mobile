import { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { API_URL } from '@/config';
import { getServerUrl, serverAnswers, setServerUrl } from '@/lib/server';
import { colors, radius } from '@/theme';

interface ServerDialogProps {
    onClose: () => void;
}

/** Type the server address (IP:port or domain); it is checked before it is saved on the phone. */
export default function ServerDialog({ onClose }: ServerDialogProps) {
    const { t } = useAuth();
    const [address, setAddress] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getServerUrl().then(setAddress);
    }, []);

    const save = async () => {
        setBusy(true);
        setError(null);
        const answers = await serverAnswers(address);
        setBusy(false);

        if (!answers) {
            setError(t('serverUnreachable'));

            return;
        }

        await setServerUrl(address);
        onClose();
    };

    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <AppText weight="extrabold" size={18}>
                        {t('serverTitle')}
                    </AppText>
                    <AppText size={14} color={colors.muted}>
                        {t('serverHint')}
                    </AppText>
                    <TextField label={t('serverAddress')} icon="server-outline" value={address} onChangeText={setAddress} autoCapitalize="none" autoCorrect={false} keyboardType="url" ltr placeholder={API_URL} onSubmitEditing={save} testID="server-address" />
                    {error && (
                        <AppText weight="semibold" size={14} color={colors.danger}>
                            {error}
                        </AppText>
                    )}
                    <AppText weight="bold" size={14} color={colors.brandText} onPress={() => setAddress(API_URL)} accessibilityRole="button">
                        {t('serverDefault')}
                    </AppText>
                    <View style={styles.buttons}>
                        <View style={styles.button}>
                            <Button label={t('cancel')} variant="secondary" size="md" onPress={onClose} />
                        </View>
                        <View style={styles.button}>
                            <Button label={t('save')} icon="checkmark" size="md" busy={busy} onPress={save} testID="server-save" />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 20 },
    card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 20, gap: 14 },
    buttons: { flexDirection: 'row', gap: 10 },
    button: { flex: 1 },
});
