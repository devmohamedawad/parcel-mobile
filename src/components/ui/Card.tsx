import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, shadow } from '@/theme';

interface CardProps extends PropsWithChildren {
    tone?: 'surface' | 'night';
    style?: ViewStyle;
}

/** Rounded white (or dark) panel used for every block on a screen. */
export default function Card({ tone = 'surface', style, children }: CardProps) {
    return <View style={[styles.base, tone === 'night' ? styles.night : styles.surface, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    base: { borderRadius: radius.lg, padding: 18, gap: 14 },
    surface: { backgroundColor: colors.surface, ...shadow.card },
    night: { backgroundColor: colors.night },
});
