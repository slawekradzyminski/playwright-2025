import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { LoginDto } from '../../../types/auth';
import { jsonHeaders } from './headers';

const SIGNIN_ENDPOINT = '/users/signin';

export const loginRequest = (request: APIRequestContext, data: LoginDto): Promise<APIResponse> =>
  request.post(SIGNIN_ENDPOINT, {
    data,
    headers: jsonHeaders,
  });
