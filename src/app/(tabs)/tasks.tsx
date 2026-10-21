import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { formatDay } from '@/lib/format';
import { colors } from '@/theme';

export default function Tasks() {
    const { t, locale } = useAuth();

    return (
        <SafeAreaView edges={['top']} style={styles.screen}>
            <View style={styles.header}>
                <AppText weight="extrabold" size={26}>
                    {t('tabTasks')}
                </AppText>
                <AppText size={13} color={colors.muted}>
                    {formatDay(locale)}
                </AppText>
            </View>
            <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                    <Icon name="cube-outline" size={36} color={colors.brandText} />
                </View>
                <AppText weight="extrabold" size={18} style={styles.center}>
                    {t('tasksEmptyTitle')}
                </AppText>
                <AppText size={14} color={colors.muted} style={styles.center}>
                    {t('tasksEmptyBody')}
                </AppText>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: { backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#ECE8E3' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 32 },
    emptyIcon: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    center: { textAlign: 'center' },
});
