import arTranslations from '@/locales/ar/translation.json';
import enTranslations from '@/locales/en/translation.json';
import { cookies } from 'next/headers';

export async function getTranslation() {
  const cookieStore = await cookies();
  const language = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
  const translations = language === 'en' ? enTranslations : arTranslations;

  return function t(path: string): string {
    const keys = path.split('.');
    let current: any = translations;

    for (const key of keys) {
      if (current === undefined || current === null) {
        return path;
      }
      current = current[key];
    }

    return typeof current === 'string' ? current : path;
  };
}
