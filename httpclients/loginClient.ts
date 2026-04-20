import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { APP_BASE_URL } from '../config/constants';

export const SIGNIN_ENDPOINT = '/api/v1/users/signin';

export class LoginClient {
  constructor(private readonly request: APIRequestContext) {}

  async signin(loginData: LoginDto): Promise<APIResponse> {
    return this.request.post(`${APP_BASE_URL}${SIGNIN_ENDPOINT}`, {
      data: loginData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
