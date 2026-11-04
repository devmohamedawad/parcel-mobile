import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { colors } from '@/theme';

/** Codes scanned at the visit for parcels not in the system; a wrong scan can be removed. */
export default function UnlistedCodesList({ codes, onRemove }: { codes: string[]; onRemove: (code: string) => void }) {
    const { t } = useAuth();

    return (
        <View style={styles.wrap}>
            <AppText weight="bold" size={14}>
                {t('unlistedAtVisit', { count: codes.length })}
            </AppText>
            <AppText size={13} color={colors.muted}>
                {t('unlistedAtVisitHint')}
            </AppText>
            <Card style={styles.list}>
                {codes.map((code, index) => (
                    <View key={code} style={[styles.row, index > 0 && styles.rowLine]} testID={`unlisted-${code}`}>
                        <Icon name="help-circle-outline" size={22} color={colors.brandText} />
                        <AppText weight="bold" size={15} style={styles.grow} numberOfLines={1}>
                            {code}
                        </AppText>
                        <Pressable accessibilityRole="button" accessibilityLabel={t('remove')} onPress={() => onRemove(code)} hitSlop={8}>
                            <Icon name="close-circle" size={22} color={colors.subtle} />
                        </Pressable>
                    </View>
                ))}
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 6 },
    grow: { flex: 1, minWidth: 0 },
    list: { paddingVertical: 4, gap: 0 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    rowLine: { borderTopWidth: 1, borderTopColor: colors.divider },
});
