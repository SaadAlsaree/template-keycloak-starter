'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { keycloakSignOut } from '@/lib/keycloak-logout';
import { useQuery } from '@tanstack/react-query';
import { useFetchClient } from '@/lib/fetchClient';
import { useUserStore } from '@/store/user-store';
import type { CurrentUserDto } from '@/types';

const USER_QUERY_KEY = ['user', 'me'] as const;

export function StoreSync() {
  const { data: session, status } = useSession();
  const fetchClient = useFetchClient();
  const { setUser, setAuthenticated, setLoading } = useUserStore();
  const logoutStartedRef = useRef(false);

  const isSessionReady =
    status === 'authenticated' && session?.error !== 'RefreshAccessTokenError';

  const {
    data: queryUser,
    isLoading: isQueryLoading,
    error
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const resp = await fetchClient<CurrentUserDto>('/profile/me', 'GET');
      if (!resp.succeeded || !resp.data) throw new Error(resp.message);
      return resp.data;
    },
    enabled: isSessionReady,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  useEffect(() => {
    setAuthenticated(status === 'authenticated');
    setLoading(status === 'loading' || (isSessionReady && isQueryLoading));
  }, [status, isSessionReady, isQueryLoading, setAuthenticated, setLoading]);

  useEffect(() => {
    if (queryUser) {
      setUser(queryUser);
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [queryUser, status, setUser]);

  useEffect(() => {
    if (status === 'authenticated') {
      logoutStartedRef.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (logoutStartedRef.current) {
      return;
    }

    if (session?.error === 'RefreshAccessTokenError') {
      logoutStartedRef.current = true;
      console.warn('Session refresh failed, redirecting to login');
      keycloakSignOut();
      return;
    }

    if (error) {
      const errorMessage = error.message || '';
      if (
        errorMessage.includes('401') ||
        errorMessage.includes('Unauthorized')
      ) {
        logoutStartedRef.current = true;
        keycloakSignOut();
      }
    }
  }, [session?.error, error, status]);

  return null;
}
