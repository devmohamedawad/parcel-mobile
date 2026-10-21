import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';
import { colors } from '@/theme';

/** How long the logo animation plays before the app shows. */
const ANIMATION_MS = 3000;

interface LaunchSplashProps {
    /** True once the app knows where to go (session restored). */
    ready: boolean;
    onDone: () => void;
}

/** The animated BabJet logo on white, shown once when the app opens. */
export default function LaunchSplash({ ready, onDone }: LaunchSplashProps) {
    const opacity = useRef(new Animated.Value(1)).current;
    const [played, setPlayed] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
            timer = setTimeout(() => setPlayed(true), reduced ? 600 : ANIMATION_MS);
        });

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (played && ready) {
            Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }).start(onDone);
        }
    }, [played, ready, opacity, onDone]);

    return (
        <Animated.View style={[styles.screen, { opacity }]} accessibilityLabel="BabJet">
            <Image source={require('../../assets/launch-logo.webp')} style={styles.logo} contentFit="contain" autoplay />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    screen: { ...StyleSheet.absoluteFill, backgroundColor: colors.launch, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    logo: { width: 280, height: 280 },
});
