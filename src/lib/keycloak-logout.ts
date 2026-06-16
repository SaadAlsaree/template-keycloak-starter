'use client';

export async function keycloakSignOut() {
  try {
    const response = await fetch('/api/auth/keycloak-logout?format=json', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      const data = (await response.json()) as { logoutUrl?: string };
      if (data.logoutUrl) {
        window.location.replace(data.logoutUrl);
        return;
      }
    }
  } catch {
    // Fall back to the server redirect flow if fetching the logout URL fails.
  }

  window.location.replace('/api/auth/keycloak-logout');
}
