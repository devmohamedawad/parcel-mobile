import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import Icon, { type IconName } from '@/components/ui/Icon';
import { callPhone, openWhatsApp } from '@/lib/links';
import { placeText } from '@/lib/stops';
import type { Stop } from '@/lib/types';
import { colors } from '@/theme';

function RoundButton({ icon, label, onPress, background, color }: { icon: IconName; label: string; onPress: () => void; background: string; color: string }) {
    return (
        <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.round, { backgroundColor: background }, pressed && { opacity: 0.75 }]}>
            <Icon name={icon} size={22} color={color} />
        </Pressable>
    );
}

/** Who to meet at the stop, how to reach them and where. */
export default function ContactCard({ title, stop }: { title: string; stop: Stop }) {
    const { t, locale } = useAuth();

    return (
        <Card>
            <View style={styles.row}>
                <View style={styles.names}>
                    <AppText size={13} color={colors.muted}>
                        {title}
                    </AppText>
                    <AppText weight="extrabold" size={19}>
                        {stop.contact}
                    </AppText>
                    {stop.phone && (
                        <AppText size={14} color={colors.body} style={styles.ltr}>
                            {stop.phone}
                        </AppText>
                    )}
                </View>
                {stop.phone && <RoundButton icon="logo-whatsapp" label={t('whatsapp')} onPress={() => openWhatsApp(stop.phone!)} background={colors.successSoft} color={colors.successText} />}
                {stop.phone && <RoundButton icon="call" label={t('call')} onPress={() => callPhone(stop.phone!)} background={colors.brandSoft} color={colors.brandText} />}
            </View>
            <View style={styles.divider} />
            <View style={styles.place}>
                <Icon name="location-outline" size={20} color={colors.muted} />
                <AppText weight="bold" size={15} style={styles.grow}>
                    {placeText(stop, locale)}
                </AppText>
            </View>
            {stop.notes && (
                <View style={styles.note}>
                    <Icon name="chatbox-ellipses-outline" size={18} color={colors.brandDeep} />
                    <AppText size={14} color="#7C2D12" style={styles.grow}>
                        {stop.notes}
                    </AppText>
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    names: { flex: 1, minWidth: 0 },
    ltr: { writingDirection: 'ltr', alignSelf: 'flex-start' },
    round: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    divider: { height: 1, backgroundColor: colors.divider },
    place: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
    grow: { flex: 1 },
    note: { flexDirection: 'row', gap: 8, backgroundColor: colors.brandTint, borderRadius: 12, padding: 10 },
});
