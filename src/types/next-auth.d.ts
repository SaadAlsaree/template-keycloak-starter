import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    error?: string;
  }

  interface User {
    username: string;
    displayName: string;
    reputation: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    idToken?: string;
    error?: string;
    user?: {
      id: string;
      displayName: string;
      reputation: number;
    };
  }
}
