import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { formatDateTime } from '@/lib/format';
import { openServerPath } from '@/lib/serverPaths';
import type { AppNotification } from '@/lib/types';
import { colors, radius, shadow } from '@/theme';

/** One notification: title, text and when it came; unread ones are highlighted, tapping opens what it is about. */
export default function NotificationRow({ notification }: { notification: AppNotification }) {
    const { locale } = useAuth();

    return (
        <Pressable accessibilityRole="button" onPress={() => openServerPath(notification.url)} style={[styles.row, !notification.read && styles.unread]} testID="notification-row">
            <View style={[styles.icon, notification.read && styles.iconRead]}>
                <Icon name="notifications" size={20} color={notification.read ? colors.muted : colors.brandText} />
            </View>
            <View style={styles.text}>
                <AppText weight="bold" size={15}>
                    {notification.title}
                </AppText>
                <AppText size={14} color={colors.body}>
                    {notification.body}
                </AppText>
                <AppText size={12} color={colors.muted}>
                    {formatDateTime(locale, notification.created_at)}
                </AppText>
            </View>
            {!notification.read && <View style={styles.dot} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: 'transparent', ...shadow.card },
    unread: { borderColor: colors.brandSoft },
    icon: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
    iconRead: { backgroundColor: colors.ground },
    text: { flex: 1, gap: 2 },
    dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6, backgroundColor: colors.brand },
});
