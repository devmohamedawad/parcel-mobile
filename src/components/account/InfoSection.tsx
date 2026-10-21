import { Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import Icon, { type IconName } from '@/components/ui/Icon';
import { colors, radius } from '@/theme';

export interface InfoRow {
    label: string;
    hint?: string;
    icon?: IconName;
    value: ReactNode;
}

/** A titled white list of label / value rows. */
export default function InfoSection({ title, rows }: { title: string; rows: InfoRow[] }) {
    return (
        <View style={styles.section}>
            <AppText weight="extrabold" size={13} color={colors.muted}>
                {title}
            </AppText>
            <View style={styles.list}>
                {rows.map((row, index) => (
                    <Fragment key={row.label}>
                        {index > 0 && <View style={styles.divider} />}
                        <View style={styles.row}>
                            {row.icon && <Icon name={row.icon} size={20} color={colors.body} />}
                            <View style={styles.label}>
                                <AppText size={15} color={colors.body}>
                                    {row.label}
                                </AppText>
                                {row.hint && (
                                    <AppText size={12} color={colors.muted}>
                                        {row.hint}
                                    </AppText>
                                )}
                            </View>
                            {typeof row.value === 'string' ? (
                                <AppText weight="extrabold" size={15}>
                                    {row.value}
                                </AppText>
                            ) : (
                                row.value
                            )}
                        </View>
                    </Fragment>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { gap: 8 },
    list: { backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 16 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 54, paddingVertical: 6 },
    label: { flex: 1 },
    divider: { height: 1, backgroundColor: colors.divider, borderRadius: radius.sm },
});
