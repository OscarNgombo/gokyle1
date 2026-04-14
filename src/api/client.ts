import { apiV1BaseUrl } from '@/api/config';

type QueryParamValue = string | number | boolean | null | undefined;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  authToken?: string | null;
  body?: unknown;
  query?: Record<string, QueryParamValue>;
}

const buildUrl = (path: string, query?: Record<string, QueryParamValue>) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${apiV1BaseUrl}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

const parseResponseBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(rawBody);
  }

  return rawBody;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const request = async <T>(path: string, { authToken, body, headers, query, ...init }: RequestOptions = {}): Promise<T> => {
  const hasJsonBody = body !== undefined;
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: hasJsonBody ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, response.status, data);
  }

  return data as T;
};

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <TResponse, TBody>(path: string, body: TBody, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<TResponse>(path, { ...options, body, method: 'POST' }),
  patch: <TResponse, TBody>(path: string, body: TBody, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<TResponse>(path, { ...options, body, method: 'PATCH' }),
  put: <TResponse, TBody>(path: string, body: TBody, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<TResponse>(path, { ...options, body, method: 'PUT' }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
