const strings = {
    en: {
        signIn: 'Sign in',
        email: 'Email',
        password: 'Password',
        signingIn: 'Signing in…',
        today: 'Today',
        shift: 'Shift',
        onShift: 'On shift since :time',
        offShift: 'You are off shift',
        startShift: 'Start shift',
        endShift: 'End shift',
        trackingOn: 'Your route is being recorded.',
        trackingOff: 'Location is not recorded off shift.',
        lastShift: 'Last shift: :km km',
        waiting: ':count points waiting to be sent',
        signOut: 'Sign out',
        notificationTitle: 'BabJet: on shift',
        notificationBody: 'Your route is recorded until you end the shift.',
        locationNeeded: 'Allow location "All the time" so your route is recorded during the shift.',
        openSettings: 'Open settings',
    },
    ar: {
        signIn: 'تسجيل الدخول',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        signingIn: 'جارٍ تسجيل الدخول…',
        today: 'اليوم',
        shift: 'الوردية',
        onShift: 'في الوردية منذ :time',
        offShift: 'أنت خارج الوردية',
        startShift: 'ابدأ الوردية',
        endShift: 'أنهِ الوردية',
        trackingOn: 'يتم تسجيل مسارك.',
        trackingOff: 'لا يُسجَّل موقعك خارج الوردية.',
        lastShift: 'آخر وردية: :km كم',
        waiting: ':count نقطة بانتظار الإرسال',
        signOut: 'تسجيل الخروج',
        notificationTitle: 'باب جت: في الوردية',
        notificationBody: 'يُسجَّل مسارك حتى تنهي الوردية.',
        locationNeeded: 'اسمح بالموقع "طوال الوقت" ليُسجَّل مسارك أثناء الوردية.',
        openSettings: 'افتح الإعدادات',
    },
} as const;

export type Locale = keyof typeof strings;
export type StringKey = keyof (typeof strings)['en'];

/** Text in the rider's language, with `:name` placeholders replaced. */
export function translate(locale: Locale, key: StringKey, replacements: Record<string, string | number> = {}): string {
    return Object.entries(replacements).reduce<string>((text, [name, value]) => text.replaceAll(`:${name}`, String(value)), strings[locale][key]);
}
