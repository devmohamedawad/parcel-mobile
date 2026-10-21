import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import DeliveryCodeField from '@/components/delivery/DeliveryCodeField';
import PhotoField from '@/components/delivery/PhotoField';
import SignaturePad, { type SignaturePadHandle } from '@/components/delivery/SignaturePad';
import Button from '@/components/ui/Button';
import FieldError from '@/components/ui/FieldError';
import TextField from '@/components/ui/TextField';
import TopBar from '@/components/ui/TopBar';
import { type UploadFile, useParcelUpdate } from '@/hooks/useParcelUpdate';
import { useRemote } from '@/hooks/useRemote';
import type { ParcelDetail } from '@/lib/types';
import { colors } from '@/theme';

export default function ConfirmDelivery() {
    const { tracking } = useLocalSearchParams<{ tracking: string }>();
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const { data: parcel } = useRemote<ParcelDetail>(`parcels/${tracking}`);
    const { send, busy, errors } = useParcelUpdate(tracking);
    const signature = useRef<SignaturePadHandle>(null);
    const [cash, setCash] = useState('');
    const [code, setCode] = useState('');
    const [receivedBy, setReceivedBy] = useState('');
    const [photo, setPhoto] = useState<UploadFile | null>(null);

    useEffect(() => {
        if (parcel) {
            setCash(parcel.cod_amount);
        }
    }, [parcel]);

    if (!parcel) {
        return (
            <View style={styles.screen}>
                <TopBar title={t('deliverTitle')} />
                <ActivityIndicator style={styles.loader} color={colors.brand} />
            </View>
        );
    }

    const collectsCash = Number(parcel.cod_amount) > 0;
    const ready = (!parcel.proof.code || code.length === 4) && (!parcel.proof.photo || photo !== null);

    const confirm = async () => {
        const fields = {
            action: 'delivered',
            cod_collected: collectsCash ? cash : undefined,
            delivery_code: parcel.proof.code ? code : undefined,
            received_by: receivedBy.trim() || undefined,
            exchange_collected: parcel.exchange_description ? 1 : undefined,
        };
        if (await send(fields, { photo, signature: (await signature.current?.toFile()) ?? null })) {
            router.dismissTo('/tasks');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TopBar title={t('deliverTitle')} />
            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
                {collectsCash && (
                    <View style={styles.field}>
                        <TextField label={t('codCollected', { currency: parcel.currency })} icon="cash-outline" value={cash} onChangeText={setCash} keyboardType="decimal-pad" ltr testID="cod-collected" />
                        <FieldError message={errors.cod_collected} />
                    </View>
                )}
                {parcel.proof.code && <DeliveryCodeField tracking={tracking} value={code} onChange={setCode} canResend={parcel.proof.can_resend_code} error={errors.delivery_code} />}
                <PhotoField photo={photo} required={parcel.proof.photo} onChange={setPhoto} />
                <FieldError message={errors.photo} />
                <SignaturePad ref={signature} label={t('signatureLabel')} />
                <View style={styles.field}>
                    <TextField label={t('receivedBy')} icon="person-outline" value={receivedBy} onChangeText={setReceivedBy} maxLength={100} />
                    <FieldError message={errors.received_by} />
                </View>
                <FieldError message={errors.exchange_collected} />
            </ScrollView>
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <Button label={t('action_delivered')} icon="checkmark-circle" onPress={confirm} busy={busy} disabled={!ready} haptic testID="deliver-confirm" />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.ground },
    loader: { marginTop: 48 },
    body: { padding: 20, gap: 18 },
    field: { gap: 6 },
    footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: '#ECE8E3' },
});
