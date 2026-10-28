import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Icon from '@/components/ui/Icon';
import { normaliseTracking } from '@/lib/tracking';
import { colors, fonts, radius, shadow } from '@/theme';

/**
 * Opens one of the rider's parcels by the tracking number on its label, typed or scanned
 * (e.g. a failed parcel still in the bag); numbers that are not the rider's show "not found".
 */
export default function ParcelFinder() {
    const { t } = useAuth();
    const [value, setValue] = useState('');

    const open = () => {
        const tracking = normaliseTracking(value);

        if (tracking !== '') {
            setValue('');
            router.push({ pathname: '/parcel/[tracking]', params: { tracking } });
        }
    };

    return (
        <View style={styles.bar} testID="parcel-finder">
            <Icon name="search" size={20} color={colors.subtle} />
            <TextInput
                value={value}
                onChangeText={setValue}
                onSubmitEditing={open}
                placeholder={t('findPlaceholder')}
                placeholderTextColor={colors.subtle}
                accessibilityLabel={t('findLabel')}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={32}
                returnKeyType="go"
                style={styles.input}
                testID="find-input"
            />
            {value.trim() !== '' && (
                <Pressable accessibilityRole="button" onPress={open} hitSlop={6} style={styles.open} testID="find-open">
                    <AppText weight="bold" size={14} color="#FFFFFF">
                        {t('findOpen')}
                    </AppText>
                </Pressable>
            )}
            <Pressable accessibilityRole="button" accessibilityLabel={t('scanLabel')} onPress={() => router.push('/scan')} hitSlop={6} style={styles.scan} testID="find-scan">
                <Icon name="barcode-outline" size={22} color={colors.brandText} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, paddingStart: 14, padding: 6, marginBottom: 6, ...shadow.card },
    // Tracking numbers read left to right even on an Arabic screen.
    input: { flex: 1, minHeight: 44, fontFamily: fonts.semibold, fontSize: 16, color: colors.ink, writingDirection: 'ltr', textAlign: 'left' },
    open: { minHeight: 44, paddingHorizontal: 14, borderRadius: radius.sm, backgroundColor: colors.brandStrong, alignItems: 'center', justifyContent: 'center' },
    scan: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
});
