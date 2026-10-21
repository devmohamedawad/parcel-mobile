import { StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors } from '@/theme';

type Tone = 'next' | 'open' | 'done';

/** Round map marker for a stop, numbered in route order. */
export default function StopPin({ label, tone = 'open' }: { label?: string; tone?: Tone }) {
    const next = tone === 'next';

    return (
        <View style={[styles.pin, next ? styles.next : tone === 'done' ? styles.done : styles.open]}>
            {label !== undefined && (
                <AppText weight="extrabold" size={next ? 15 : 13} color={tone === 'open' ? colors.brandDeep : '#FFFFFF'} style={styles.label}>
                    {label}
                </AppText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pin: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderRadius: 999 },
    next: { width: 36, height: 36, backgroundColor: colors.brandStrong, borderColor: '#FFFFFF' },
    open: { width: 28, height: 28, backgroundColor: '#FFFFFF', borderColor: colors.brandStrong },
    done: { width: 28, height: 28, backgroundColor: colors.success, borderColor: '#FFFFFF' },
    label: { lineHeight: 18 },
});
