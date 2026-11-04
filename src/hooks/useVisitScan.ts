import { useState } from 'react';
import { normaliseTracking } from '@/lib/tracking';
import type { WaitingParcel } from '@/lib/types';

export type ScanOutcome = { kind: 'ticked'; code: string } | { kind: 'unlisted'; code: string } | { kind: 'again'; code: string };

/**
 * What the rider recorded at a merchant visit: waiting parcels ticked (by a scan or by hand) and codes
 * scanned for parcels not in the system (a blank label or the merchant's own barcode).
 */
export function useVisitScan(waiting: WaitingParcel[]) {
    const [ticked, setTicked] = useState<number[] | null>(null);
    const [scanned, setScanned] = useState<number[]>([]);
    const [unlisted, setUnlisted] = useState<string[]>([]);
    // Every waiting parcel starts ticked, as before scanning existed; a scan confirms it.
    const selected = ticked ?? waiting.map((parcel) => parcel.id);

    const tick = (ids: number[]) => {
        setTicked(ids);
        setScanned((current) => current.filter((id) => ids.includes(id)));
    };

    const scan = (raw: string): ScanOutcome => {
        const code = normaliseTracking(raw);
        const parcel = waiting.find((candidate) => candidate.tracking_number === code);

        if (parcel) {
            if (scanned.includes(parcel.id)) {
                return { kind: 'again', code };
            }
            setTicked((current) => [...new Set([...(current ?? waiting.map((item) => item.id)), parcel.id])]);
            setScanned((current) => [...current, parcel.id]);

            return { kind: 'ticked', code };
        }

        if (unlisted.includes(code)) {
            return { kind: 'again', code };
        }
        setUnlisted((current) => [...current, code]);

        return { kind: 'unlisted', code };
    };

    const removeUnlisted = (code: string) => setUnlisted((current) => current.filter((item) => item !== code));

    return { selected, scanned: scanned.filter((id) => selected.includes(id)), unlisted, tick, scan, removeUnlisted };
}
