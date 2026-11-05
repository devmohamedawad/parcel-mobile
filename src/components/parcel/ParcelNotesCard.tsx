import { useAuth } from '@/auth/AuthContext';
import ParcelNoteBubble from '@/components/parcel/ParcelNoteBubble';
import ParcelNoteComposer from '@/components/parcel/ParcelNoteComposer';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import type { ParcelDetail } from '@/lib/types';
import { colors } from '@/theme';

/** Notes between the branch and the rider on this parcel, with a box to answer. */
export default function ParcelNotesCard({ parcel, onSent }: { parcel: ParcelDetail; onSent: () => void }) {
    const { t } = useAuth();
    const notes = parcel.notes ?? [];

    return (
        <Card>
            <AppText weight="extrabold" size={16}>
                {t('notesTitle')}
            </AppText>
            {notes.length === 0 ? (
                <AppText size={13} color={colors.muted}>
                    {t('notesEmpty')}
                </AppText>
            ) : (
                notes.map((note) => <ParcelNoteBubble key={note.id} note={note} />)
            )}
            <ParcelNoteComposer trackingNumber={parcel.tracking_number} onSent={onSent} />
        </Card>
    );
}
