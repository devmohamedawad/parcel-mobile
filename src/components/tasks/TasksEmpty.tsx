import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { colors } from '@/theme';

/** Nothing to do today, or the list could not load. */
export default function TasksEmpty({ failed }: { failed: boolean }) {
    const { t } = useAuth();

    return (
        <View style={styles.empty}>
            <View style={styles.icon}>
                <Icon name={failed ? 'cloud-offline-outline' : 'cube-outline'} size={36} color={colors.brandText} />
            </View>
            <AppText weight="extrabold" size={18} style={styles.center}>
                {failed ? t('noConnection') : t('tasksEmptyTitle')}
            </AppText>
            <AppText size={14} color={colors.muted} style={styles.center}>
                {failed ? t('loadFailed') : t('tasksEmptyBody')}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 32, minHeight: 360 },
    icon: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    center: { textAlign: 'center' },
});
