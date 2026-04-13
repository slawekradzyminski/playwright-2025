import type { APIRequestContext, APIResponse } from '@playwright/test';

const ME_ENDPOINT = '/api/v1/users/me';

export class UserClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  getMe(token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${ME_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  deleteUser(username: string, token?: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/api/v1/users/${username}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }
}
