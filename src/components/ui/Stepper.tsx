import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { colors, radius } from '@/theme';

interface StepperProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    max: number;
    /** Lowest value allowed (default 0). */
    min?: number;
}

/** A number picked with big minus / plus buttons. */
export default function Stepper({ label, value, onChange, max, min = 0 }: StepperProps) {
    const button = (icon: 'remove' | 'add', next: number, disabled: boolean) => (
        <Pressable accessibilityRole="button" accessibilityLabel={`${label} ${icon === 'add' ? '+' : '−'}`} disabled={disabled} onPress={() => onChange(next)} style={[styles.button, disabled && styles.disabled]}>
            <Icon name={icon} size={26} color={colors.brandText} />
        </Pressable>
    );

    return (
        <View style={styles.wrap}>
            <AppText weight="bold" size={14}>
                {label}
            </AppText>
            <View style={styles.row} accessibilityRole="adjustable" accessibilityValue={{ now: value, min, max }}>
                {button('remove', value - 1, value <= min)}
                <AppText weight="extrabold" size={32} style={styles.value} testID="stepper-value">
                    {value}
                </AppText>
                {button('add', value + 1, value >= max)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 8 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 10 },
    button: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
    disabled: { opacity: 0.4 },
    value: { minWidth: 80, textAlign: 'center', lineHeight: 44 },
});
