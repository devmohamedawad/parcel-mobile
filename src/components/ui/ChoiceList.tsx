import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors, radius } from '@/theme';

interface ChoiceListProps {
    options: { value: string; label: string }[];
    value: string | null;
    onChange: (value: string) => void;
}

/** Big tappable radio rows. */
export default function ChoiceList({ options, value, onChange }: ChoiceListProps) {
    return (
        <View style={styles.list} accessibilityRole="radiogroup">
            {options.map((option) => {
                const selected = option.value === value;

                return (
                    <Pressable key={option.value} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => onChange(option.value)} style={[styles.row, selected && styles.selected]} testID={`choice-${option.value}`}>
                        <View style={[styles.dot, selected && styles.dotOn]}>{selected && <View style={styles.dotInner} />}</View>
                        <AppText weight={selected ? 'bold' : 'medium'} size={15} style={styles.label}>
                            {option.label}
                        </AppText>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    list: { gap: 8 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 54, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.surface },
    selected: { borderColor: colors.brand, backgroundColor: colors.brandTint },
    dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
    dotOn: { borderColor: colors.brand },
    dotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
    label: { flex: 1 },
});
