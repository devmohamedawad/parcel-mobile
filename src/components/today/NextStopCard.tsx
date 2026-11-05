import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import ParcelTaskCard from '@/components/tasks/ParcelTaskCard';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { useHeadThere } from '@/hooks/useHeadThere';
import { callPhone } from '@/lib/links';
import { lngLat } from '@/lib/stops';
import type { ParcelCard } from '@/lib/types';
import { colors } from '@/theme';

/** The first delivery in route order, with call and head-there buttons. */
export default function NextStopCard({ parcel }: { parcel: ParcelCard }) {
    const { t } = useAuth();
    const position = lngLat(parcel);
    const headThere = useHeadThere(parcel, position);

    return (
        <View style={styles.wrap}>
            <View style={styles.head}>
                <AppText weight="extrabold" size={16}>
                    {t('nextStop')}
                </AppText>
                <AppText weight="bold" size={14} color={colors.brandText} onPress={() => router.navigate('/tasks')} accessibilityRole="link">
                    {t('allTasks')}
                </AppText>
            </View>
            <ParcelTaskCard parcel={parcel} next />
            <View style={styles.buttons}>
                {parcel.phone && (
                    <View style={styles.button}>
                        <Button label={t('call')} icon="call-outline" variant="secondary" size="md" onPress={() => callPhone(parcel.phone!)} />
                    </View>
                )}
                {position && (
                    <View style={styles.button}>
                        <Button label={headThere.label} icon="navigate" size="md" onPress={headThere.go} testID="next-stop-head-there" />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 10 },
    head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    buttons: { flexDirection: 'row', gap: 10 },
    button: { flex: 1 },
});
