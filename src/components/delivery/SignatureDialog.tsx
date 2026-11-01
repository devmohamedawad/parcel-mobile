import { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import SignatureCanvas, { type Signature } from '@/components/delivery/SignatureCanvas';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { colors } from '@/theme';

interface SignatureDialogProps {
    initial: Signature | null;
    onSave: (signature: Signature | null) => void;
    onClose: () => void;
}

/**
 * Full-screen window for signing: the saved signature only changes on Save, so a stray touch or
 * Cancel leaves it as it was.
 */
export default function SignatureDialog({ initial, onSave, onClose }: SignatureDialogProps) {
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const [draft, setDraft] = useState<Signature | null>(initial);
    const paths = draft?.paths ?? [];

    return (
        <Modal visible animationType="slide" onRequestClose={onClose} statusBarTranslucent>
            <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
                <View style={styles.head}>
                    <AppText weight="extrabold" size={18}>
                        {t('signatureTitle')}
                    </AppText>
                    {paths.length > 0 && (
                        <AppText weight="bold" size={15} color={colors.brandText} onPress={() => setDraft(null)} accessibilityRole="button" testID="signature-clear">
                            {t('clear')}
                        </AppText>
                    )}
                </View>
                <SignatureCanvas paths={paths} hint={t('signHere')} onChange={setDraft} />
                <View style={styles.buttons}>
                    <View style={styles.button}>
                        <Button label={t('cancel')} variant="secondary" size="md" onPress={onClose} testID="signature-cancel" />
                    </View>
                    <View style={styles.button}>
                        <Button label={t('save')} icon="checkmark" size="md" onPress={() => onSave(paths.length > 0 ? draft : null)} testID="signature-save" />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.ground, paddingHorizontal: 20, gap: 14 },
    head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    buttons: { flexDirection: 'row', gap: 10 },
    button: { flex: 1 },
});
