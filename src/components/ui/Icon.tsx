import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { I18nManager } from 'react-native';
import { colors } from '@/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    /** Mirror the icon in right-to-left layouts (arrows, chevrons). */
    directional?: boolean;
}

export default function Icon({ name, size = 22, color = colors.ink, directional = false }: IconProps) {
    const mirrored = directional && I18nManager.isRTL;

    return <Ionicons name={name} size={size} color={color} style={mirrored ? { transform: [{ scaleX: -1 }] } : undefined} />;
}
