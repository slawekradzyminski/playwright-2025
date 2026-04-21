import type { APIResponse } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { BaseApiClient } from './baseApiClient';

export const SIGNUP_ENDPOINT = '/api/v1/users/signup';

export class SignupClient extends BaseApiClient {
  async signup(userData: UserRegisterDto): Promise<APIResponse> {
    return this.postJson(SIGNUP_ENDPOINT, userData);
  }
}
