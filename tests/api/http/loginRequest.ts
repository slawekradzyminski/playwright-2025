import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { LoginDto } from '../../../types/auth';

const SIGNIN_ENDPOINT = '/users/signin';

export const loginRequest = (request: APIRequestContext, data: LoginDto): Promise<APIResponse> =>
  request.post(SIGNIN_ENDPOINT, {
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
