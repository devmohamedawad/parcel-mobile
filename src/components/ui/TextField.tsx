import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import AppText from '@/components/ui/AppText';
import Icon, { type IconName } from '@/components/ui/Icon';
import { colors, fonts, radius } from '@/theme';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
    label: string;
    icon: IconName;
    /** Password field with a show / hide button. */
    secret?: boolean;
    showLabel?: string;
    hideLabel?: string;
    /** Left-to-right content (emails, numbers) inside a right-to-left screen. */
    ltr?: boolean;
}

/** Labelled input with a leading icon and a focus ring. */
export default function TextField({ label, icon, secret = false, showLabel, hideLabel, ltr = false, ...input }: TextFieldProps) {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(secret);

    return (
        <View style={styles.wrap}>
            <AppText weight="bold" size={14}>
                {label}
            </AppText>
            <View style={[styles.box, focused && styles.focused]}>
                <Icon name={icon} size={21} color={colors.subtle} />
                <TextInput
                    {...input}
                    accessibilityLabel={label}
                    secureTextEntry={hidden}
                    placeholderTextColor={colors.subtle}
                    onFocus={(event) => {
                        setFocused(true);
                        input.onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setFocused(false);
                        input.onBlur?.(event);
                    }}
                    style={[styles.input, ltr && styles.ltr]}
                />
                {secret && (
                    <Pressable accessibilityRole="button" accessibilityLabel={hidden ? showLabel : hideLabel} onPress={() => setHidden(!hidden)} hitSlop={8} style={styles.eye}>
                        <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={21} color={colors.muted} />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 8 },
    box: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 56, paddingHorizontal: 16, borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.field },
    focused: { borderColor: colors.brand, backgroundColor: colors.surface, shadowColor: colors.brand, shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
    input: { flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.ink, paddingVertical: 0 },
    ltr: { writingDirection: 'ltr' },
    eye: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginEnd: -10 },
});
