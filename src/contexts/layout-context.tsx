'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react';
import i18next from '@/config/i18n';

const COOKIE_NAME = 'layout-settings';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

interface LayoutSettings {
  direction: 'ltr' | 'rtl';
  variant: 'sidebar' | 'floating' | 'inset';
  collapsible: 'offcanvas' | 'icon' | 'none';
  fontSize: number;
  themeColor:
    | 'default'
    | 'blue'
    | 'green'
    | 'amber'
    | 'rose'
    | 'orange'
    | 'cyan'
    | 'purple'
    | 'violet';
  radius: number;
  fontType:
    | 'sans'
    | 'mono'
    | 'cairo'
    | 'cairo-play'
    | 'amiri'
    | 'noto-naskh'
    | 'tajawal';
  readingMode: boolean;
}

interface LayoutContextType {
  settings: LayoutSettings;
  variant: string;
  setVariant: (variant: 'sidebar' | 'floating' | 'inset') => void;
  collapsible: string;
  setCollapsible: (collapsible: 'offcanvas' | 'icon' | 'none') => void;
  updateSettings: (updates: Partial<LayoutSettings>) => void;
  resetLayout: () => void;
  defaultVariant: string;
  defaultCollapsible: string;
}

const defaultSettings: LayoutSettings = {
  direction: 'rtl',
  variant: 'floating',
  collapsible: 'offcanvas',
  fontSize: 1,
  themeColor: 'default',
  radius: 0.5,
  fontType: 'sans',
  readingMode: false
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LayoutSettings>(defaultSettings);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedSettings = getCookie(COOKIE_NAME);
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (e) {
        // Invalid json
      }
    }
  }, []);

  const updateSettings = (updates: Partial<LayoutSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    setCookie(COOKIE_NAME, JSON.stringify(newSettings), COOKIE_MAX_AGE);
  };

  const setVariant = (variant: 'sidebar' | 'floating' | 'inset') => {
    updateSettings({ variant });
  };

  const setCollapsible = (collapsible: 'offcanvas' | 'icon' | 'none') => {
    updateSettings({ collapsible });
  };

  const resetLayout = () => {
    setSettings(defaultSettings);
    setCookie(COOKIE_NAME, JSON.stringify(defaultSettings), COOKIE_MAX_AGE);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = settings.direction;
      const lng = settings.direction === 'rtl' ? 'ar' : 'en';
      setCookie('NEXT_LOCALE', lng, COOKIE_MAX_AGE);
      if (i18next.isInitialized) {
        i18next.changeLanguage(lng);
      }
    }
  }, [settings.direction]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;

      // Remove old theme classes
      root.classList.remove(
        'theme-default',
        'theme-blue',
        'theme-green',
        'theme-amber',
        'theme-rose',
        'theme-orange',
        'theme-cyan',
        'theme-purple',
        'theme-violet',
        'theme-default-scaled',
        'theme-blue-scaled',
        'theme-green-scaled',
        'theme-amber-scaled',
        'theme-rose-scaled',
        'theme-orange-scaled',
        'theme-cyan-scaled',
        'theme-purple-scaled',
        'theme-violet-scaled'
      );

      // Apply theme color
      const themeClass = `theme-${settings.themeColor}`;
      root.classList.add(themeClass);

      // Apply radius
      root.style.setProperty('--radius', `${settings.radius}rem`);

      // Apply font type via class (handle in global css or theme.css)
      // Or just apply the variable directly if we switch vars
      if (settings.fontType === 'mono') {
        root.style.setProperty('--font-sans', 'var(--font-mono)');
      } else if (settings.fontType === 'cairo') {
        root.style.setProperty('--font-sans', 'var(--font-cairo)');
      } else if (settings.fontType === 'cairo-play') {
        root.style.setProperty('--font-sans', 'var(--font-cairo-play)');
      } else if (settings.fontType === 'amiri') {
        root.style.setProperty('--font-sans', 'var(--font-amiri)');
      } else if (settings.fontType === 'noto-naskh') {
        root.style.setProperty('--font-sans', 'var(--font-noto-naskh)');
      } else if (settings.fontType === 'tajawal') {
        root.style.setProperty('--font-sans', 'var(--font-tajawal)');
      } else {
        root.style.removeProperty('--font-sans');
      }

      // Apply font size scaling
      // Using distinct levels for font scaling
      root.style.setProperty('font-size', `${settings.fontSize * 100}%`);
      // Also cleanup scaled classes if they exist from previous sessions
      root.classList.remove('theme-scaled');
    }
  }, [
    settings.themeColor,
    settings.radius,
    settings.fontType,
    settings.fontSize
  ]);

  // Apply reading mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (settings.readingMode) {
        root.classList.add('reading-mode');
      } else {
        root.classList.remove('reading-mode');
      }
    }
  }, [settings.readingMode]);

  if (!isMounted) {
    return null;
  }

  return (
    <LayoutContext.Provider
      value={{
        settings,
        variant: settings.variant,
        setVariant,
        collapsible: settings.collapsible,
        setCollapsible,
        updateSettings,
        resetLayout,
        defaultVariant: defaultSettings.variant,
        defaultCollapsible: defaultSettings.collapsible
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
