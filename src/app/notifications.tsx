import { useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import NotificationRow from '@/components/notifications/NotificationRow';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import TopBar from '@/components/ui/TopBar';
import { useRemote } from '@/hooks/useRemote';
import { api } from '@/lib/api';
import type { AppNotification } from '@/lib/types';
import { colors } from '@/theme';

/** Everything the rider was notified about, newest first, so a missed push can be read later. */
export default function Notifications() {
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const { data, refreshing, refresh } = useRemote<AppNotification[]>('notifications');
    const hasUnread = data?.some((notification) => !notification.read) ?? false;

    // Seen once listed: the next visit and the Today badge show them as read.
    useEffect(() => {
        if (hasUnread) {
            api('notifications/read', { method: 'POST' }).catch(() => undefined);
        }
    }, [hasUnread]);

    return (
        <View style={styles.screen}>
            <TopBar title={t('notifications')} />
            <FlatList
                data={data ?? []}
                keyExtractor={(notification) => notification.id}
                renderItem={({ item }) => <NotificationRow notification={item} />}
                contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.brand]} />}
                ListEmptyComponent={
                    data ? (
                        <View style={styles.empty} testID="notifications-empty">
                            <View style={styles.emptyIcon}>
                                <Icon name="notifications-off-outline" size={36} color={colors.brandText} />
                            </View>
                            <AppText weight="extrabold" size={18} style={styles.center}>
                                {t('notificationsEmptyTitle')}
                            </AppText>
                            <AppText size={14} color={colors.muted} style={styles.center}>
                                {t('notificationsEmptyBody')}
                            </AppText>
                        </View>
                    ) : undefined
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    body: { padding: 20, gap: 12 },
    empty: { alignItems: 'center', justifyContent: 'center', gap: 6, padding: 32, minHeight: 360 },
    emptyIcon: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    center: { textAlign: 'center' },
});
