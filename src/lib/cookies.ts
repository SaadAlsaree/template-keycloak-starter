'use server';

import { cookies } from 'next/headers';

export async function getCookieValue(
  name: string
): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export async function setCookieValue(
  name: string,
  value: string,
  maxAge: number = 60 * 60 * 24 * 7
) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, { maxAge, path: '/' });
}

export async function deleteCookieValue(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
