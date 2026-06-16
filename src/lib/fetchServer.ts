import { redirect } from 'next/navigation';
import { getServerAuthToken } from '@/lib/auth-token';
import { proxyConfig } from '@/lib/config';
import { ApiResponse } from '@/types';

export async function fetchServer<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  options: Omit<RequestInit, 'body'> & { body?: unknown } = {}
): Promise<ApiResponse<T>> {
  const { body, ...rest } = options;
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) throw new Error('Missing API URL');
  const { accessToken } = await getServerAuthToken();

  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    ...(method !== 'GET' && !isFormData
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(proxyConfig.internalKey
      ? { 'X-Internal-Proxy-Key': proxyConfig.internalKey }
      : {}),
    ...(rest.headers || {})
  };

  try {
    const response = await fetch(apiUrl + url, {
      method,
      headers,
      ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
      ...rest
    });

    const contentType = response.headers.get('Content-Type');
    const isJson =
      contentType?.includes('application/json') ||
      contentType?.includes('application/problem+json');

    const parsed = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      console.log('API Error Response:', response.status, url);

      let message = '';
      if (response.status === 429) {
        redirect('/too-many-requests');
      } else if (response.status === 404) {
        message = 'Resource not found';
      } else if (response.status === 401) {
        const authHeader = response.headers.get('WWW-Authenticate');
        const authErrorDescription = response.headers.get(
          'X-Auth-Error-Description'
        );
        const authFailure = response.headers.get('X-Auth-Failure');

        if (authErrorDescription) {
          message = authErrorDescription;
        } else if (authFailure) {
          message = authFailure;
        } else if (authHeader?.includes('error_description')) {
          const match = authHeader.match(/error_description="(.+?)"/);
          if (match) message = match[1];
        } else {
          message = 'You must be logged in to do that';
        }
      }

      if (!message) {
        if (typeof parsed === 'string') {
          message = parsed;
        } else if (parsed?.message) {
          message = parsed.message;
        } else {
          message = getFallbackMessage(response.status);
        }
      }

      // Check if parsed already matches ApiResponse shape
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'succeeded' in (parsed as any)
      ) {
        return parsed as ApiResponse<T>;
      }

      return {
        succeeded: false,
        data: null as any,
        message,
        code: response.status.toString(),
        errors: (parsed as any)?.errors || []
      };
    }

    // if response is ok, we assume the backend has returned an ApiResponse<T>
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'succeeded' in (parsed as any)
    ) {
      return parsed as ApiResponse<T>;
    }

    // Fallback if backend didn't wrap it in an ApiResponse for some reason,
    // although they should always wrap it given our C# Response models
    return {
      succeeded: true,
      data: parsed as T,
      message: 'Success',
      code: '200',
      errors: []
    };
  } catch (error: any) {
    console.error(`[fetchServer Error] ${method} ${url}:`, error.message);
    return {
      succeeded: false,
      data: null as any,
      message: 'Network error or server is unreachable',
      code: '500',
      errors: [error.message]
    };
  }
}

function getFallbackMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'You must be logged in to do that';

    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'Resource not found';
    case 409:
      return 'Resource conflict';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Bad gateway. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 504:
      return 'Gateway timeout. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
}
