import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { BRAND_COLOR } from '@/config';

interface ButtonProps {
    label: string;
    onPress: () => void;
    busy?: boolean;
    variant?: 'primary' | 'outline';
}

/** Large, thumb-friendly button in the brand colour. */
export default function Button({ label, onPress, busy = false, variant = 'primary' }: ButtonProps) {
    const primary = variant === 'primary';

    return (
        <Pressable onPress={onPress} disabled={busy} style={({ pressed }) => [styles.base, primary ? styles.primary : styles.outline, (pressed || busy) && styles.pressed]}>
            {busy ? <ActivityIndicator color={primary ? '#fff' : BRAND_COLOR} /> : <Text style={[styles.label, !primary && styles.outlineLabel]}>{label}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    primary: { backgroundColor: BRAND_COLOR },
    outline: { borderWidth: 1.5, borderColor: BRAND_COLOR, backgroundColor: '#fff' },
    pressed: { opacity: 0.75 },
    label: { color: '#fff', fontSize: 17, fontWeight: '700' },
    outlineLabel: { color: BRAND_COLOR },
});
