import { NextResponse } from 'next/server';
import { getServerAuthTokenFromRequest } from '@/lib/auth-token';
import { getClientIp, hubTokenRatelimit } from '@/lib/ratelimit';

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { success, remaining, reset } = await hubTokenRatelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      }
    );
  }

  const { accessToken, error } = await getServerAuthTokenFromRequest(request);

  if (error === 'RefreshAccessTokenError' || !accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ accessToken });
}
