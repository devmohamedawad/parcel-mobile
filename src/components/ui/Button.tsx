import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import Icon, { type IconName } from '@/components/ui/Icon';
import { colors, radius, shadow } from '@/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'onDark';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: Variant;
    icon?: IconName;
    busy?: boolean;
    disabled?: boolean;
    size?: 'lg' | 'md' | 'sm';
    /** A short vibration on press, for the main actions of a screen. */
    haptic?: boolean;
    testID?: string;
}

const looks: Record<Variant, { background: string; text: string; border?: string; raised?: boolean }> = {
    primary: { background: colors.brandStrong, text: '#FFFFFF', raised: true },
    secondary: { background: colors.surface, text: colors.ink },
    outline: { background: colors.surface, text: colors.brandText, border: colors.brand },
    danger: { background: colors.surface, text: colors.danger, border: colors.dangerLine },
    onDark: { background: 'transparent', text: '#FFFFFF', border: colors.nightBorder },
};

const heights = { lg: 60, md: 52, sm: 40 };

/** Thumb-friendly button in the BabJet style. */
export default function Button({ label, onPress, variant = 'primary', icon, busy = false, disabled = false, size = 'lg', haptic = false, testID }: ButtonProps) {
    const look = looks[variant];
    const textSize = size === 'lg' ? 18 : size === 'md' ? 16 : 14;

    const press = () => {
        if (haptic) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
        }
        onPress();
    };

    return (
        <Pressable
            testID={testID}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || busy, busy }}
            onPress={press}
            disabled={disabled || busy}
            style={({ pressed }) => [
                styles.base,
                { height: heights[size], backgroundColor: look.background, borderRadius: size === 'sm' ? radius.sm : 18 },
                look.border ? { borderWidth: 1.5, borderColor: look.border } : null,
                look.raised ? shadow.brand : null,
                (pressed || busy || disabled) && styles.dimmed,
            ]}
        >
            {busy ? (
                <ActivityIndicator color={look.text} />
            ) : (
                <View style={styles.content}>
                    {icon && <Icon name={icon} size={textSize + 3} color={look.text} />}
                    <AppText weight="extrabold" size={textSize} color={look.text}>
                        {label}
                    </AppText>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
    content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dimmed: { opacity: 0.7 },
});
