import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import ChoiceList from '@/components/ui/ChoiceList';
import FieldError from '@/components/ui/FieldError';
import TextField from '@/components/ui/TextField';
import TopBar from '@/components/ui/TopBar';
import { useParcelUpdate } from '@/hooks/useParcelUpdate';
import { useRemote } from '@/hooks/useRemote';
import type { ParcelDetail } from '@/lib/types';
import { colors } from '@/theme';

export default function FailDelivery() {
    const { tracking } = useLocalSearchParams<{ tracking: string }>();
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const { data: parcel } = useRemote<ParcelDetail>(`parcels/${tracking}`);
    const { send, busy, errors } = useParcelUpdate(tracking);
    const [reason, setReason] = useState<string | null>(null);
    const [note, setNote] = useState('');

    const save = async () => {
        if (await send({ action: 'failed', reason: reason ?? undefined, note: note.trim() || undefined })) {
            router.dismissTo('/tasks');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TopBar title={t('failTitle')} />
            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
                <AppText weight="extrabold" size={15}>
                    {t('reasonLabel')}
                </AppText>
                <ChoiceList options={parcel?.failure_reasons ?? []} value={reason} onChange={setReason} />
                <FieldError message={errors.reason} />
                <TextField label={t('noteLabel')} icon="create-outline" value={note} onChangeText={setNote} maxLength={500} multiline />
                <FieldError message={errors.note} />
            </ScrollView>
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <Button label={t('save')} onPress={save} busy={busy} disabled={reason === null} haptic testID="fail-save" />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.ground },
    body: { padding: 20, gap: 12 },
    footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: '#ECE8E3' },
});
