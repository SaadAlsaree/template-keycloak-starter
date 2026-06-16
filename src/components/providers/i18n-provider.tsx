'use client';

import type { ReactNode } from 'react';
import {
  I18nextProvider,
  useTranslation as useTranslationOriginal
} from 'react-i18next';
import i18n from '@/config/i18n';

export function I18nProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export function useI18n() {
  const { t, i18n: i18nInstance } = useTranslationOriginal();
  return { t, i18n: i18nInstance };
}
