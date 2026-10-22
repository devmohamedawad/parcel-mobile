import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { localized } from '@/lib/stops';
import type { WaitingParcel } from '@/lib/types';
import { colors } from '@/theme';

interface WaitingParcelsListProps {
    parcels: WaitingParcel[];
    selected: number[];
    onChange: (ids: number[]) => void;
}

/** The merchant's waiting parcels: tick the ones handed over; unticked ones stay waiting. */
export default function WaitingParcelsList({ parcels, selected, onChange }: WaitingParcelsListProps) {
    const { t, locale } = useAuth();
    const allTicked = selected.length === parcels.length;
    const toggle = (id: number) => onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);

    return (
        <View style={styles.wrap}>
            <View style={styles.head}>
                <AppText weight="bold" size={14} style={styles.grow}>
                    {t('parcelsHandedOver', { count: selected.length, total: parcels.length })}
                </AppText>
                <AppText weight="bold" size={14} color={colors.brandText} accessibilityRole="button" onPress={() => onChange(allTicked ? [] : parcels.map((parcel) => parcel.id))}>
                    {allTicked ? t('untickAll') : t('tickAll')}
                </AppText>
            </View>
            <Card style={styles.list}>
                {parcels.map((parcel, index) => {
                    const ticked = selected.includes(parcel.id);

                    return (
                        <Pressable
                            key={parcel.id}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: ticked }}
                            onPress={() => toggle(parcel.id)}
                            style={({ pressed }) => [styles.row, index > 0 && styles.rowLine, pressed && styles.pressed]}
                            testID={`waiting-${parcel.tracking_number}`}
                        >
                            <Icon name={ticked ? 'checkbox' : 'square-outline'} size={24} color={ticked ? colors.brand : colors.subtle} />
                            <View style={styles.grow}>
                                <AppText weight="bold" size={15} numberOfLines={1}>
                                    {parcel.recipient}
                                </AppText>
                                <AppText size={13} color={colors.muted} numberOfLines={1}>
                                    {[parcel.tracking_number, localized(parcel.area, locale)].filter(Boolean).join(' · ')}
                                </AppText>
                            </View>
                        </Pressable>
                    );
                })}
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 8 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    grow: { flex: 1, minWidth: 0 },
    list: { paddingVertical: 4, gap: 0 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    rowLine: { borderTopWidth: 1, borderTopColor: colors.divider },
    pressed: { opacity: 0.7 },
});
