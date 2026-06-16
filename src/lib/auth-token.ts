import { getToken } from 'next-auth/jwt';
import { auth } from '@/lib/auth';
import { authConfig } from '@/lib/config';

export interface ServerAuthToken {
  accessToken?: string;
  idToken?: string;
  error?: string;
}

async function extractAuthToken(
  req: Request | { headers: { cookie: string } }
): Promise<ServerAuthToken> {
  // Run the JWT callback first so expired access tokens are refreshed.
  await auth();

  const token = await getToken({
    req,
    secret: authConfig.secret
  });

  if (!token) {
    return {};
  }

  return {
    accessToken: token.accessToken as string | undefined,
    idToken: token.idToken as string | undefined,
    error: token.error as string | undefined
  };
}

export async function getServerAuthToken(): Promise<ServerAuthToken> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return extractAuthToken({
    headers: { cookie: cookieStore.toString() }
  });
}

export async function getServerAuthTokenFromRequest(
  request: Request
): Promise<ServerAuthToken> {
  return extractAuthToken(request);
}
