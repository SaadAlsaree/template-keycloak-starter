import { NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';
import { getServerAuthTokenFromRequest } from '@/lib/auth-token';
import { authConfig } from '@/lib/config';

interface SignOutCookie {
  name: string;
  value: string;
  options?: Parameters<NextResponse['cookies']['set']>[2];
}

interface SignOutResult {
  cookies?: SignOutCookie[];
}

function appendSignOutCookies(
  response: NextResponse,
  signOutResponse: SignOutResult
) {
  for (const cookie of signOutResponse.cookies ?? []) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
}

export async function GET(request: Request) {
  const { idToken } = await getServerAuthTokenFromRequest(request);
  const { searchParams } = new URL(request.url);

  const signOutResponse = await signOut({ redirect: false });

  const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || authConfig.kcIssuer;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_ID || authConfig.kcClientId;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || authConfig.authUrl;

  const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);

  if (idToken) {
    logoutUrl.searchParams.set('id_token_hint', idToken);
  }

  logoutUrl.searchParams.set('client_id', clientId);
  logoutUrl.searchParams.set('post_logout_redirect_uri', `${appUrl}/`);

  if (searchParams.get('format') === 'json') {
    const response = NextResponse.json({ logoutUrl: logoutUrl.toString() });
    appendSignOutCookies(response, signOutResponse);
    return response;
  }

  const response = NextResponse.redirect(logoutUrl);
  appendSignOutCookies(response, signOutResponse);
  return response;
}
