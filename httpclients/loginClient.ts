import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { LoginDto } from '../types/auth';

const SIGNIN_ENDPOINT = '/api/v1/users/signin';

export class LoginClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  login(data: LoginDto): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${SIGNIN_ENDPOINT}`, {
      data,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
