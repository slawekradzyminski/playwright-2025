import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { RefreshTokenRequestDto } from '../types/auth';

const REFRESH_ENDPOINT = '/api/v1/users/refresh';

export class RefreshClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  refresh(data: RefreshTokenRequestDto): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${REFRESH_ENDPOINT}`, {
      data,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
