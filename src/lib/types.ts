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
    rider: { code: string; branch: string | null };
    shift: RiderShift | null;
}

/** A name in each language, e.g. `{ ar: 'السالمية', en: 'Salmiya' }`. */
export type Translated = Record<string, string>;

export type ParcelAction = 'picked_up' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';

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

export interface TodayWork {
    pickup_stops: PickupStop[];
    pickups: ParcelCard[];
    in_hand: ParcelCard[];
    deliveries: ParcelCard[];
    returns: ParcelCard[];
    route_url: string | null;
    done_today: { delivered: number; failed: number };
    cash: { on_hand: string; limit: string | null; reached: boolean; currency: string };
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
    failure_reasons: { value: string; label: string }[];
}
