import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';

export const USERS_ME_ENDPOINT = '/api/v1/users/me';
export const USERS_ENDPOINT = '/api/v1/users';

export class UsersClient {
  constructor(private readonly request: APIRequestContext) {}

  async getMe(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_ME_ENDPOINT}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : undefined
    });
  }

  async getUserByUsername(username: string, token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_ENDPOINT}/${username}`, {
      headers: addHeaders(token)
    });
  }
}

const addHeaders = (token?: string) => {
  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : undefined;
};
