import AppText from '@/components/ui/AppText';
import { colors } from '@/theme';

/** The server's message under a field. */
export default function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return (
        <AppText weight="semibold" size={13} color={colors.danger} accessibilityLiveRegion="polite">
            {message}
        </AppText>
    );
}
