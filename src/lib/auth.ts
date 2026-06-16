import NextAuth from 'next-auth';
import Keycloak from '@auth/core/providers/keycloak';
import { authConfig } from '@/lib/config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: '/auth/sign-in'
  },
  providers: [
    Keycloak({
      clientId: authConfig.kcClientId,
      clientSecret: authConfig.kcSecret,
      issuer: authConfig.kcIssuer,
      authorization: {
        params: { scope: 'openid profile email' },
        url: `${authConfig.kcIssuer}/protocol/openid-connect/auth`
      },
      token: `${authConfig.kcInternal}/protocol/openid-connect/token`,
      userinfo: `${authConfig.kcInternal}/protocol/openid-connect/userinfo`
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      const now = Math.floor(Date.now() / 1000);

      if (account && account.access_token && account.refresh_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.accessTokenExpires = now + account.expires_in!;
        token.error = undefined;
        return token;
      }

      if (
        token.accessTokenExpires &&
        now < (token.accessTokenExpires as number) - 30
      ) {
        return token;
      }

      if (!token.refreshToken) {
        token.error = 'RefreshAccessTokenError';
        return token;
      }

      try {
        const response = await fetch(
          `${authConfig.kcInternal}/protocol/openid-connect/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              client_id: authConfig.kcClientId,
              client_secret: authConfig.kcSecret,
              refresh_token: token.refreshToken as string
            })
          }
        );

        if (!response.ok) {
          console.error(
            'Failed to refresh token:',
            response.status,
            await response.text()
          );
          token.error = 'RefreshAccessTokenError';
          token.accessToken = undefined;
          token.refreshToken = undefined;
          token.idToken = undefined;
          return token;
        }

        const refreshed = await response.json();

        if (!refreshed.access_token) {
          console.error('No access_token in refresh response');
          token.error = 'RefreshAccessTokenError';
          token.accessToken = undefined;
          token.refreshToken = undefined;
          token.idToken = undefined;
          return token;
        }

        token.accessToken = refreshed.access_token;
        token.refreshToken = refreshed.refresh_token ?? token.refreshToken;
        token.idToken = refreshed.id_token ?? token.idToken;
        token.accessTokenExpires = now + (refreshed.expires_in ?? 300);
        token.error = undefined;
      } catch (e) {
        console.error('Failed to refresh token:', e);
        token.error = 'RefreshAccessTokenError';
        token.accessToken = undefined;
        token.refreshToken = undefined;
        token.idToken = undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        session.error = 'RefreshAccessTokenError';
      }

      if (token.accessTokenExpires) {
        session.expires = new Date(
          (token.accessTokenExpires as number) * 1000
        ) as unknown as typeof session.expires;
      }

      return session;
    }
  }
});
