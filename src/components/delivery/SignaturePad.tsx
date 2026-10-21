import { File, Paths } from 'expo-file-system';
import { type Ref, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import type { UploadFile } from '@/hooks/useParcelUpdate';
import { colors, radius } from '@/theme';

export interface SignaturePadHandle {
    /** The signature as a PNG file, or null when nothing was drawn. */
    toFile: () => Promise<UploadFile | null>;
}

const HEIGHT = 180;

/** The recipient signs with a finger; saved as a PNG for the proof of delivery. */
export default function SignaturePad({ ref, label }: { ref?: Ref<SignaturePadHandle>; label: string }) {
    const { t } = useAuth();
    const [paths, setPaths] = useState<string[]>([]);
    const [width, setWidth] = useState(0);
    const drawing = useRef<string[]>([]);
    const svg = useRef<Svg>(null);

    const responder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderTerminationRequest: () => false,
                onPanResponderGrant: (event) => {
                    const { locationX, locationY } = event.nativeEvent;
                    drawing.current = [...drawing.current, `M${locationX.toFixed(1)} ${locationY.toFixed(1)}`];
                    setPaths(drawing.current);
                },
                onPanResponderMove: (event) => {
                    const { locationX, locationY } = event.nativeEvent;
                    const last = drawing.current.length - 1;
                    drawing.current = [...drawing.current.slice(0, last), `${drawing.current[last]} L${locationX.toFixed(1)} ${locationY.toFixed(1)}`];
                    setPaths(drawing.current);
                },
            }),
        [],
    );

    useImperativeHandle(ref, () => ({
        toFile: () =>
            new Promise((resolve) => {
                if (drawing.current.length === 0 || !svg.current) {
                    resolve(null);
                    return;
                }
                svg.current.toDataURL((base64) => {
                    const file = new File(Paths.cache, `signature-${Date.now()}.png`);
                    file.write(base64, { encoding: 'base64' });
                    resolve({ uri: file.uri, name: 'signature.png', type: 'image/png' });
                });
            }),
    }));

    return (
        <View style={styles.wrap}>
            <View style={styles.head}>
                <AppText weight="bold" size={14}>
                    {label}
                </AppText>
                {paths.length > 0 && (
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                            drawing.current = [];
                            setPaths([]);
                        }}
                        hitSlop={8}
                    >
                        <AppText weight="bold" size={14} color={colors.brandText}>
                            {t('clear')}
                        </AppText>
                    </Pressable>
                )}
            </View>
            <View style={styles.pad} onLayout={(event) => setWidth(event.nativeEvent.layout.width)} {...responder.panHandlers}>
                {width > 0 && (
                    <Svg ref={svg} width={width} height={HEIGHT}>
                        <Rect x={0} y={0} width={width} height={HEIGHT} fill="#FFFFFF" />
                        {paths.map((path, index) => (
                            <Path key={index} d={path} stroke={colors.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        ))}
                    </Svg>
                )}
                {paths.length === 0 && (
                    <View pointerEvents="none" style={styles.hint}>
                        <AppText size={14} color={colors.subtle}>
                            {t('signHere')}
                        </AppText>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 8 },
    head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pad: { height: HEIGHT, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed', overflow: 'hidden', backgroundColor: colors.surface },
    hint: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
