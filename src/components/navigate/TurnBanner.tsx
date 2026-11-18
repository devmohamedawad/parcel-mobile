import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import type { Road } from '@/hooks/useRoadToStop';
import { distanceText, turnIcon, turnText, upcomingTurn } from '@/lib/navigation';
import { colors, radius, shadow } from '@/theme';

/** The next turn in big type at the top of the navigation screen, with the distance to it. */
export default function TurnBanner({ road, position }: { road: Road | null; position: [number, number] | null }) {
    const { t } = useAuth();
    const turn = upcomingTurn(road, position);

    return (
        <View style={styles.banner} testID="turn-banner">
            {turn ? (
                <>
                    <View style={styles.arrow}>
                        <Icon name={turnIcon(turn.step)} size={34} color="#FFFFFF" />
                    </View>
                    <View style={styles.text}>
                        <AppText weight="extrabold" size={26} color="#FFFFFF" style={styles.distance}>
                            {distanceText(turn.metres, t)}
                        </AppText>
                        <AppText weight="bold" size={16} color="#FFFFFF" numberOfLines={2}>
                            {turnText(turn.step, t)}
                        </AppText>
                    </View>
                </>
            ) : (
                <AppText weight="bold" size={16} color="#FFFFFF">
                    {road && !road.by_road ? t('straightOnly') : t('findingRoad')}
                </AppText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    banner: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 84, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.lg, backgroundColor: '#14532D', ...shadow.float },
    arrow: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
    text: { flex: 1 },
    distance: { writingDirection: 'ltr', textAlign: 'left', lineHeight: 32 },
});
