import { StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors } from '@/theme';

type Tone = 'brand' | 'neutral' | 'info' | 'success' | 'danger';

const tones: Record<Tone, { background: string; text: string }> = {
    brand: { background: colors.brandSoft, text: colors.brandDeep },
    neutral: { background: '#F0EDEA', text: colors.body },
    info: { background: '#E8EEFD', text: '#1E40AF' },
    success: { background: colors.successSoft, text: colors.successText },
    danger: { background: '#FDECEC', text: colors.danger },
};

/** Small square label on cards (Next, Fragile, Paid...). */
export default function Tag({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
    return (
        <View style={[styles.base, { backgroundColor: tones[tone].background }]}>
            <AppText weight="extrabold" size={12} color={tones[tone].text}>
                {label}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    base: { height: 24, paddingHorizontal: 8, borderRadius: 7, justifyContent: 'center' },
});
