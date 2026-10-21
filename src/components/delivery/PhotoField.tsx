import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Alert, StyleSheet, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import type { UploadFile } from '@/hooks/useParcelUpdate';
import { colors, radius } from '@/theme';

interface PhotoFieldProps {
    photo: UploadFile | null;
    required: boolean;
    onChange: (photo: UploadFile) => void;
}

/** Takes the proof photo with the camera (compressed before upload). */
export default function PhotoField({ photo, required, onChange }: PhotoFieldProps) {
    const { t } = useAuth();

    const take = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(t('cameraDenied'));
            return;
        }
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.6, exif: false });
        const asset = result.canceled ? null : result.assets[0];
        if (asset) {
            onChange({ uri: asset.uri, name: asset.fileName ?? 'photo.jpg', type: asset.mimeType ?? 'image/jpeg' });
        }
    };

    return (
        <View style={styles.wrap}>
            <View style={styles.head}>
                <AppText weight="bold" size={14}>
                    {t('photoLabel')}
                </AppText>
                <AppText size={13} color={required ? colors.brandDeep : colors.muted}>
                    {required ? t('photoRequired') : t('photoOptional')}
                </AppText>
            </View>
            {photo && <Image source={{ uri: photo.uri }} style={styles.preview} contentFit="cover" />}
            <Button label={photo ? t('retakePhoto') : t('takePhoto')} icon="camera-outline" variant={photo ? 'secondary' : 'outline'} size="md" onPress={take} testID="take-photo" />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: 8 },
    head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    preview: { height: 180, borderRadius: radius.md, backgroundColor: colors.neutralSoft },
});
