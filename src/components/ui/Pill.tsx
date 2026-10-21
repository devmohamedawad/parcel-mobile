import { StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors, radius } from '@/theme';

type Tone = 'neutral' | 'success' | 'brand';

const tones: Record<Tone, { background: string; text: string; dot: string }> = {
    neutral: { background: colors.neutralSoft, text: colors.body, dot: colors.subtle },
    success: { background: colors.successSoft, text: colors.successText, dot: colors.successDot },
    brand: { background: colors.brandSoft, text: colors.brandDeep, dot: colors.brand },
};

interface PillProps {
    label: string;
    tone?: Tone;
    dot?: boolean;
}

/** Small status label, optionally with a coloured dot. */
export default function Pill({ label, tone = 'neutral', dot = false }: PillProps) {
    const look = tones[tone];

    return (
        <View style={[styles.base, { backgroundColor: look.background }]}>
            {dot && <View style={[styles.dot, { backgroundColor: look.dot }]} />}
            <AppText weight="bold" size={13} color={look.text}>
                {label}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    base: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, paddingHorizontal: 12, borderRadius: radius.pill },
    dot: { width: 8, height: 8, borderRadius: 4 },
});
