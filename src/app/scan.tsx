import { type BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { recordScan } from '@/lib/scanParcel';
import { normaliseTracking } from '@/lib/tracking';
import { colors, radius } from '@/theme';

/** Parcel labels carry the tracking number as a Code 128 barcode. */
const LABEL_BARCODES = { barcodeTypes: ['code128' as const] };

/** Full-screen camera that reads a parcel label, records the step the scan stands for (see recordScan) and opens that parcel. */
export default function ScanScreen() {
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const [torch, setTorch] = useState(false);
    const [recording, setRecording] = useState(false);
    // The camera reports the same code many times a second; only the first one opens the parcel.
    const handled = useRef(false);

    const scanned = ({ data }: BarcodeScanningResult) => {
        const tracking = normaliseTracking(data);

        if (handled.current || tracking === '') {
            return;
        }

        handled.current = true;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        setRecording(true);
        recordScan(tracking)
            .catch((error: unknown) => {
                Alert.alert(error instanceof Error ? error.message : String(error));
                return null;
            })
            .then((action) => router.replace({ pathname: '/parcel/[tracking]', params: action ? { tracking, scanned: action } : { tracking } }));
    };

    return (
        <View style={styles.screen}>
            {permission?.granted && <CameraView style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} barcodeScannerSettings={LABEL_BARCODES} onBarcodeScanned={scanned} />}
            {recording && <ActivityIndicator size="large" color="#FFFFFF" style={styles.recording} />}

            <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
                <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => router.back()} hitSlop={8} style={styles.round}>
                    <Icon name="close" size={24} color="#FFFFFF" />
                </Pressable>
                <AppText weight="extrabold" size={18} color="#FFFFFF">
                    {t('scanTitle')}
                </AppText>
                {permission?.granted ? (
                    <Pressable accessibilityRole="button" accessibilityLabel={torch ? t('torchOff') : t('torchOn')} onPress={() => setTorch((on) => !on)} hitSlop={8} style={[styles.round, torch && styles.torchOn]}>
                        <Icon name={torch ? 'flashlight' : 'flashlight-outline'} size={22} color={torch ? colors.ink : '#FFFFFF'} />
                    </Pressable>
                ) : (
                    <View style={styles.round} />
                )}
            </View>

            {permission?.granted ? (
                <View style={styles.middle} pointerEvents="none">
                    <View style={styles.frame} />
                    <AppText size={15} color="#FFFFFF" style={styles.hint}>
                        {t('scanHint')}
                    </AppText>
                </View>
            ) : (
                permission && (
                    <View style={styles.middle}>
                        <Icon name="camera-outline" size={44} color="#FFFFFF" />
                        <AppText size={15} color="#FFFFFF" style={styles.hint}>
                            {t('scanDenied')}
                        </AppText>
                        <Button label={t('allowCamera')} variant="onDark" size="md" onPress={requestPermission} testID="scan-allow" />
                    </View>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.night },
    recording: { position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, zIndex: 2 },
    top: { position: 'absolute', top: 0, start: 0, end: 0, zIndex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
    round: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
    torchOn: { backgroundColor: '#FFFFFF' },
    middle: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32 },
    // A wide, short window: the label barcode is a long strip.
    frame: { width: '86%', aspectRatio: 2.4, borderRadius: radius.lg, borderWidth: 3, borderColor: '#FFFFFF' },
    hint: { textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 },
});
