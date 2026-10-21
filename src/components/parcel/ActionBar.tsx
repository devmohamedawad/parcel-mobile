import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import Button from '@/components/ui/Button';
import type { ParcelAction, ParcelDetail } from '@/lib/types';
import { colors } from '@/theme';

interface ActionBarProps {
    parcel: ParcelDetail;
    busy: boolean;
    /** A one-tap step (collected, out for delivery, returned) after the rider confirms. */
    onStep: (action: ParcelAction) => void;
}

/** The parcel's next actions, pinned to the bottom of the screen. */
export default function ActionBar({ parcel, busy, onStep }: ActionBarProps) {
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const params = { tracking: parcel.tracking_number };

    if (parcel.actions.length === 0) {
        return null;
    }

    const confirmStep = (action: ParcelAction) => {
        const label = t(`action_${action}`);
        Alert.alert(t('confirmAction', { action: label }), undefined, [
            { text: t('cancel'), style: 'cancel' },
            { text: t('confirm'), onPress: () => onStep(action) },
        ]);
    };

    return (
        <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
            {parcel.actions.includes('failed') && (
                <View style={styles.narrow}>
                    <Button label={t('action_failed')} variant="danger" size="md" onPress={() => router.push({ pathname: '/parcel/[tracking]/fail', params })} testID="action-failed" />
                </View>
            )}
            {parcel.actions.includes('delivered') && (
                <View style={styles.wide}>
                    <Button label={t('action_delivered')} icon="checkmark-circle" size="md" haptic onPress={() => router.push({ pathname: '/parcel/[tracking]/deliver', params })} testID="action-delivered" />
                </View>
            )}
            {parcel.actions
                .filter((action) => action !== 'delivered' && action !== 'failed')
                .map((action) => (
                    <View key={action} style={styles.wide}>
                        <Button label={t(`action_${action}`)} icon="checkmark-circle" size="md" busy={busy} haptic onPress={() => confirmStep(action)} testID={`action-${action}`} />
                    </View>
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    bar: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: '#ECE8E3' },
    narrow: { flex: 1 },
    wide: { flex: 2 },
});
