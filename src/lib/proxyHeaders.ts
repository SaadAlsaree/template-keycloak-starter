import { getServerAuthTokenFromRequest } from '@/lib/auth-token';
import { proxyConfig } from '@/lib/config';

export interface BackendHeaderOptions {
  accessToken?: string;
  contentType?: string | null;
  acceptLanguage?: string | null;
  userAgent?: string | null;
}

export function buildBackendHeaders(
  options: BackendHeaderOptions = {}
): HeadersInit {
  const headers = new Headers();
  const { accessToken, contentType, acceptLanguage, userAgent } = options;

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (proxyConfig.internalKey) {
    headers.set('X-Internal-Proxy-Key', proxyConfig.internalKey);
  }

  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  if (acceptLanguage) {
    headers.set('Accept-Language', acceptLanguage);
  }

  if (userAgent) {
    headers.set('User-Agent', userAgent);
  }

  return Object.fromEntries(headers.entries());
}

/**
 * Utility to extract specific headers from an incoming request
 * and add any necessary authentication headers for the backend proxy.
 */
export async function getProxyHeaders(request: Request): Promise<HeadersInit> {
  const { accessToken } = await getServerAuthTokenFromRequest(request);

  return buildBackendHeaders({
    accessToken,
    contentType:
      request.headers.get('Content-Type') ||
      (request.method !== 'GET' && request.method !== 'DELETE'
        ? 'application/json'
        : null),
    acceptLanguage: request.headers.get('Accept-Language'),
    userAgent: request.headers.get('User-Agent')
  });
}
