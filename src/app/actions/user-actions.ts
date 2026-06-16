'use server';

import { setCookieValue, deleteCookieValue } from '@/lib/cookies';
import type { User } from '@/types';
import { fetchServer } from '@/lib/fetchServer';

export async function saveUserToCookie(user: User) {
  await setCookieValue('user', JSON.stringify(user));
}

export async function clearUserCookie() {
  await deleteCookieValue('user');
  await deleteCookieValue('auth_token');
}

export async function saveUserSettings(settings: {
  theme?: string;
  language?: string;
  fontSize?: string;
}) {
  await setCookieValue('user-settings', JSON.stringify(settings));
}

export async function saveAuthToken(token: string) {
  await setCookieValue('auth_token', token, 60 * 8);
}

export async function updatePasswordAction(data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await fetchServer('/profile/password', 'PUT', {
    body: data
  });

  if (!response.succeeded) {
    console.error('Password API Error:', response);
    throw new Error(response.message || 'Failed to update password');
  }

  return true;
}
