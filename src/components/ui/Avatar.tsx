import { StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors } from '@/theme';

/** Up to two initials from a name. */
export function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]!.toUpperCase())
        .join('');
}

export default function Avatar({ name, size = 48 }: { name: string; size?: number }) {
    return (
        <View accessibilityElementsHidden importantForAccessibility="no" style={[styles.base, { width: size, height: size, borderRadius: size / 3 }]}>
            <AppText weight="extrabold" size={size * 0.36} color="#FFFFFF">
                {initials(name)}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    base: { backgroundColor: colors.night, alignItems: 'center', justifyContent: 'center' },
});
