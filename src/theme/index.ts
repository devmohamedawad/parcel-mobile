/** BabJet Rider design tokens (see the approved app design). */
export const colors = {
    brand: '#E0561B',
    brandStrong: '#D24A12',
    brandText: '#C2410C',
    brandDeep: '#9A3412',
    brandSoft: '#FDEEE6',
    brandTint: '#FFF7ED',
    brandOnDark: '#F07A45',
    ink: '#1C1917',
    inkSoft: '#44403C',
    body: '#57504A',
    muted: '#6B635C',
    subtle: '#8A8079',
    line: '#E8E3DD',
    divider: '#F0EDEA',
    ground: '#F5F3F0',
    surface: '#FFFFFF',
    field: '#FAF9F7',
    neutralSoft: '#EAE6E1',
    success: '#15803D',
    successText: '#166534',
    successSoft: '#E3F4E8',
    successDot: '#16A34A',
    danger: '#B91C1C',
    dangerLine: '#F2C9C9',
    info: '#2563EB',
    night: '#1C1917',
    nightLine: '#3A3532',
    nightBorder: '#57504A',
    nightMuted: '#D6D0CA',
    launch: '#FEFEFE',
} as const;

export const fonts = {
    regular: 'Cairo_400Regular',
    medium: 'Cairo_500Medium',
    semibold: 'Cairo_600SemiBold',
    bold: 'Cairo_700Bold',
    extrabold: 'Cairo_800ExtraBold',
} as const;

export type FontWeight = keyof typeof fonts;

export const radius = { sm: 12, md: 16, lg: 22, xl: 28, pill: 999 } as const;

export const shadow = {
    card: { shadowColor: '#1C1917', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
    float: { shadowColor: '#1C1917', shadowOpacity: 0.14, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
    brand: { shadowColor: '#D24A12', shadowOpacity: 0.28, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
} as const;
