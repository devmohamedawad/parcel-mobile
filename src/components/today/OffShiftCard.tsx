import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { colors, radius } from '@/theme';

interface OffShiftCardProps {
    busy: boolean;
    needsPermission: boolean;
    onStart: () => void;
    onOpenSettings: () => void;
}

/** The big "Start shift" card shown while the rider is off shift. */
export default function OffShiftCard({ busy, needsPermission, onStart, onOpenSettings }: OffShiftCardProps) {
    const { t } = useAuth();

    return (
        <Card>
            <View style={styles.head}>
                <View style={styles.badge}>
                    <Icon name="power" size={28} color={colors.brandText} />
                </View>
                <View style={styles.titles}>
                    <AppText weight="extrabold" size={21}>
                        {t('offShift')}
                    </AppText>
                    <AppText size={14} color={colors.muted}>
                        {t('offShiftHint')}
                    </AppText>
                </View>
            </View>
            <AppText size={15} color={colors.inkSoft}>
                {t('offShiftBody')}
            </AppText>
            {needsPermission && (
                <View style={styles.notice}>
                    <AppText size={14} color={colors.brandDeep}>
                        {t('locationNeeded')}
                    </AppText>
                    <Button label={t('openSettings')} onPress={onOpenSettings} variant="outline" size="md" />
                </View>
            )}
            <Button label={t('startShift')} icon="play" onPress={onStart} busy={busy} haptic testID="shift-start" />
        </Card>
    );
}

const styles = StyleSheet.create({
    head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    badge: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
    titles: { flex: 1 },
    notice: { backgroundColor: colors.brandTint, borderRadius: radius.md, padding: 12, gap: 10 },
});
