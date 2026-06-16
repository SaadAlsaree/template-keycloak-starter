'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActiveThemeProvider } from '../themes/active-theme';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { LayoutProvider, useLayout } from '@/contexts/layout-context';
import { DirectionProvider } from '@/components/ui/direction';
import { StoreSync } from '@/components/providers/store-sync';

const queryClient = new QueryClient();

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <I18nProvider>
          <LayoutProvider>
            <StoreSync />
            <DirectionWrapper>{children}</DirectionWrapper>
          </LayoutProvider>
        </I18nProvider>
      </ActiveThemeProvider>
    </QueryClientProvider>
  );
}

function DirectionWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useLayout();
  return (
    <DirectionProvider direction={settings.direction}>
      {children}
    </DirectionProvider>
  );
}
