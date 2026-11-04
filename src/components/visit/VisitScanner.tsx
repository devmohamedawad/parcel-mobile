import { type BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import type { ScanOutcome } from '@/hooks/useVisitScan';
import { colors, radius } from '@/theme';

/** Our labels are Code 128; merchants' own labels may carry any common barcode or a QR code. */
const VISIT_BARCODES = { barcodeTypes: ['code128' as const, 'code39' as const, 'ean13' as const, 'ean8' as const, 'upc_a' as const, 'qr' as const, 'datamatrix' as const] };

/** The same code is read many times a second; it counts once within this window. */
const REPEAT_MS = 2500;

interface VisitScannerProps {
    onScan: (code: string) => ScanOutcome;
    onClose: () => void;
}

/** Camera kept open at the merchant: each label scanned is ticked, or kept as a parcel not in the system. */
export default function VisitScanner({ onScan, onClose }: VisitScannerProps) {
    const { t } = useAuth();
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const [last, setLast] = useState<ScanOutcome | null>(null);
    const [count, setCount] = useState(0);
    const seen = useRef<Record<string, number>>({});

    const read = ({ data }: BarcodeScanningResult) => {
        const now = Date.now();

        if (!data || (seen.current[data] ?? 0) > now - REPEAT_MS) {
            return;
        }

        seen.current[data] = now;
        const outcome = onScan(data);
        setLast(outcome);
        if (outcome.kind !== 'again') {
            setCount((current) => current + 1);
        }
        Haptics.notificationAsync(outcome.kind === 'ticked' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    };

    const message = last && { ticked: t('visitScanTicked', { code: last.code }), unlisted: t('visitScanUnlisted', { code: last.code }), again: t('visitScanAgain', { code: last.code }) }[last.kind];

    return (
        <Modal visible animationType="slide" onRequestClose={onClose} statusBarTranslucent>
            <View style={styles.screen}>
                {permission?.granted && <CameraView style={StyleSheet.absoluteFill} facing="back" barcodeScannerSettings={VISIT_BARCODES} onBarcodeScanned={read} />}
                <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
                    <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={onClose} hitSlop={8} style={styles.round}>
                        <Icon name="close" size={24} color="#FFFFFF" />
                    </Pressable>
                    <AppText weight="extrabold" size={18} color="#FFFFFF">
                        {t('visitScanTitle', { count })}
                    </AppText>
                    <View style={styles.round} />
                </View>
                {permission?.granted ? (
                    <View style={styles.middle} pointerEvents="none">
                        <View style={styles.frame} />
                        <AppText size={15} color="#FFFFFF" style={styles.hint}>
                            {t('visitScanHint')}
                        </AppText>
                    </View>
                ) : (
                    permission && (
                        <View style={styles.middle}>
                            <AppText size={15} color="#FFFFFF" style={styles.hint}>
                                {t('scanDenied')}
                            </AppText>
                            <Button label={t('allowCamera')} variant="onDark" size="md" onPress={requestPermission} />
                        </View>
                    )
                )}
                <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
                    {message && (
                        <View style={[styles.result, last?.kind === 'ticked' ? styles.ok : styles.warn]} accessibilityLiveRegion="polite">
                            <AppText weight="bold" size={15} color={colors.ink}>
                                {message}
                            </AppText>
                        </View>
                    )}
                    <Button label={t('visitScanDone')} variant="onDark" size="md" onPress={onClose} testID="visit-scan-done" />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.night },
    top: { position: 'absolute', top: 0, start: 0, end: 0, zIndex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
    round: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
    middle: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32 },
    frame: { width: '86%', aspectRatio: 2.4, borderRadius: radius.lg, borderWidth: 3, borderColor: '#FFFFFF' },
    hint: { textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 },
    bottom: { position: 'absolute', bottom: 0, start: 0, end: 0, paddingHorizontal: 20, gap: 12 },
    result: { borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12 },
    ok: { backgroundColor: '#DCFCE7' },
    warn: { backgroundColor: '#FEF3C7' },
});
