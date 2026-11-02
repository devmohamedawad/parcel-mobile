import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { colors, radius } from '@/theme';

/** Opens the notifications screen, with the number the rider has not seen yet. */
export default function NotificationsButton({ unread }: { unread: number }) {
    const { t } = useAuth();

    return (
        <Pressable accessibilityRole="button" accessibilityLabel={t('notifications')} onPress={() => router.push('/notifications')} hitSlop={6} style={styles.button} testID="notifications-button">
            <Icon name="notifications-outline" size={22} color={colors.brandText} />
            {unread > 0 && (
                <View style={styles.badge} testID="notifications-unread">
                    <AppText weight="bold" size={11} color="#FFFFFF">
                        {unread > 99 ? '99+' : unread}
                    </AppText>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
    badge: { position: 'absolute', top: -4, end: -4, minWidth: 20, height: 20, paddingHorizontal: 4, borderRadius: 10, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
});
