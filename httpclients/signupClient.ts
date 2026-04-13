import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { SignupDto } from '../types/auth';

const SIGNUP_ENDPOINT = '/api/v1/users/signup';

export class SignupClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  signup(data: SignupDto): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${SIGNUP_ENDPOINT}`, {
      data,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
