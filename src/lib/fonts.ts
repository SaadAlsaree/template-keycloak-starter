import { cn } from '@/lib/utils';
import {
  Inter,
  JetBrains_Mono,
  Cairo,
  Cairo_Play,
  Amiri,
  Noto_Naskh_Arabic,
  Tajawal,
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Noto_Sans_Mono,
  Mulish,
  Architects_Daughter,
  DM_Sans,
  Fira_Code,
  Outfit,
  Space_Mono
} from 'next/font/google';

export const fontSans = Inter({
  subsets: ['latin'],
  preload: false,
  variable: '--font-sans',
  display: 'swap'
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  preload: false,
  variable: '--font-mono',
  display: 'swap'
});

export const fontCairo = Cairo({
  subsets: ['latin', 'arabic'],
  preload: false,
  variable: '--font-cairo',
  display: 'swap'
});

export const fontCairoPlay = Cairo_Play({
  subsets: ['latin', 'arabic'],
  preload: false,
  variable: '--font-cairo-play',
  display: 'swap'
});

export const fontAmiri = Amiri({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  preload: false,
  variable: '--font-amiri',
  display: 'swap'
});

export const fontNotoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  preload: false,
  variable: '--font-noto-naskh',
  display: 'swap'
});

export const fontTajawal = Tajawal({
  subsets: ['latin', 'arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  preload: false,
  variable: '--font-tajawal',
  display: 'swap'
});

export const fontGeist = Geist({
  subsets: ['latin'],
  preload: false,
  variable: '--font-geist',
  display: 'swap'
});

export const fontGeistMono = Geist_Mono({
  subsets: ['latin'],
  preload: false,
  variable: '--font-geist-mono',
  display: 'swap'
});

export const fontInstrument = Instrument_Sans({
  subsets: ['latin'],
  preload: false,
  variable: '--font-instrument',
  display: 'swap'
});

export const fontNotoMono = Noto_Sans_Mono({
  subsets: ['latin'],
  preload: false,
  variable: '--font-noto-mono',
  display: 'swap'
});

export const fontMullish = Mulish({
  subsets: ['latin'],
  preload: false,
  variable: '--font-mullish',
  display: 'swap'
});

export const fontArchitectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: '400',
  preload: false,
  variable: '--font-architects-daughter',
  display: 'swap'
});

export const fontDMSans = DM_Sans({
  subsets: ['latin'],
  preload: false,
  variable: '--font-dm-sans',
  display: 'swap'
});

export const fontFiraCode = Fira_Code({
  subsets: ['latin'],
  preload: false,
  variable: '--font-fira-code',
  display: 'swap'
});

export const fontOutfit = Outfit({
  subsets: ['latin'],
  preload: false,
  variable: '--font-outfit',
  display: 'swap'
});

export const fontSpaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
  variable: '--font-space-mono',
  display: 'swap'
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontCairo.variable,
  fontCairoPlay.variable,
  fontAmiri.variable,
  fontNotoNaskh.variable,
  fontTajawal.variable,
  fontGeist.variable,
  fontGeistMono.variable,
  fontInstrument.variable,
  fontNotoMono.variable,
  fontMullish.variable,
  fontArchitectsDaughter.variable,
  fontDMSans.variable,
  fontFiraCode.variable,
  fontOutfit.variable,
  fontSpaceMono.variable
);
