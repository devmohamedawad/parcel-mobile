import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import { formatDateTime } from '@/lib/format';
import type { ParcelNote } from '@/lib/types';
import { colors } from '@/theme';

/** One note: the branch's on one side, the rider's own on the other. */
export default function ParcelNoteBubble({ note }: { note: ParcelNote }) {
    const { t, locale } = useAuth();
    const who = note.by_rider ? t('noteFromYou') : [note.author, t('noteFromBranch')].filter(Boolean).join(' · ');

    return (
        <View style={[styles.bubble, note.by_rider ? styles.mine : styles.theirs]} testID="parcel-note">
            <AppText size={12} color={colors.muted}>
                {who} · {formatDateTime(locale, note.created_at)}
            </AppText>
            <AppText size={15}>{note.body}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: { borderRadius: 14, padding: 12, gap: 2, maxWidth: '92%' },
    mine: { alignSelf: 'flex-end', backgroundColor: colors.brandTint },
    theirs: { alignSelf: 'flex-start', backgroundColor: colors.field },
});
