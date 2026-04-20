import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { APP_BASE_URL } from '../config/constants';

export const SIGNUP_ENDPOINT = '/api/v1/users/signup';

export class SignupClient {
  constructor(private readonly request: APIRequestContext) {}

  async signup(userData: UserRegisterDto): Promise<APIResponse> {
    return this.request.post(`${APP_BASE_URL}${SIGNUP_ENDPOINT}`, {
      data: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
