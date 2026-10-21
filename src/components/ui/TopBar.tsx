import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { colors, shadow } from '@/theme';

interface TopBarProps {
    title: string;
    /** Float over a map instead of sitting on a white bar. */
    floating?: boolean;
    ltrTitle?: boolean;
}

/** Back button and title for pushed screens. */
export default function TopBar({ title, floating = false, ltrTitle = false }: TopBarProps) {
    const { t } = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.bar, { paddingTop: insets.top + 8 }, floating ? styles.floating : styles.solid]}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => router.back()} hitSlop={8} style={[styles.back, floating && shadow.float]}>
                <Icon name="arrow-back" size={22} directional />
            </Pressable>
            <View style={[styles.title, floating && styles.titleChip, floating && shadow.float]}>
                <AppText weight="extrabold" size={floating ? 14 : 18} numberOfLines={1} style={ltrTitle ? styles.ltr : undefined}>
                    {title}
                </AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 10 },
    solid: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: '#ECE8E3' },
    floating: { position: 'absolute', top: 0, start: 0, end: 0, zIndex: 2 },
    back: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
    title: { flexShrink: 1 },
    titleChip: { backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 12, height: 36, justifyContent: 'center' },
    ltr: { writingDirection: 'ltr' },
});
