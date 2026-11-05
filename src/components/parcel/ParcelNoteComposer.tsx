import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import RoundButton from '@/components/ui/RoundButton';
import { api } from '@/lib/api';
import { alertWorkError } from '@/lib/workAlert';
import { colors, fonts } from '@/theme';

/** Longest note the server takes (ParcelNote::MAX_LENGTH). */
const MAX_LENGTH = 500;

/** A box to write a note for the branch on the parcel; it empties once the note is sent. */
export default function ParcelNoteComposer({ trackingNumber, onSent }: { trackingNumber: string; onSent: () => void }) {
    const { t } = useAuth();
    const [body, setBody] = useState('');
    const [busy, setBusy] = useState(false);
    const ready = body.trim() !== '' && !busy;

    const send = async () => {
        setBusy(true);
        try {
            await api(`parcels/${trackingNumber}/notes`, { method: 'POST', body: { body: body.trim() } });
            setBody('');
            onSent();
        } catch (exception) {
            alertWorkError(exception, t);
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={styles.row}>
            <TextInput
                value={body}
                onChangeText={setBody}
                placeholder={t('notePlaceholder')}
                placeholderTextColor={colors.subtle}
                accessibilityLabel={t('notesTitle')}
                maxLength={MAX_LENGTH}
                multiline
                style={styles.input}
                testID="parcel-note-input"
            />
            <RoundButton icon="send" label={t('sendNote')} onPress={() => ready && send()} background={ready ? colors.brandStrong : colors.neutralSoft} color={ready ? '#FFFFFF' : colors.subtle} testID="parcel-note-send" />
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
    input: { flex: 1, minHeight: 48, maxHeight: 120, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.field, paddingHorizontal: 12, paddingVertical: 10, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, textAlignVertical: 'top' },
});
