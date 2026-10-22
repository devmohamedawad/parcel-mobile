import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * app.json holds the configuration; this only adds the Firebase file for Android push.
 * The file is kept out of the public repository: EAS builds get it from the secret
 * GOOGLE_SERVICES_JSON file variable, local builds read ./google-services.json.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
    ...(config as ExpoConfig),
    android: {
        ...config.android,
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    },
});
