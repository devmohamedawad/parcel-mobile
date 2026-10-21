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
