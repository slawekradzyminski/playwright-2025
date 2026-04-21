import type { APIResponse } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { BaseApiClient } from './baseApiClient';

export const SIGNIN_ENDPOINT = '/api/v1/users/signin';

export class LoginClient extends BaseApiClient {
  async signin(loginData: LoginDto): Promise<APIResponse> {
    return this.postJson(SIGNIN_ENDPOINT, loginData);
  }
}
