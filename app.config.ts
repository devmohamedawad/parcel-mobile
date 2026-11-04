import type { ConfigContext, ExpoConfig } from 'expo/config';
import { withAndroidManifest } from 'expo/config-plugins';

/**
 * app.json holds the configuration; this adds the Firebase file for Android push and allows plain
 * http:// servers (an IP:port on Tailscale or the office network), which Android release builds block.
 * The Firebase file is kept out of the public repository: EAS builds get it from the secret
 * GOOGLE_SERVICES_JSON file variable, local builds read ./google-services.json.
 */
export default ({ config }: ConfigContext): ExpoConfig =>
    withAndroidManifest(
        {
            ...(config as ExpoConfig),
            android: {
                ...config.android,
                googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
            },
        },
        (manifest) => {
            manifest.modResults.manifest.application?.forEach((application) => {
                application.$['android:usesCleartextTraffic'] = 'true';
            });

            return manifest;
        },
    );
