/** Shapes returned by the Parcel rider app API (keep in sync with app/Http/Resources/Api/Rider/V1). */
export interface RiderShift {
    id: number;
    started_at: string;
    ended_at: string | null;
    distance_meters: number;
    points_count: number;
}

export interface RiderProfile {
    name: string;
    email: string;
    locale: 'ar' | 'en' | null;
    /** warehouse: where the branch warehouse is, for directions when the rider brings parcels back. */
    rider: { code: string; branch: string | null; warehouse: { latitude: number; longitude: number } | null };
    shift: RiderShift | null;
}

/** A name in each language, e.g. `{ ar: 'السالمية', en: 'Salmiya' }`. */
export type Translated = Record<string, string>;

export type ParcelAction = 'picked_up' | 'out_for_delivery' | 'to_hub' | 'delivered' | 'failed' | 'returned';

export interface PackageTypeSummary {
    code: string;
    name: Translated;
    is_fragile: boolean;
    requires_cold_chain: boolean;
}

export interface ParcelCard {
    tracking_number: string;
    status: string;
    package_type: PackageTypeSummary | null;
    merchant: string;
    kind: string;
    return_of: string | null;
    contact: string;
    phone: string | null;
    governorate: Translated | null;
    area: Translated | null;
    line: string;
    latitude: string | null;
    longitude: string | null;
    /** The place is the middle of the area, not the recipient's own location. */
    approximate?: boolean;
    cod_amount: string;
    currency: string;
    actions: ParcelAction[];
}

export interface PickupStop {
    id: number;
    merchant: string;
    contact: string;
    phone: string | null;
    governorate: Translated;
    area: Translated;
    line: string | null;
    notes: string | null;
    pickup_date: string;
    time_window: string;
    expected_parcels: number | null;
    merchant_notes: string | null;
    /** The merchant's parcels waiting at this pickup; ticked ones become picked up. */
    waiting_parcels: WaitingParcel[];
}

export interface WaitingParcel {
    id: number;
    tracking_number: string;
    recipient: string;
    area: Translated | null;
}

/** A parcel collected on a visit by its scanned code: a blank label or the merchant's own barcode. */
export interface UnlistedParcel {
    id: number;
    code: string;
    reserved: boolean;
    merchant: string;
    pickup_request_id: number;
    collected_at: string;
}

export interface TodayWork {
    pickup_stops: PickupStop[];
    pickups: ParcelCard[];
    in_hand: ParcelCard[];
    /** Collected without being in the system; carried until left at the warehouse. */
    unlisted: UnlistedParcel[];
    deliveries: ParcelCard[];
    returns: ParcelCard[];
    route_url: string | null;
    done_today: { delivered: number; failed: number };
    cash: { on_hand: string; limit: string | null; reached: boolean; currency: string };
    unread_notifications: number;
}

/** A notification the rider was sent (new parcel, merchant visit), kept so a missed push can be read later. */
export interface AppNotification {
    id: string;
    title: string;
    body: string;
    /** The server's web path it points to ("/rider/parcels/PK…" or "/rider"). */
    url: string | null;
    tracking_number: string | null;
    read: boolean;
    created_at: string;
}

export interface Stop {
    contact: string;
    phone: string | null;
    alt_phone: string | null;
    governorate: Translated | null;
    area: Translated | null;
    line: string;
    notes: string | null;
    latitude: string | null;
    longitude: string | null;
    /** The place is the middle of the area, not the recipient's own location. */
    approximate?: boolean;
}

export interface ParcelDetail {
    tracking_number: string;
    status: string;
    package_type: PackageTypeSummary | null;
    merchant: string;
    description: string | null;
    pieces: number;
    weight_grams: number | null;
    dimensions: string | null;
    kind: string;
    exchange_description: string | null;
    pickup: Stop;
    delivery: Stop;
    cod_amount: string;
    currency: string;
    delivery_attempts: number;
    proof: { code: boolean; can_resend_code: boolean; code_sent_at: string | null; photo: boolean };
    items: { name: string; quantity: number }[];
    actions: ParcelAction[];
    /** The step recorded as soon as the rider scans this label (collected, taken out of the warehouse), or null when the rider has to choose. */
    scan_action: ParcelAction | null;
    failure_reasons: { value: string; label: string }[];
}
