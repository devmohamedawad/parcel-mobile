import { Text, type TextProps } from 'react-native';
import { colors, type FontWeight, fonts } from '@/theme';

interface AppTextProps extends TextProps {
    weight?: FontWeight;
    size?: number;
    color?: string;
}

/** Text in the Cairo font; the line height suits Arabic and Latin script. */
export default function AppText({ weight = 'regular', size = 15, color = colors.ink, style, ...props }: AppTextProps) {
    return <Text {...props} style={[{ fontFamily: fonts[weight], fontSize: size, lineHeight: Math.round(size * 1.5), color }, style]} />;
}
