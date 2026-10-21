import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import RiderMap from '@/components/map/RiderMap';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { colors, radius, shadow } from '@/theme';

/** Small live map on Today; tapping it opens the Map tab. */
export default function MapPreviewCard() {
    const { t } = useAuth();

    return (
        <Pressable accessibilityRole="button" accessibilityLabel={t('openMap')} onPress={() => router.navigate('/map')} style={styles.card}>
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <RiderMap style={StyleSheet.absoluteFill} follow still />
            </View>
            <View style={styles.chip}>
                <Icon name="map-outline" size={16} color={colors.brandText} />
                <AppText weight="extrabold" size={13}>
                    {t('openMap')}
                </AppText>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { height: 150, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#EEEDE8' },
    chip: { position: 'absolute', bottom: 10, end: 10, flexDirection: 'row', alignItems: 'center', gap: 6, height: 34, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.surface, ...shadow.float },
});
