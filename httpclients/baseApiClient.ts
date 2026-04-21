import type { APIRequestContext, APIResponse } from '@playwright/test';

type RequestOptions = NonNullable<Parameters<APIRequestContext['get']>[1]>;
type RequestHeaders = Record<string, string>;

export const INVALID_TOKEN = 'invalid-token';

export const API_ERROR_MESSAGES = {
  unauthorized: 'Unauthorized',
  invalidOrExpiredToken: 'Invalid or expired token'
} as const;

export abstract class BaseApiClient {
  constructor(private readonly request: APIRequestContext) {}

  protected get(endpoint: string, token?: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.request.get(endpoint, this.withAuth(options, token));
  }

  protected delete(endpoint: string, token?: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.request.delete(endpoint, this.withAuth(options, token));
  }

  protected postJson(
    endpoint: string,
    data?: unknown,
    token?: string,
    options: RequestOptions = {}
  ): Promise<APIResponse> {
    return this.request.post(endpoint, this.withJson(options, data, token));
  }

  protected putJson(
    endpoint: string,
    data?: unknown,
    token?: string,
    options: RequestOptions = {}
  ): Promise<APIResponse> {
    return this.request.put(endpoint, this.withJson(options, data, token));
  }

  protected buildUrl(endpoint: string, query: object): string {
    const url = new URL(endpoint, 'http://localhost:8081'); // Base URL is required to use URL API, but it will be removed in the returned string

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    return `${url.pathname}${url.search}`;
  }

  private withJson(options: RequestOptions, data: unknown, token?: string): RequestOptions {
    return {
      ...this.withAuth(options, token),
      data,
      headers: {
        ...this.headersFrom(options),
        'Content-Type': 'application/json',
        ...this.authHeader(token)
      }
    };
  }

  private withAuth(options: RequestOptions, token?: string): RequestOptions {
    return {
      ...options,
      headers: {
        ...this.headersFrom(options),
        ...this.authHeader(token)
      }
    };
  }

  private headersFrom(options: RequestOptions): RequestHeaders {
    return (options.headers ?? {}) as RequestHeaders;
  }

  private authHeader(token?: string): RequestHeaders {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
