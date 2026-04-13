import type { APIRequestContext, APIResponse } from '@playwright/test';

const LOGOUT_ENDPOINT = '/api/v1/users/logout';

export class LogoutClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  logout(token?: string): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${LOGOUT_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }
}
