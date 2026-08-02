/**
 * Querencia - Design Tokens (TypeScript)
 * Dùng chung cho React Native (Cùi Bắp, Nope, LàNo)
 * và packages/ui (web components)
 *
 * Font: Plus Jakarta Sans - SIL Open Font License (free)
 * Colors: #4A7C59 | #FFFFFF | #111111
 */

export const colors = {
  // ── Brand ────────────────────────────────────────────────
  green:      '#4A7C59',
  greenDark:  '#3D6B4A',
  greenLight: '#EAF2EC',
  greenMid:   'rgba(74, 124, 89, 0.15)',

  white:      '#FFFFFF',
  black:      '#111111',

  // ── Neutrals ─────────────────────────────────────────────
  gray100:    '#F7F7F5',
  gray200:    '#EFEFED',
  gray400:    '#AAAAAA',
  gray600:    '#666666',
  gray800:    '#333333',

  // ── Dark mode surfaces ────────────────────────────────────
  dark100:    '#1A1A18',
  dark200:    '#2A2A28',
} as const;

export const typography = {
  fontFamily: 'PlusJakartaSans',  // tên file font trong assets

  size: {
    xs:   12,
    sm:   14,
    base: 16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  weight: {
    light:     '300',
    regular:   '400',
    medium:    '500',
    semibold:  '600',
    bold:      '700',
    extrabold: '800',
  },

  lineHeight: {
    tight:   1.25,
    snug:    1.375,
    normal:  1.5,
    relaxed: 1.625,
  },
} as const;

export const spacing = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   20,
  '2xl': 28,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius:  3,
    elevation:     2,
  },
  md: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius:  12,
    elevation:     4,
  },
  lg: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius:  24,
    elevation:     8,
  },
} as const;

// ── Semantic tokens ───────────────────────────────────────
export const lightTheme = {
  bg:           colors.white,
  bgSurface:    colors.gray100,
  bgBorder:     colors.gray200,
  text:         colors.black,
  textSub:      colors.gray600,
  textMuted:    colors.gray400,
  accent:       colors.green,
  accentHover:  colors.greenDark,
  accentSoft:   colors.greenLight,
} as const;

export const darkTheme = {
  bg:           colors.black,
  bgSurface:    colors.dark100,
  bgBorder:     colors.dark200,
  text:         colors.white,
  textSub:      colors.gray800,
  textMuted:    '#555553',
  accent:       colors.green,
  accentHover:  '#5A9A6A',
  accentSoft:   colors.greenMid,
} as const;

export type Theme = typeof lightTheme;

const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  light: lightTheme,
  dark:  darkTheme,
};

export default theme;
