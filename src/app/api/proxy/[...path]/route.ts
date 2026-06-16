import { NextResponse } from 'next/server';
import { getServerAuthTokenFromRequest } from '@/lib/auth-token';
import { fetchServer } from '@/lib/fetchServer';
import { buildBackendHeaders, getProxyHeaders } from '@/lib/proxyHeaders';
import { getClientIp, ratelimit, loginRatelimit } from '@/lib/ratelimit';

const LOGIN_PATHS = ['/auth/login', '/auth/refresh'];

function isLoginPath(apiPath: string): boolean {
  return LOGIN_PATHS.some((p) => apiPath.endsWith(p));
}

async function handleProxyRequest(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const ip = getClientIp(request);
    const { success, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          message: 'Too many requests. Please slow down.',
          succeeded: false,
          code: '429'
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        }
      );
    }

    const resolvedParams = await params;
    const apiPath = '/' + resolvedParams.path.join('/');
    const { search } = new URL(request.url);
    const fullApiPath = apiPath + search;

    if (isLoginPath(apiPath)) {
      let loginIdentifier: string | null = null;
      if (request.method === 'POST') {
        try {
          const body = await request.clone().json();
          loginIdentifier = body?.userLogin || body?.username || null;
        } catch {
          // Body not JSON or empty
        }
      }

      if (loginIdentifier) {
        const loginLimitKey = `login:${ip}:${loginIdentifier}`;
        const loginCheck = await loginRatelimit.limit(loginLimitKey);
        if (!loginCheck.success) {
          return NextResponse.json(
            {
              succeeded: false,
              data: null,
              message: 'Invalid credentials.',
              code: 'Auth.InvalidCredentials',
              errors: []
            },
            { status: 400 }
          );
        }
      }

      const ipLoginLimitKey = `login-ip:${ip}`;
      const ipLoginCheck = await loginRatelimit.limit(ipLoginLimitKey);
      if (!ipLoginCheck.success) {
        return NextResponse.json(
          {
            succeeded: false,
            data: null,
            message: 'Invalid credentials.',
            code: 'Auth.InvalidCredentials',
            errors: []
          },
          { status: 400 }
        );
      }
    }

    const { accessToken, error } = await getServerAuthTokenFromRequest(request);

    if (error === 'RefreshAccessTokenError' || !accessToken) {
      if (isLoginPath(apiPath)) {
        // Let login requests through without session auth
      } else {
        return NextResponse.json(
          {
            succeeded: false,
            data: null,
            message: 'Unauthorized',
            code: '401',
            errors: []
          },
          { status: 401 }
        );
      }
    }

    const proxyHeaders = accessToken
      ? await getProxyHeaders(request)
      : await getProxyHeaders(request);

    const method = request.method as
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'DELETE'
      | 'PATCH';

    const contentType = request.headers.get('content-type') ?? '';
    const isMultipart = contentType.includes('multipart/form-data');

    if (
      method === 'GET' &&
      (apiPath.includes('/download') ||
        apiPath.includes('/print') ||
        apiPath.includes('/picture') ||
        apiPath.includes('/export'))
    ) {
      const backendUrl =
        (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '') +
        fullApiPath;
      const backendHeaders = accessToken
        ? buildBackendHeaders({ accessToken })
        : await getProxyHeaders(request);

      const backendResponse = await fetch(backendUrl, {
        method: 'GET',
        headers: backendHeaders
      });

      const responseHeaders = new Headers();
      const headersToCopy = [
        'Content-Type',
        'Content-Disposition',
        'Content-Length',
        'Cache-Control'
      ];
      for (const h of headersToCopy) {
        const val = backendResponse.headers.get(h);
        if (val) responseHeaders.set(h, val);
      }

      return new Response(backendResponse.body, {
        status: backendResponse.status,
        headers: responseHeaders
      });
    }

    if (isMultipart) {
      const backendUrl =
        (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL) + fullApiPath;

      const formData = await request.formData();

      const backendResponse = await fetch(backendUrl, {
        method,
        headers: buildBackendHeaders({ accessToken: accessToken! }),
        body: formData
      });

      const responseContentType =
        backendResponse.headers.get('Content-Type') ?? '';
      const isJson =
        responseContentType.includes('application/json') ||
        responseContentType.includes('application/problem+json');

      const parsed = isJson
        ? await backendResponse.json()
        : await backendResponse.text();

      const status = backendResponse.ok
        ? 200
        : backendResponse.status >= 100 && backendResponse.status <= 599
          ? backendResponse.status
          : 400;

      return NextResponse.json(parsed, { status });
    }

    let body = undefined;
    if (method !== 'GET') {
      try {
        body = await request.json();
      } catch {
        // Body might be empty or not JSON
      }
    }

    const result = await fetchServer<any>(fullApiPath, method, {
      body,
      headers: proxyHeaders
    });

    if (isLoginPath(apiPath) && !result.succeeded) {
      const genericLoginErrors = [
        'Auth.InvalidCredentials',
        'Auth.AccountLocked',
        'Auth.AccountDisabled',
        'Auth.AccountNotVerified',
        'Auth.TemporaryLock'
      ];
      if (
        genericLoginErrors.some(
          (code) =>
            code.localeCompare(result.code || '', undefined, {
              sensitivity: 'base'
            }) === 0
        ) ||
        (result.code && result.code.startsWith('Auth.'))
      ) {
        return NextResponse.json(
          {
            succeeded: false,
            data: null,
            message: 'Invalid credentials.',
            code: 'Auth.InvalidCredentials',
            errors: []
          },
          { status: 400 }
        );
      }
    }

    let status = 200;
    if (!result.succeeded) {
      status = parseInt(result.code) || 400;
      if (Number.isNaN(status) || status < 100 || status > 599) {
        status = 400;
      }
    }

    return NextResponse.json(result, { status });
  } catch (error) {
    console.error('[GLOBAL_API_PROXY_ERROR]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, context);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, context);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, context);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, context);
}
