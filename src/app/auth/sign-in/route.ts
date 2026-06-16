import { signIn } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const callbackUrl = searchParams.get('callbackUrl');
  const safeCallbackUrl =
    callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/';

  await signIn('keycloak', { redirectTo: safeCallbackUrl });

  return NextResponse.redirect(new URL('/', request.nextUrl));
}
