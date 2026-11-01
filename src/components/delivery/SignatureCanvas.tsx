import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import AppText from '@/components/ui/AppText';
import { colors, radius } from '@/theme';

/** What was drawn, with the size of the surface it was drawn on (so a preview can scale it). */
export interface Signature {
    paths: string[];
    width: number;
    height: number;
}

interface SignatureCanvasProps {
    paths: string[];
    hint: string;
    onChange: (signature: Signature) => void;
}

/** The surface the recipient signs on with a finger. */
export default function SignatureCanvas({ paths, hint, onChange }: SignatureCanvasProps) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const drawing = useRef<string[]>(paths);
    const sizeRef = useRef(size);
    sizeRef.current = size;
    drawing.current = paths;

    const responder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderTerminationRequest: () => false,
                onPanResponderGrant: (event) => {
                    const { locationX, locationY } = event.nativeEvent;
                    drawing.current = [...drawing.current, `M${locationX.toFixed(1)} ${locationY.toFixed(1)}`];
                    onChange({ paths: drawing.current, ...sizeRef.current });
                },
                onPanResponderMove: (event) => {
                    const { locationX, locationY } = event.nativeEvent;
                    const last = drawing.current.length - 1;
                    drawing.current = [...drawing.current.slice(0, last), `${drawing.current[last]} L${locationX.toFixed(1)} ${locationY.toFixed(1)}`];
                    onChange({ paths: drawing.current, ...sizeRef.current });
                },
            }),
        [onChange],
    );

    return (
        <View style={styles.pad} onLayout={(event) => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })} {...responder.panHandlers}>
            {size.width > 0 && (
                <Svg width={size.width} height={size.height}>
                    <Rect x={0} y={0} width={size.width} height={size.height} fill="#FFFFFF" />
                    {paths.map((path, index) => (
                        <Path key={index} d={path} stroke={colors.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    ))}
                </Svg>
            )}
            {paths.length === 0 && (
                <View pointerEvents="none" style={styles.hint}>
                    <AppText size={15} color={colors.subtle}>
                        {hint}
                    </AppText>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pad: { flex: 1, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed', overflow: 'hidden', backgroundColor: colors.surface },
    hint: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
