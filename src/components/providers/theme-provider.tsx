'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme
} from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';

const defaultTheme = 'system';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  );
}

export function useTheme() {
  const nextTheme = useNextTheme();

  return {
    theme: nextTheme.theme,
    resolvedTheme: nextTheme.resolvedTheme,
    setTheme: nextTheme.setTheme,
    defaultTheme,
    resetTheme: () => nextTheme.setTheme(defaultTheme)
  };
}
