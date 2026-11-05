import { Pressable, StyleSheet } from 'react-native';
import Icon, { type IconName } from '@/components/ui/Icon';

interface RoundButtonProps {
    icon: IconName;
    /** Read out by screen readers, since the button shows only its icon. */
    label: string;
    onPress: () => void;
    background: string;
    color: string;
    size?: number;
    testID?: string;
}

/** A square icon-only button, for quick actions such as call or navigate where a label does not fit. */
export default function RoundButton({ icon, label, onPress, background, color, size = 48, testID }: RoundButtonProps) {
    return (
        <Pressable
            testID={testID}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={onPress}
            hitSlop={4}
            style={({ pressed }) => [styles.round, { width: size, height: size, backgroundColor: background }, pressed && styles.pressed]}
        >
            <Icon name={icon} size={22} color={color} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    round: { borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    pressed: { opacity: 0.75 },
});
