import { File, Paths } from 'expo-file-system';
import { type Ref, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAuth } from '@/auth/AuthContext';
import type { Signature } from '@/components/delivery/SignatureCanvas';
import SignatureDialog from '@/components/delivery/SignatureDialog';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import type { UploadFile } from '@/hooks/useParcelUpdate';
import { colors, radius } from '@/theme';

export interface SignatureFieldHandle {
    /** The signature as a PNG file, or null when there is none. */
    toFile: () => Promise<UploadFile | null>;
}

const PREVIEW_HEIGHT = 140;

/** The recipient's signature: a preview that cannot be drawn on, and a button that opens the signing window. */
export default function SignatureField({ ref, label }: { ref?: Ref<SignatureFieldHandle>; label: string }) {
    const { t } = useAuth();
    const [signature, setSignature] = useState<Signature | null>(null);
    const [signing, setSigning] = useState(false);
    const preview = useRef<Svg>(null);

    useImperativeHandle(ref, () => ({
        toFile: () =>
            new Promise((resolve) => {
                if (!signature || !preview.current) {
                    resolve(null);
                    return;
                }
                preview.current.toDataURL((base64) => {
                    const file = new File(Paths.cache, `signature-${Date.now()}.png`);
                    file.write(base64, { encoding: 'base64' });
                    resolve({ uri: file.uri, name: 'signature.png', type: 'image/png' });
                });
            }),
    }));

    return (
        <View style={styles.wrap}>
            <AppText weight="bold" size={14}>
                {label}
            </AppText>
            {signature && (
                <View style={styles.preview} pointerEvents="none" testID="signature-preview">
                    <Svg ref={preview} width="100%" height={PREVIEW_HEIGHT} viewBox={`0 0 ${signature.width} ${signature.height}`} preserveAspectRatio="xMidYMid meet">
                        <Rect x={0} y={0} width={signature.width} height={signature.height} fill="#FFFFFF" />
                        {signature.paths.map((path, index) => (
                            <Path key={index} d={path} stroke={colors.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        ))}
                    </Svg>
                </View>
            )}
            <Button label={signature ? t('changeSignature') : t('addSignature')} icon="create-outline" variant={signature ? 'secondary' : 'outline'} size="md" onPress={() => setSigning(true)} testID="signature-open" />
            {signing && (
                <SignatureDialog
                    initial={signature}
                    onClose={() => setSigning(false)}
                    onSave={(saved) => {
                        setSignature(saved);
                        setSigning(false);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 8 },
    preview: { height: PREVIEW_HEIGHT, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, overflow: 'hidden', backgroundColor: '#FFFFFF' },
});
