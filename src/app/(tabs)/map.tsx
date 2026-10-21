import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import RiderMap from '@/components/map/RiderMap';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { colors, radius, shadow } from '@/theme';

export default function MapScreen() {
    const { user, t } = useAuth();
    const insets = useSafeAreaInsets();
    const [follow, setFollow] = useState(true);
    const onShift = Boolean(user?.shift);

    return (
        <View style={styles.screen}>
            <RiderMap style={StyleSheet.absoluteFill} follow={follow} onFollowChange={setFollow} />

            <View style={[styles.top, { top: insets.top + 12 }]}>
                <View style={styles.title}>
                    <Icon name={onShift ? 'navigate' : 'navigate-outline'} size={20} color={colors.brandText} />
                    <View style={styles.titleText}>
                        <AppText weight="extrabold" size={15}>
                            {t('mapTitle')}
                        </AppText>
                        <AppText size={12} color={colors.muted}>
                            {onShift ? t('trackingOn') : t('mapOffShift')}
                        </AppText>
                    </View>
                </View>
            </View>

            {!follow && (
                <Pressable accessibilityRole="button" accessibilityLabel={t('myLocation')} onPress={() => setFollow(true)} style={styles.recenter}>
                    <Icon name="locate" size={24} color={colors.info} />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#EEEDE8' },
    top: { position: 'absolute', start: 16, end: 16 },
    title: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface, ...shadow.float },
    titleText: { flex: 1 },
    recenter: { position: 'absolute', bottom: 24, end: 16, width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.float },
});
