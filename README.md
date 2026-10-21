# BabJet Rider

Native rider app for BabJet (the Parcel courier system): today's pickups and deliveries, proof of delivery, cash, and location tracking while the rider is on shift.

- Expo (React Native, TypeScript), built with EAS (`npx eas-cli@latest build`).
- Talks to the Parcel API; the server lives in the Parcel repository.

## Develop

```bash
npm install
npx expo start
```

## What is in it

- Sign in (`POST /api/rider/v1/login`, token in secure storage), Today screen with Start / End shift.
- While on shift: background location every 30 s or 50 m (`src/tracking`), points queued on the phone and sent in batches, so nothing is lost offline.
- Push token registered with the server (`src/lib/push.ts`); Android needs FCM credentials in EAS to receive notifications.

## First build (Android)

```bash
npx eas-cli@latest build --profile development --platform android
```

Install the APK from the link EAS gives, then `npx expo start --dev-client` and open the app.
The server address comes from `EXPO_PUBLIC_API_URL` (see `eas.json`).
