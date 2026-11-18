import type { Road, RoadStep } from '@/hooks/useRoadToStop';
import type { IconName } from '@/components/ui/Icon';
import type { StringKey } from '@/lib/i18n';

type Translate = (key: StringKey, replacements?: Record<string, string | number>) => string;

const EARTH_RADIUS_METRES = 6_371_000;

/** Metres between two [longitude, latitude] points along the earth's surface. */
export function metresBetween([fromLng, fromLat]: [number, number], [toLng, toLat]: [number, number]): number {
    const rad = (degrees: number) => (degrees * Math.PI) / 180;
    const a = Math.sin(rad(toLat - fromLat) / 2) ** 2 + Math.cos(rad(fromLat)) * Math.cos(rad(toLat)) * Math.sin(rad(toLng - fromLng) / 2) ** 2;

    return 2 * EARTH_RADIUS_METRES * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** The next turn to make and how far it is. The road is asked again from where the rider stands, so its
 * first step is the start and the second the turn coming up; between two answers the distance to it is
 * measured from the rider's latest position. */
export function upcomingTurn(road: Road | null, position: [number, number] | null): { step: RoadStep; metres: number } | null {
    if (!road || road.steps.length === 0) {
        return null;
    }

    const step = road.steps[1] ?? road.steps[0];
    const metres = position ? metresBetween(position, step.location) : road.steps[0].distance_m;

    return { step, metres };
}

const modifierKeys: Record<string, StringKey> = {
    left: 'turnLeft',
    right: 'turnRight',
    'slight left': 'turnSlightLeft',
    'slight right': 'turnSlightRight',
    'sharp left': 'turnSharpLeft',
    'sharp right': 'turnSharpRight',
    straight: 'goStraight',
    uturn: 'uTurn',
};

/** "Turn left onto Salem Al-Mubarak St", "At the roundabout, take exit 2", "You have arrived". */
export function turnText(step: RoadStep, t: Translate): string {
    if (step.type === 'arrive') {
        return t('arriveThere');
    }

    const action = ['roundabout', 'rotary'].includes(step.type) && step.exit ? t('roundaboutExit', { exit: step.exit }) : t(modifierKeys[step.modifier ?? 'straight'] ?? 'goStraight');

    return step.name ? `${action} ${t('onto', { name: step.name })}` : action;
}

/** The arrow drawn next to the turn; `directional` arrows are mirrored in Arabic, so these never are. */
export function turnIcon(step: RoadStep): IconName {
    if (step.type === 'arrive') {
        return 'flag';
    }
    if (['roundabout', 'rotary'].includes(step.type)) {
        return 'refresh';
    }
    if (step.modifier === 'uturn') {
        return 'return-down-back';
    }
    if (step.modifier?.includes('left')) {
        return 'arrow-back';
    }
    if (step.modifier?.includes('right')) {
        return 'arrow-forward';
    }

    return 'arrow-up';
}

/** "80 m" up close (in steps of 10), "1.4 km" further away. */
export function distanceText(metres: number, t: Translate): string {
    return metres < 1000 ? t('metres', { count: Math.max(10, Math.round(metres / 10) * 10) }) : t('kilometres', { count: (metres / 1000).toFixed(1) });
}

/** "12:05" or "1:02:30" for a number of seconds (sign ignored). */
export function clockText(seconds: number): string {
    const total = Math.abs(Math.round(seconds));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const rest = String(total % 60).padStart(2, '0');

    return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`;
}
