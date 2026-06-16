import { create } from 'zustand';
import { keycloakSignOut } from '@/lib/keycloak-logout';
import {
  saveUserSettings,
  updatePasswordAction
} from '@/app/actions/user-actions';
import type { User, CurrentUserDto } from '@/types';

interface UserState {
  user: CurrentUserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;

  // Actions
  setUser: (user: CurrentUserDto | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (isError: boolean) => void;

  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<CurrentUserDto>) => void;
  updateSettings: (settings: {
    theme?: string;
    language?: string;
    fontSize?: string;
  }) => Promise<void>;
  updatePassword: (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,

  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (isError) => set({ isError }),

  login: async () => {
    const { signIn } = await import('next-auth/react');
    signIn('keycloak');
  },

  logout: async () => {
    await keycloakSignOut();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    }));
  },

  updateSettings: async (settings) => {
    await saveUserSettings(settings);
  },

  updatePassword: async (oldPassword, newPassword, confirmPassword) => {
    await updatePasswordAction({ oldPassword, newPassword, confirmPassword });
  }
}));

export function hasCurrentUserRole(role: string): boolean {
  const { user } = useUserStore.getState();
  if (!user) return false;
  return user.userRoles.some((r) => r.roleName === role);
}

export function hasAnyRole(roles: string[]): boolean {
  const { user } = useUserStore.getState();
  if (!user || roles.length === 0) return false;
  const userRoleNames = user.userRoles.map((r) => r.roleName);
  return roles.some((role) => userRoleNames.includes(role));
}
