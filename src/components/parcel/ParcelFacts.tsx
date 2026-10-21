import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { localized } from '@/lib/stops';
import type { ParcelDetail } from '@/lib/types';
import { colors } from '@/theme';

/** Cash to collect, merchant, package, proof needed and items. */
export default function ParcelFacts({ parcel }: { parcel: ParcelDetail }) {
    const { t, locale } = useAuth();
    const collectsCash = Number(parcel.cod_amount) > 0;
    const proof = [parcel.proof.code ? t('proofCode') : null, parcel.proof.photo ? t('proofPhoto') : null].filter(Boolean).join(' + ') || t('proofNone');
    const packageText = [localized(parcel.package_type?.name, locale), parcel.weight_grams ? t('weight', { kg: (parcel.weight_grams / 1000).toFixed(1) }) : null, parcel.pieces > 1 ? t('pieces', { count: parcel.pieces }) : null].filter(Boolean).join(' · ');
    const rows = [
        { label: t('merchantLabel'), value: parcel.merchant },
        { label: t('packageLabel'), value: packageText || '—' },
        { label: t('proofNeeded'), value: proof },
        ...(parcel.items.length > 0 ? [{ label: t('itemsLabel'), value: parcel.items.map((item) => `${item.quantity}× ${item.name}`).join('، ') }] : []),
    ];

    return (
        <>
            {collectsCash && (
                <Card style={styles.cash}>
                    <View style={styles.cashIcon}>
                        <Icon name="cash-outline" size={24} color={colors.brandText} />
                    </View>
                    <View style={styles.grow}>
                        <AppText size={13} color={colors.muted}>
                            {t('collectCash')}
                        </AppText>
                        <AppText weight="extrabold" size={24}>
                            {t('money', { amount: parcel.cod_amount, currency: parcel.currency })}
                        </AppText>
                    </View>
                </Card>
            )}
            {parcel.exchange_description && (
                <Card style={styles.exchange}>
                    <Icon name="swap-horizontal" size={20} color={colors.info} />
                    <AppText weight="bold" size={14} style={styles.grow}>
                        {t('exchangeCollect', { item: parcel.exchange_description })}
                    </AppText>
                </Card>
            )}
            <Card style={styles.facts}>
                {rows.map((row, index) => (
                    <View key={row.label} style={[styles.row, index > 0 && styles.rowLine]}>
                        <AppText size={14} color={colors.muted}>
                            {row.label}
                        </AppText>
                        <AppText weight="bold" size={14} style={styles.value}>
                            {row.value}
                        </AppText>
                    </View>
                ))}
            </Card>
        </>
    );
}

const styles = StyleSheet.create({
    cash: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    cashIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.brandTint, alignItems: 'center', justifyContent: 'center' },
    exchange: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    grow: { flex: 1 },
    facts: { paddingVertical: 6, gap: 0 },
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 10 },
    rowLine: { borderTopWidth: 1, borderTopColor: colors.divider },
    value: { flexShrink: 1 },
});
