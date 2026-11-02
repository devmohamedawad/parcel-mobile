import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import type { ParcelAction } from '@/lib/types';
import { colors, radius } from '@/theme';

/** Confirms the step a label scan just recorded, at the top of the parcel screen. */
export default function ScanBanner({ action }: { action: ParcelAction }) {
    const { t } = useAuth();

    return (
        <View style={styles.banner} testID="scan-banner">
            <Icon name="checkmark-circle" size={22} color={colors.success} />
            <AppText weight="bold" size={14} color={colors.successText} style={styles.text}>
                {t('scanRecorded', { action: t(`action_${action}`) })}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: radius.md, backgroundColor: colors.successSoft },
    text: { flex: 1 },
});
