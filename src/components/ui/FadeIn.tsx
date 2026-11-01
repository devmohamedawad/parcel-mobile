import { type PropsWithChildren, useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, type ViewStyle } from 'react-native';

interface FadeInProps extends PropsWithChildren {
    /** Position in a list: each item starts a little after the one before it. */
    index?: number;
    style?: ViewStyle;
}

/** Most items that are staggered, so a long list does not keep the last ones waiting. */
const MAX_STAGGERED = 8;

/** Fades and slides its content up into place when it first appears. */
export default function FadeIn({ index = 0, style, children }: FadeInProps) {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Riders who turned animations off see the content straight away.
        AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
            if (reduced) {
                progress.setValue(1);

                return;
            }

            Animated.timing(progress, {
                toValue: 1,
                duration: 320,
                delay: Math.min(index, MAX_STAGGERED) * 60,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        });
    }, [progress, index]);

    return <Animated.View style={[style, { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>{children}</Animated.View>;
}
