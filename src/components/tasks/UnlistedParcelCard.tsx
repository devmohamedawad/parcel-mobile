import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { UnlistedParcel } from '@/lib/types';
import { alertWorkError } from '@/lib/workAlert';
import { colors } from '@/theme';

/** A parcel collected without being in the system: carried until it is left at the warehouse. */
export default function UnlistedParcelCard({ parcel, onLeft }: { parcel: UnlistedParcel; onLeft: () => void }) {
    const { t } = useAuth();
    const [busy, setBusy] = useState(false);

    const leave = () =>
        Alert.alert(t('leaveUnlistedTitle'), t('leaveUnlistedBody', { code: parcel.code }), [
            { text: t('cancel'), style: 'cancel' },
            {
                text: t('leaveAtWarehouse'),
                onPress: async () => {
                    setBusy(true);
                    try {
                        await api(`unlisted-parcels/${parcel.id}/to-hub`, { method: 'POST' });
                        onLeft();
                    } catch (exception) {
                        alertWorkError(exception, t);
                    } finally {
                        setBusy(false);
                    }
                },
            },
        ]);

    return (
        <Card style={styles.card}>
            <View style={styles.text}>
                <AppText weight="bold" size={15} style={styles.ltr} numberOfLines={1}>
                    {parcel.code}
                </AppText>
                <AppText size={13} color={colors.muted} numberOfLines={1}>
                    {[parcel.merchant, parcel.reserved ? t('blankLabel') : t('merchantBarcode')].join(' · ')}
                </AppText>
            </View>
            <Button label={t('leaveAtWarehouse')} icon="business-outline" variant="outline" size="md" busy={busy} onPress={leave} testID={`unlisted-leave-${parcel.code}`} />
        </Card>
    );
}

const styles = StyleSheet.create({
    card: { gap: 12 },
    text: { gap: 2 },
    ltr: { writingDirection: 'ltr' },
});
