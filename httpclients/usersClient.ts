import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { buildAuthHeaders } from './httpUtils';

export const USERS_ME_ENDPOINT = '/api/v1/users/me';
export const USERS_ENDPOINT = '/api/v1/users';

export class UsersClient {
  constructor(private readonly request: APIRequestContext) {}

  async getMe(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_ME_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async getUserByUsername(username: string, token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_ENDPOINT}/${username}`, {
      headers: buildAuthHeaders(token)
    });
  }
}
